// /functions/middleware.js
export async function onRequest(context) {
  // Preflight
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers: cors(context.request) });
  }

  const res = await context.next();
  const { pathname } = new URL(context.request.url);

  if (/^\/[a-z]{2}(-[A-Z]{2})?\.json$/.test(pathname)) {
    const h = new Headers(res.headers);
    Object.entries(cors(context.request)).forEach(([k, v]) => h.set(k, v));
    return new Response(res.body, { status: res.status, headers: h });
  }
  return res;
}

function cors(req) {
  const origin = req.headers.get('origin') || '';
  const allow = [
    'https://rpfo.webflow.io',
    'https://www.rpfo.ca',
    'https://go.outseta.com',
    'https://app.outseta.com'
  ];
  const allowedOrigin = allow.includes(origin) ? origin : allow[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Vary': 'Origin'
  };
}
