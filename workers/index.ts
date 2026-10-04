/// <reference types="@cloudflare/workers-types" />

export interface Env {
  DB: D1Database;
  SESSIONS: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return Response.json({
        ok: true,
        service: "steavpn-api",
        time: new Date().toISOString(),
      });
    }

    return new Response("Not found", { status: 404 });
  },
};
