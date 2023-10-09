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

export type { IlinkResponse, IStatResponse, ICreateLinkObject };