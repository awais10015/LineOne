export function encodeFeedCursor(post) {
  if (!post?.createdAt || !post?._id) return null;
  const payload = {
    createdAt: new Date(post.createdAt).toISOString(),
    id: String(post._id),
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

export function decodeFeedCursor(cursor) {
  if (!cursor) return null;
  try {
    const parsed = JSON.parse(
      Buffer.from(cursor, "base64url").toString("utf8")
    );
    if (!parsed.createdAt || !parsed.id) return null;
    return parsed;
  } catch {
    return null;
  }
}
