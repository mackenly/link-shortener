import router from './router';
import { Env } from '../worker-configuration';

// Export a default object containing event handlers
export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		return router.fetch(request, env, ctx);
	},
};
