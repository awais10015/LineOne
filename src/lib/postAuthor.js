/** Attach profile author when post.postBy is missing (e.g. own profile from currentUser). */
export function withPostAuthor(post, authorUser) {
  if (!post) return post;
  if (post?.postBy?._id || post?.postBy) return post;
  if (!authorUser?._id) return post;

  return {
    ...post,
    postBy: {
      _id: authorUser._id,
      name: authorUser.name,
      username: authorUser.username,
      profilePic: authorUser.profilePic,
      gender: authorUser.gender,
    },
  };
}
