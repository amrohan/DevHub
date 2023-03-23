import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

// UI component for main post content
export default function PostContent({ post }) {
  const createdAt =
    typeof post?.createdAt === "number"
      ? new Date(post.createdAt)
      : post.createdAt.toDate();

  return (
    <div className="card">
      <h1 className="text-[#D8D8D8]">{post?.title}</h1>
      <span className="text-sm">
        Written by{" "}
        <Link href={`/${post.username}/`}>
          <a className="text-[#D27685]">@{post.username}</a>
        </Link>{" "}
        on {createdAt.toISOString()}
      </span>

      <ReactMarkdown
        className="prose prose-slate prose-pre:rounded-xl prose-pre:text-sm prose-h1:text-[#ECE8DD] dark:prose-invert prose-img:shadow-2xl prose-video:rounded-2xl  prose-strong:text-[#FFACC7] prose-img:w-11/12 prose-img:mx-auto prose-video:mx-auto prose-blockquote:text-cyan-600 lg:prose-l prose-a:text-[#579BB1] hover:prose-a:text-teal-500 prose-img:rounded-lg"
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                style={coldarkDark}
                language={match[1]}
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {post?.content}
      </ReactMarkdown>
    </div>
  );
}
