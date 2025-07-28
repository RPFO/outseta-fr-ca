// /functions/middleware.js
export async function onRequest(context) {
  const req = context.request;
  const url = new URL(req.url);

  // 1) Handle preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(req) });
  }

  // 2) Let Pages serve the file
  const res = await context.next();

  // 3) Only add CORS for our locale JSON files
  if (/^\/[a-z]{2}(-[A-Z]{2})?\.json$/.test(url.pathname)) {
    const headers = new Headers(res.headers);
    const extra = corsHeaders(req);
    for (const [k, v] of Object.entries(extra)) headers.set(k, v);
    return new Response(res.body, { status: res.status, headers });
  }

  return res;
}

function corsHeaders(req) {
  const origin = req.headers.get('origin') || '';
  const allowList = [
    'https://rpfo.webflow.io',
    'https://www.rpfo.ca',
  ];
  const allowedOrigin = allowList.includes(origin) ? origin : allowList[0];

  // Browser tells us what headers it wants in Access-Control-Request-Headers
  const reqHeaders = req.headers.get('access-control-request-headers') || 'Authorization, Content-Type';

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': reqHeaders,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin, Access-Control-Request-Headers'
  };
}
