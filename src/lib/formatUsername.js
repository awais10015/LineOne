/** Display username with exactly one leading @ */
export function formatDisplayUsername(username) {
  if (!username) return "";
  const trimmed = String(username).trim();
  const handle = trimmed.startsWith("@") ? trimmed.slice(1) : trimmed;
  return handle ? `@${handle}` : "";
}

/** Persist username with a single leading @ */
export function normalizeUsername(username) {
  if (!username) return "";
  let handle = String(username).trim().toLowerCase().replace(/\s+/g, "");
  if (handle.startsWith("@")) handle = handle.slice(1);
  return handle ? `@${handle}` : "";
}
