import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { UnstableDevWorker } from "wrangler";
import { unstable_dev } from "wrangler";

describe("Worker", () => {

    let worker: UnstableDevWorker;

    beforeAll(async () => {
        worker = await unstable_dev("src/index.ts", {
            experimental: { disableExperimentalWarning: false },
            config: "wrangler-test.toml"
        });
    });

    afterAll(async () => {
        await worker.stop();
    });

    it("should return 404 for non-existent slug", async () => {
        const { status, headers } = await worker.fetch(`http://${worker.address}:8787/im-not-a-slug`);
        expect(status).toBe(404);
        expect(headers.get("content-type")).toBe("application/json;charset=UTF-8");
    });
    it("should redirect to redirect url for the root/index path", async () => {
        const { redirected, url } = await worker.fetch(`http://${worker.address}:8787/`);
        expect(redirected).toBe(true);
        expect(url).toContain("https://mackenly.com");
    });
    it("should return 200 for the dashboard", async () => {
        const { status, headers } = await worker.fetch(`http://${worker.address}:8787/dashboard`);
        expect(status).toBe(200);
        expect(headers.get("content-type")).toBe("text/html;charset=UTF-8");
    });
    it("should return 200 for the dashboard styles", async () => {
        const { status, headers } = await worker.fetch(`http://${worker.address}:8787/dashboard/styles.css`);
        expect(status).toBe(200);
        expect(headers.get("content-type")).toBe("text/css;charset=UTF-8");
    });
    it("should return 401 if authorization header is not set to the public/external create route", async () => {
        const response = await worker.fetch(`http://${worker.address}:8787/api/external/links`, {
            method: "POST",
        });
        expect(response.status).toBe(401);
        expect(response.headers.get("content-type")).toBe("application/json;charset=UTF-8");
        const responseBody: any = await response.json();
        expect(responseBody.error).toBe("Unauthorized.");
    });

    it("should return 401 if api key is invalid to the public/external create route", async (env) => {
        const response = await worker.fetch(`http://${worker.address}:8787/api/external/links`, {
            method: "POST",
            headers: {
                authorization: "Bearer invalid-api-key",
            },
        });
        expect(response.status).toBe(401);
        expect(response.headers.get("content-type")).toBe("application/json;charset=UTF-8");
        const responseBody: any = await response.json();
        expect(responseBody.error).toBe("Unauthorized.");
    });
    it("should be able to create a link using the public/external route and it should redirect", async () => {
        const response = await worker.fetch(`http://${worker.address}:8787/api/external/links`, {
            method: "POST",
            headers: {
                authorization: `Bearer testing-password`,
            },
            body: JSON.stringify({
                url: "https://mackenly.com",
                ttl: 61,
            }),
        });

        expect(response.status).toBe(200);
        expect(response.headers.get("content-type")).toBe("application/json;charset=UTF-8");
        const responseBody: any = await response.json();
        expect(responseBody.slug).toBeDefined();
        expect(responseBody.url).toBe("https://mackenly.com");
        expect(responseBody.ttl).toBe(61);
        expect(responseBody.meta).toEqual({});
        expect(responseBody.owner).toBe("anonymous");
        expect(responseBody.short_url).toBeDefined();

        const slug = responseBody.slug;
        const redirectResponse = await worker.fetch(`http://${worker.address}:8787/${slug}`);
        expect(redirectResponse.redirected).toBe(true);
        expect(redirectResponse.url).toContain("https://mackenly.com");
    });
    it("should create short links with a path length of 6", async () => {
        const response = await worker.fetch(`http://${worker.address}:8787/api/external/links`, {
            method: "POST",
            headers: {
                authorization: `Bearer testing-password`,
            },
            body: JSON.stringify({
                url: "https://mackenly.com",
                ttl: 60,
            }),
        });
        expect(response.status).toBe(200);
        expect(response.headers.get("content-type")).toBe("application/json;charset=UTF-8");
        const responseBody: any = await response.json();
        expect(responseBody.slug).toBeDefined();
        const slug = responseBody.slug;
        expect(slug.length).toBe(6);
    });
    it("should return 400 if ttl is less than 60", async () => {
        const response = await worker.fetch(`http://${worker.address}:8787/api/external/links`, {
            method: "POST",
            headers: {
                authorization: `Bearer testing-password`,
            },
            body: JSON.stringify({
                url: "https://mackenly.com",
                ttl: 59,
            }),
        });
        expect(response.status).toBe(400);
        expect(response.headers.get("content-type")).toBe("application/json;charset=UTF-8");
        const responseBody: any = await response.json();
        expect(responseBody.error).toBe("TTL must be greater than 60 seconds.");
    });
    it ("should return 400 if ttl is greater than 315360000", async () => {
        const response = await worker.fetch(`http://${worker.address}:8787/api/external/links`, {
            method: "POST",
            headers: {
                authorization: `Bearer testing-password`,
            },
            body: JSON.stringify({
                url: "https://mackenly.com",
                ttl: 315360001,
            }),
        });
        expect(response.status).toBe(400);
        expect(response.headers.get("content-type")).toBe("application/json;charset=UTF-8");
        const responseBody: any = await response.json();
        expect(responseBody.error).toBe("TTL must be less than 315360000 seconds.");
    });
});