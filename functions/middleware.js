// functions/middleware.js
export async function onRequest(context) {
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders(context.request) });
  }

  const res = await context.next();
  const { pathname } = new URL(context.request.url);

  if (/^\/[a-z]{2}(-[A-Z]{2})?\.json$/.test(pathname)) {
    const h = new Headers(res.headers);
    Object.entries(corsHeaders(context.request)).forEach(([k, v]) => h.set(k, v));
    return new Response(res.body, { status: res.status, headers: h });
  }

  return res;
}

function corsHeaders(req) {
  const origin = req.headers.get('origin') || '';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Vary': 'Origin'
  };
}
