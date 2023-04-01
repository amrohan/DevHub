import Link from "next/link";

export default function PostFeed({ posts, admin }) {
  return posts
    ? posts.map((post) => (
        <PostItem post={post} key={post.slug} admin={admin} />
      ))
    : null;
}

function PostItem({ post, admin = false }) {
  // Naive method to calc word count and read time
  const wordCount = post?.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);

  return (
    <div className="card ">
      <Link href={`/${post.username}`}>
        <a>
          <strong>By @{post.username}</strong>
        </a>
      </Link>

      <Link href={`/${post.username}/${post.slug}`}>
        <h2 className="py-3">
          <a>{post.title}</a>
        </h2>
      </Link>

      <footer>
        <span className="text-slate-300">
          {wordCount} words. {minutesToRead} min read
        </span>
        <span className="push-left">👍 {post.heartCount || 0}</span>
      </footer>

      {/* If admin view, show extra controls for user */}
      {admin && (
        <>
          <Link href={`/admin/${post.slug}`}>
            <h3 className="pt-2">
              <button
                type="button"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Edit
              </button>
            </h3>
          </Link>

          {post.published ? (
            <p className="text-success mt-3">Live</p>
          ) : (
            <p className="text-danger mt-3">Unpublished</p>
          )}
        </>
      )}
    </div>
  );
}
