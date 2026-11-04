export async function parseJsonResponse(res, fallback = {}) {
  const text = await res.text();
  if (!text.trim()) return fallback;
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}
