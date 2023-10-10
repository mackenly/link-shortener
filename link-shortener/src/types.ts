import { Request } from '@cloudflare/workers-types';

interface Env {
    API_KEY: string;
    LINK_SHORTENER: {
        get: (key: string) => Promise<string>;
        getWithMetadata: (key: string) => Promise<{ value: string; metadata: Metadata; }>;
        list: ( prefix?: string, limit?: number, cursor?: string ) => Promise<{ keys: Array<{ name: string; expiration: number; metadata: Metadata; }>; list_complete: Boolean; cursor: string; }>;
        put: (key: string, value: string, options: { metadata: Metadata; expirationTtl: number }) => Promise<void>;
        delete: (key: string) => Promise<void>;
    };
}

interface Metadata {
    meta: object;
    hits: number;
    owner: string;
    url: string;
    expiration?: number;
}

interface IlinkResponse {
    slug: string;
    url: string;
    expiration: number;
    meta: object;
    hits: number;
    owner: string;
}

interface IStatResponse {
    slug: string;
    url: string;
    hits: number;
}

interface ICreateLinkObject {
    url: string;
    ttl?: number;
    meta?: object;
    owner?: string;
}

interface ICreateLinkResponse {
    slug: string;
    url: string;
    ttl: number;
    meta: object;
    owner: string;
    short_url: string;
}

interface WorkerRequest extends Request {
    params: {
        id: string;
    };
}

export type { IlinkResponse, IStatResponse, ICreateLinkObject, ICreateLinkResponse, Env, WorkerRequest, Metadata };