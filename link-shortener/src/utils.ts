import { ICreateLinkResponse, ICreateLinkObject, WorkerRequest, Env } from './types';
import { customAlphabet } from 'nanoid';

export async function handleCreateLink(request: WorkerRequest, env: Env): Promise<Response> {
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
    const url: string = content.url;
    const ttl: number = content.ttl || 7776000; // 90 days
    const meta: object = content.meta || {};
    const owner: string = content.owner || 'anonymous';

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
    // generate slug
    const nanoid = customAlphabet(
        '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
        6,
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
    });
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
        title = 'No Page Title Found';
    }

    // return title
    return title;
}