import { Router } from 'itty-router';
import { customAlphabet } from 'nanoid';
import { imageSync } from 'qr-image';
import { ICreateLinkObject, IlinkResponse, IStatResponse } from './types';

// @ts-ignore
import Dashboard_HTML from './dashboard.html';
// @ts-ignore
import Dashboard_CSS from './assets/styles.css';

// now let's create a router (note the lack of "new")
const router = Router();

// Dashboard page
router.get('/dashboard', async (request) => {
	return new Response(Dashboard_HTML, {
		headers: {
			'content-type': 'text/html;charset=UTF-8',
		},
	});
});

router.get('/dashboard/styles.css', async (request) => {
	return new Response(Dashboard_CSS, {
		headers: {
			'content-type': 'text/css;charset=UTF-8',
		},
	});
});

// GET a slug to redirect
router.get('/:id', async (params, env) => {
	// get link
	const response = await env.LINK_SHORTENER.getWithMetadata(params.params.id);

	// check if exists
	if (response.value === null || response.metadata === null) {
		return new Response(JSON.stringify({
			"error": "Not found.",
		}), {
			status: 404,
			headers: {
				"content-type": "application/json;charset=UTF-8",
			},
		});
	}

	const { value, metadata } = response;

	// increment hits
	await env.LINK_SHORTENER.put(params.params.id, value, {
		metadata: {
			meta: metadata.meta,
			hits: Number(metadata.hits) + 1,
			owner: metadata.owner,
			url: metadata.url,
		},
		expirationTtl: metadata.expiration,
	});

	// return response
	return Response.redirect(value, 301);
});

// GET all links
router.get('/api/links', async (params, env) => {
	// get all links
	const links = await env.LINK_SHORTENER.list();

	// return response
	const linkResponse: any[] = [];

	for (const link of links.keys) {
		linkResponse.push({
			"slug": link.name,
			"url": link.metadata.url,
			"expiration": link.expiration,
			"meta": link.metadata.meta,
			"hits": link.metadata.hits,
			"owner": link.metadata.owner,
		});
	}

	return new Response(JSON.stringify(linkResponse), { status: 200 });
});

// GET link stats
router.get('/api/links/:id/stats', async (params, env) => {
	// get link
	const response = await env.LINK_SHORTENER.getWithMetadata(params.params.id);

	// check if exists
	if (response.value === null || response.metadata === null) {
		return new Response(JSON.stringify({
			"error": "Not found.",
		}), {
			status: 404,
			headers: {
				"content-type": "application/json;charset=UTF-8",
			},
		});
	}

	const { value, metadata } = response;

	// return response
	const statResponse: IStatResponse = {
		"slug": params.params.id,
		"url": value,
		"hits": metadata.hits,
	}

	return new Response(JSON.stringify(statResponse), { status: 200 });
});

// GET QR code
router.get('/api/links/:id/qr', async (request) => {
	console.log(request.params);
	const url = `${new URL(request.url).origin}/${request.params.id}`;
	const qr = imageSync(url, { type: 'png' });
	return new Response(qr, {
		headers: {
			'content-type': 'image/png',
		},
	});
});

// DELETE link
router.delete('/api/links/:id', async (params, env) => {
	env.LINK_SHORTENER.delete(params.params.id);
	return new Response(JSON.stringify({
		"message": "Link deleted.",
	}), { status: 200 });
});

// GET item
router.get('/api/links/:id', async (params, env) => {
	// get link
	const response = await env.LINK_SHORTENER.getWithMetadata(params.params.id);

	// check if slug exists
	if (response.value === null || response.metadata === null) {
		return new Response(JSON.stringify({
			"error": "Not found.",
		}), {
			status: 404,
			headers: {
				"content-type": "application/json;charset=UTF-8",
			},
		});
	}

	const { value, metadata } = response;

	// return response
	const linkResponse: IlinkResponse = {
		"slug": params.params.id,
		"url": value,
		"expiration": metadata.expiration,
		"meta": metadata.meta,
		"hits": metadata.hits,
		"owner": metadata.owner,
	}
	return new Response(JSON.stringify(linkResponse), { status: 200 });
});

// POST to the collection
router.post('/api/links', async (request, env) => {
	const content: ICreateLinkObject = await request.json();

	// validate the content
	if (!content.url) {
		return new Response(JSON.stringify({
			"error": "URL is required.",
		}), {
			status: 400,
			headers: {
				"content-type": "application/json;charset=UTF-8",
			},
		});
	}

	// get variables
	const url = content.url;
	const ttl = content.ttl || 7776000; // 90 days
	const meta = content.meta || {};
	const owner = content.owner || 'anonymous';

	// generate slug
	const nanoid = customAlphabet(
		'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
		6,
	);
	const slug = nanoid();

	// check if slug exists
	try {
		const check = await env.LINK_SHORTENER.get(slug);
		if (check !== null) {
			return new Response(JSON.stringify({
				"error": "Slug already exists.",
			}), {
				status: 404,
				headers: {
					"content-type": "application/json;charset=UTF-8",
				},
			});
		}
	}
	catch (e) {
		return new Response(JSON.stringify({
			"error": "Slug already exists.",
		}), {
			status: 404,
			headers: {
				"content-type": "application/json;charset=UTF-8",
			},
		});
	}

	// get title from url
	const urlBody = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'text/html',
		},
	});
	const urlText = await urlBody.text();
	// @ts-ignore
	const title = urlText.match(/<title[^>]*>([^<]+)<\/title>/)[1] || 'Untitled';


	// create link
	await env.LINK_SHORTENER.put(slug, url, {
		metadata: {
			meta: {
				title: title ? title : 'Untitled',
				...meta,
			},
			hits: 0,
			owner: owner,
			url: url,
			expiration: ttl,
		},
		expirationTtl: ttl
	});

	// short url
	const shortUrl = `${new URL(request.url).origin}/${slug}`;

	// return response
	return new Response(JSON.stringify({
		"slug": slug,
		"url": url,
		"ttl": ttl,
		"meta": meta,
		"owner": owner,
		"short_url": shortUrl,
	}), { status: 201 });
});

router.get('/', async (request) => {
	// redirect to the dashboard page
	return Response.redirect(new URL(request.url).origin + '/dashboard', 307);
});

// 404 for everything else
router.all('*', () => {
	return new Response(JSON.stringify({
		"error": "Not found.",
	}), {
		status: 404,
		headers: {
			"content-type": "application/json;charset=UTF-8",
		},
	});
});

export default router;
