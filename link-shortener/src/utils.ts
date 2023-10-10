import { ICreateLinkResponse, ICreateLinkObject, WorkerRequest, Env } from './types';
import { customAlphabet } from 'nanoid';

export async function handleCreateLink(request: WorkerRequest, env: Env): Promise<Response> {
    var content: ICreateLinkObject;
    try {
        content = await request.json();
    } catch (e) {
        return new Response(JSON.stringify({
            "error": "Invalid JSON.",
        }), {
            status: 400,
            headers: {
                "content-type": "application/json;charset=UTF-8",
            },
        });
    }

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
    const url: string = content.url;
    const ttl: number = content.ttl || 7776000; // 90 days
    const meta: object = content.meta || {};
    const owner: string = content.owner || 'anonymous';

    if (ttl < 60) {
        return new Response(JSON.stringify({
            "error": "TTL must be greater than 60 seconds.",
        }), {
            status: 400,
            headers: {
                "content-type": "application/json;charset=UTF-8",
            },
        });
    } else if (ttl > Number(env.MAX_TTL)) {
        return new Response(JSON.stringify({
            "error": "TTL must be less than " + env.MAX_TTL + " seconds.",
        }), {
            status: 400,
            headers: {
                "content-type": "application/json;charset=UTF-8",
            },
        });
    }

    // generate slug
    const slug: string = await generateSlug(env);

    // get title from url
    let title: string;
    try {
        title = await getPageTitleFromURL(url);
    }
    catch (e) {
        title = 'Untitled';
    }

    // create link
    try {
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
    } catch (e) {
        return new Response(JSON.stringify({
            "error": "An error occurred while creating the link.",
        }), {
            status: 500,
            headers: {
                "content-type": "application/json;charset=UTF-8",
            },
        });
    }

    // short url
    const shortUrl = `${new URL(request.url).origin}/${slug}`;

    // return response
    return new Response(JSON.stringify({
        slug: slug,
        url: url,
        ttl: ttl,
        meta: meta,
        owner: owner,
        short_url: shortUrl,
    } as ICreateLinkResponse),
        {
            status: 200,
            headers: {
                "content-type": "application/json;charset=UTF-8",
            },
        });
}

async function generateSlug(env: Env): Promise<string> {
    // slug length
    const slugLength = Number(env.SLUG_LENGTH) || 6;
    // generate slug
    const nanoid = customAlphabet(
        '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
        slugLength,
    );
    const slug: string = nanoid();

    // check if slug exists
    try {
        const check = await env.LINK_SHORTENER.get(slug);
        if (check !== null) {
            throw new Error('Slug already exists.');
        }
    }
    catch (e) {
        // recursively generate new slug
        return generateSlug(env);
    }

    // return slug
    return slug;
}

async function getPageTitleFromURL(url: string): Promise<string> {
    // get title from url
    const urlBody = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'text/html',
        },
    })
    const urlText = await urlBody.text();
    // @ts-ignore
    let title = urlText.match(/<title[^>]*>([^<]+)<\/title>/)[1] || 'Untitled';

    // sanitize and trim title
    title = title.replace(/[^a-zA-Z0-9 ]/g, '');
    title = title.trim();

    // truncate title
    if (title.length > 100) {
        title = title.substring(0, 100);
    }

    // if not a valid title, return Untitled
    if (title.length === 0) {
        title = 'Untitled';
    }

    // return title
    return title;
}