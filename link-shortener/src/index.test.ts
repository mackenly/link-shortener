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
    it("should return 200 for the dashboard", async () => {
        const { status, headers } = await worker.fetch(`http://${worker.address}:8787/dashboard`);
        expect(status).toBe(200);
        expect(headers.get("content-type")).toBe("text/html;charset=UTF-8");
    });
});