export async function onRequest(context) {
  const { request, env, waitUntil } = context;

  const CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, x-api-client",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  // if (request.headers.get("x-api-client") !== "portfolio-client") {
  //   return new Response(JSON.stringify({ error: "Forbidden" }), {
  //     status: 403,
  //     headers: { "Content-Type": "application/json", ...CORS },
  //   });
  // }

  // ── R2 helpers ──────────────────────────────────────────────────────────────

  async function readR2() {
    const obj = await env.PORTFOLIO_R2.get("data:portfolio");
    if (!obj) return null;
    return await obj.json();
  }

  async function fetchAndStore() {
    const res = await fetch(env.SHEETS_API_URL);
    if (!res.ok) throw new Error("Sheets fetch failed");
    const freshData = await res.json();

    const existing = await readR2();
    if (existing && JSON.stringify(freshData) === JSON.stringify(existing)) {
      return existing;
    }

    await env.PORTFOLIO_R2.put("data:portfolio", JSON.stringify(freshData), {
      httpMetadata: { contentType: "application/json" },
    });

    return freshData;
  }

  // ── Serve ───────────────────────────────────────────────────────────────────

  let data;
  try {
    const cached = await readR2();

    if (cached) {
      data = cached;
      waitUntil(fetchAndStore().catch(() => {}));
    } else {
      data = await fetchAndStore();
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...CORS },
    });
  }

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json", ...CORS },
  });
}