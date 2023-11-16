import { Router } from 'itty-router';
import { imageSync } from 'qr-image';
import { IlinkResponse, IStatResponse, Metadata, Env, WorkerRequest } from './types';
import { handleCreateLink } from './utils';

// @ts-ignore
import Dashboard_HTML from './dashboard.html';
// @ts-ignore
import Dashboard_CSS from './assets/styles.css';

const router = Router();

// Dashboard page
router.get('/dashboard', async (request: WorkerRequest) => {
	return new Response(Dashboard_HTML, {
		headers: {
			'content-type': 'text/html;charset=UTF-8',
		},
	});
});

// Dashboard styles
router.get('/dashboard/styles.css', async (request: WorkerRequest) => {
	return new Response(Dashboard_CSS, {
		headers: {
			'content-type': 'text/css;charset=UTF-8',
		},
	});
});

// GET a slug to redirect
router.get('/:id', async (request: WorkerRequest, env: Env) => {
	// get link
	const response = await env.LINK_SHORTENER.getWithMetadata(request.params.id);

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
	await env.LINK_SHORTENER.put(request.params.id, value, {
		metadata: {
			meta: metadata.meta,
			hits: Number(metadata.hits) + 1,
			owner: metadata.owner,
			url: metadata.url,
			expiration: metadata.expiration,
		},
		expirationTtl: metadata.expiration || 0,
	});

	// return response
	return Response.redirect(value, 307);
});

// GET all links
router.get('/api/links', async (request: WorkerRequest, env: Env) => {
	// get all links
	const links = await env.LINK_SHORTENER.list();

	// return response
	const linkResponse: Array<IlinkResponse> = [];

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

	return new Response(JSON.stringify(linkResponse), { 
		status: 200,
		headers: {
			"content-type": "application/json;charset=UTF-8",
		},
	});
});

// GET link stats
router.get('/api/links/:id/stats', async (request: WorkerRequest, env: Env) => {
	// get link
	const response = await env.LINK_SHORTENER.getWithMetadata(request.params.id);

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
		"slug": request.params.id,
		"url": value,
		"hits": metadata.hits,
	}

	return new Response(JSON.stringify(statResponse), { status: 200 });
});

// GET QR code
router.get('/api/links/:id/qr', async (request: WorkerRequest) => {
	const url = `${new URL(request.url).origin}/${request.params.id}`;
	const qr = imageSync(url, { type: 'png' });
	return new Response(qr, {
		headers: {
			'content-type': 'image/png',
		},
	});
});

// DELETE link
router.delete('/api/links/:id', async (request: WorkerRequest, env: Env) => {
	env.LINK_SHORTENER.delete(request.params.id);
	return new Response(JSON.stringify({
		"message": "Link deleted.",
	}), { status: 200 });
});

// GET item
router.get('/api/links/:id', async (request: WorkerRequest, env: Env) => {
	// get link
	//const response = await env.LINK_SHORTENER.getWithMetadata(request.params.id);
	const response: { value: string; metadata: Metadata; } = await env.LINK_SHORTENER.getWithMetadata(request.params.id);

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
		"slug": request.params.id,
		"url": value,
		"expiration": metadata.expiration || 0,
		"meta": metadata.meta,
		"hits": metadata.hits,
		"owner": metadata.owner,
	}
	return new Response(JSON.stringify(linkResponse), { status: 200 });
});

// Internal POST link
router.post('/api/links', async (request: WorkerRequest, env: Env) => {
	return await handleCreateLink(request, env);
});

// Publicly accessible API POST link
router.post('/api/external/links', async (request: WorkerRequest, env: Env) => {
	// if authorization header is not set, return 401
	if (!request.headers.get('authorization')) {
		return new Response(JSON.stringify({
			"error": "Unauthorized.",
		}), {
			status: 401,
			headers: {
				"content-type": "application/json;charset=UTF-8",
			},
		});
	}
	
	const apiKey = request.headers.get('authorization')?.split(' ')[1] || '';

	// check if api key is valid
	if (apiKey !== env.API_KEY) {
		return new Response(JSON.stringify({
			"error": "Unauthorized.",
		}), {
			status: 401,
			headers: {
				"content-type": "application/json;charset=UTF-8",
			},
		});
	}
	return await handleCreateLink(request, env);
});

router.get('/', async (request: WorkerRequest, env: Env) => {
	// redirect url env
	const redirectUrl = env.ROOT_REDIRECT;
	if (!redirectUrl || redirectUrl === '' || redirectUrl === 'undefined' || redirectUrl === 'null') {
		return Response.redirect(new URL(request.url).origin + '/dashboard', 307);
	} else {
		return Response.redirect(redirectUrl, 307);
	}
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
