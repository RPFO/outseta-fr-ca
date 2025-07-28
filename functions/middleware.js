// functions/middleware.js

export async function onRequest(context) {
  // 1) Let Pages serve the asset first (your JSON)
  const res = await context.next();

  // 2) If it's one of our translation files, tack on full CORS
  if (context.request.url.match(/\/[a-z]{2}(-[A-Z]{2})?\.json$/)) {
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "*");
    // ← the critical header for credentialed requests:
    res.headers.set("Access-Control-Allow-Credentials", "true");
  }

  return res;
}
