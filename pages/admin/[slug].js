import styles from "@styles/Admin.module.css";
import AuthCheck from "@components/AuthCheck";
import { firestore, auth, serverTimestamp } from "@lib/firebase";
import ImageUploader from "@components/ImageUploader";

import { useState } from "react";
import { useRouter } from "next/router";

import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import toast from "react-hot-toast";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export default function AdminPostEdit(props) {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
}

function PostManager() {
  const [preview, setPreview] = useState(false);

  const router = useRouter();
  const { slug } = router.query;

  const postRef = firestore
    .collection("users")
    .doc(auth.currentUser.uid)
    .collection("posts")
    .doc(slug);
  const [post] = useDocumentDataOnce(postRef);

  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>

            <PostForm
              postRef={postRef}
              defaultValues={post}
              preview={preview}
            />
          </section>

          <aside className="grid place-content-center gap-3">
            <h3 className="">Tools</h3>
            <button
              onClick={() => setPreview(!preview)}
              type="button"
              class="px-3 py-3 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 "
            >
              {preview ? "Edit" : "Preview"}
            </button>

            <Link href={`/${post.username}/${post.slug}`}>
              <button
                type="button"
                class="px-3 flex items-center justify-center gap-3 py-3 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 "
              >
                Live view
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19.957 4.035c-.345-.024-.682-.035-1.012-.035-7.167 0-11.248 5.464-12.732 9.861l3.939 3.938c4.524-1.619 9.848-5.549 9.848-12.639 0-.367-.014-.741-.043-1.125zm-9.398 11.815l-2.402-2.402c1.018-2.383 3.91-7.455 10.166-7.767-.21 4.812-3.368 8.276-7.764 10.169zm4.559 1.282c-.456.311-.908.592-1.356.842-.156.742-.552 1.535-1.126 2.21-.001-.48-.135-.964-.369-1.449-.413.187-.805.348-1.179.49.551 1.424-.01 2.476-.763 3.462 1.08-.081 2.214-.61 3.106-1.504.965-.962 1.64-2.352 1.687-4.051zm-9.849-5.392c-.482-.232-.965-.364-1.443-.367.669-.567 1.453-.961 2.188-1.121.262-.461.556-.915.865-1.361-1.699.046-3.09.723-4.054 1.686-.893.893-1.421 2.027-1.503 3.106.986-.753 2.039-1.313 3.463-.762.145-.391.305-.785.484-1.181zm6.448.553c-.326-.325-.326-.853 0-1.178.325-.326.853-.326 1.178 0 .326.326.326.854 0 1.179-.326.325-.853.325-1.178-.001zm4.124-4.125c-.65-.65-1.706-.65-2.356 0-.651.651-.651 1.707 0 2.357.65.651 1.706.651 2.357 0 .65-.65.65-1.706-.001-2.357zm-1.591 1.592c-.228-.228-.228-.598 0-.825.227-.228.598-.228.826 0 .227.227.226.597 0 .825-.228.227-.598.227-.826 0zm-12.609 10.555l-.755-.755 4.341-4.323.755.755-4.341 4.323zm4.148 1.547l-.755-.755 3.03-3.054.756.755-3.031 3.054zm-5.034 2.138l-.755-.755 5.373-5.364.756.755-5.374 5.364zm21.083-14.291c-.188.618-.673 1.102-1.291 1.291.618.188 1.103.672 1.291 1.291.189-.619.673-1.103 1.291-1.291-.618-.188-1.102-.672-1.291-1.291zm-14.655-6.504c-.247.81-.881 1.443-1.69 1.69.81.247 1.443.881 1.69 1.69.248-.809.881-1.443 1.69-1.69-.81-.247-1.442-.88-1.69-1.69zm-1.827-3.205c-.199.649-.706 1.157-1.356 1.355.65.199 1.157.707 1.356 1.355.198-.649.706-1.157 1.354-1.355-.648-.198-1.155-.706-1.354-1.355zm5.387 0c-.316 1.035-1.127 1.846-2.163 2.163 1.036.316 1.847 1.126 2.163 2.163.316-1.036 1.127-1.846 2.162-2.163-1.035-.317-1.845-1.128-2.162-2.163zm11.095 13.64c-.316 1.036-1.127 1.846-2.163 2.163 1.036.316 1.847 1.162 2.163 2.197.316-1.036 1.127-1.881 2.162-2.197-1.035-.317-1.846-1.127-2.162-2.163z" />
                  </svg>
                </span>
              </button>
            </Link>
            <DeletePostButton postRef={postRef} />
          </aside>
        </>
      )}
    </main>
  );
}

function PostForm({ defaultValues, postRef, preview }) {
  const { register, errors, handleSubmit, formState, reset, watch } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const { isValid, isDirty } = formState;

  const updatePost = async ({ content, published }) => {
    await postRef.update({
      content,
      published,
      updatedAt: serverTimestamp(),
    });

    reset({ content, published });

    toast.success("Post updated successfully!");
  };
  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown
            className="prose prose-slate prose-pre:rounded-xl prose-pre:text-sm  dark:prose-invert prose-img:shadow-2xl prose-video:rounded-2xl  prose-strong:text-yellow-400 prose-img:w-11/12 prose-img:mx-auto prose-video:mx-auto prose-blockquote:text-cyan-600 lg:prose-l prose-a:text-teal-600 hover:prose-a:text-teal-500 prose-img:rounded-lg"
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
            {watch("content")}
          </ReactMarkdown>
        </div>
      )}

      <div className={preview ? styles.hidden : styles.controls}>
        <ImageUploader />

        <textarea
          name="content"
          className="text-black"
          ref={register({
            maxLength: { value: 20000, message: "content is too long" },
            minLength: { value: 10, message: "content is too short" },
            required: { value: true, message: "content is required" },
          })}
        ></textarea>

        {errors.content && (
          <p className="text-danger">{errors.content.message}</p>
        )}

        <fieldset>
          <input
            className={styles.checkbox}
            name="published"
            type="checkbox"
            ref={register}
          />
          <label>Published</label>
        </fieldset>

        <button
          type="submit"
          className="btn-green"
          disabled={!isDirty || !isValid}
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}

function DeletePostButton({ postRef }) {
  const router = useRouter();

  const deletePost = async () => {
    const doIt = confirm("are you sure!");
    if (doIt) {
      await postRef.delete();
      router.push("/admin");
      toast("post annihilated ", { icon: "🗑️" });
    }
  };

  return (
    // <button className="btn-red" onClick={deletePost}>
    //   Delete
    // </button>
    <button
      onClick={deletePost}
      type="button"
      className="focus:outline-none text-white bg-red-700 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
    >
      Delete
    </button>
  );
}
