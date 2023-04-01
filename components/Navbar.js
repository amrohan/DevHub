import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { UserContext } from "@lib/context";
import { auth } from "@lib/firebase";
import Username from "pages/api/[username]";

// Top navbar
export default function Navbar() {
  const { user, username } = useContext(UserContext);
  const router = useRouter();
  const signOut = () => {
    auth.signOut();
    router.reload();
  };

  // Pop up Menu
  const [show, setShow] = useState(false);

  function handleOnClick() {
    setShow(!show);
  }

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">DEVHUB</Link>
        </li>

        {/* user is signed-in and has username */}
        {username && (
          <>
            <li>
              <button
                onClick={handleOnClick}
                className="bg-transparent border-transparent"
              >
                <img src={user?.photoURL || "/hacker.png"} />
              </button>
            </li>

            {/* Popup */}
            {show && (
              <div className="absolute top-16 right-10">
                <div className="flex flex-col justify-center max-w-xs p-6 shadow-md rounded-xl sm:px-12 bg-zinc-900 text-gray-100">
                  <h1 className="text-sm">
                    Signed in as <span className="italic">{username}</span>
                  </h1>
                  <div className="space-y-4 text-center divide-y divide-gray-700">
                    <div className="my-2 space-y-1">
                      <h2 className="text-base font-semibold  rounded-md hover:bg-blue-600 ">
                        <Link href={`/${username}`}>Profile</Link>
                      </h2>
                    </div>
                    <div className="flex justify-center pt-2 space-x-4 align-center">
                      <li>
                        <Link href="/admin">
                          <button className=" btn btn-editPost">
                            <span>Write</span>
                            <svg
                              width="22"
                              height="22"
                              className="editIcon"
                              clipRule="evenodd"
                              fill="white"
                              fillRule="evenodd"
                              strokeLinejoin="round"
                              strokeMiterlimit="2"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="m11.25 6c.398 0 .75.352.75.75 0 .414-.336.75-.75.75-1.505 0-7.75 0-7.75 0v12h17v-8.749c0-.414.336-.75.75-.75s.75.336.75.75v9.249c0 .621-.522 1-1 1h-18c-.48 0-1-.379-1-1v-13c0-.481.38-1 1-1zm1.521 9.689 9.012-9.012c.133-.133.217-.329.217-.532 0-.179-.065-.363-.218-.515l-2.423-2.415c-.143-.143-.333-.215-.522-.215s-.378.072-.523.215l-9.027 8.996c-.442 1.371-1.158 3.586-1.264 3.952-.126.433.198.834.572.834.41 0 .696-.099 4.176-1.308zm-2.258-2.392 1.17 1.171c-.704.232-1.274.418-1.729.566zm.968-1.154 7.356-7.331 1.347 1.342-7.346 7.347z"
                                fill-rule="nonzero"
                              />
                            </svg>
                          </button>
                        </Link>
                      </li>
                      <li className="push-left">
                        <button onClick={signOut} className="btn btn-logOut">
                          <span>LogOut</span>
                          <svg
                            width="22"
                            height="22"
                            fill="white"
                            xmlns="http://www.w3.org/2000/svg"
                            fillRule="evenodd"
                            clipRule="evenodd"
                          >
                            <path d="M16 2v7h-2v-5h-12v16h12v-5h2v7h-16v-20h16zm2 9v-4l6 5-6 5v-4h-10v-2h10z" />
                          </svg>
                        </button>
                      </li>
                    </div>
                  </div>
                  {/* Cross to close popup */}
                  <button
                    onClick={handleOnClick}
                    className="absolute top-2 right-6 bg-transparent border-transparent "
                  >
                    <svg
                      className="h-6 text-[#105b6b]"
                      fill="currentColor"
                      clipRule="evenodd"
                      fillRule="evenodd"
                      strokeLinejoin="round"
                      strokeMiterlimit="2"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="m21 3.998c0-.478-.379-1-1-1h-16c-.62 0-1 .519-1 1v16c0 .621.52 1 1 1h16c.478 0 1-.379 1-1zm-16.5.5h15v15h-15zm7.491 6.432 2.717-2.718c.146-.146.338-.219.53-.219.404 0 .751.325.751.75 0 .193-.073.384-.22.531l-2.717 2.717 2.728 2.728c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.385-.073-.531-.219l-2.728-2.728-2.728 2.728c-.147.146-.339.219-.531.219-.401 0-.75-.323-.75-.75 0-.192.073-.384.22-.531l2.728-2.728-2.722-2.722c-.146-.147-.219-.338-.219-.531 0-.425.346-.749.75-.749.192 0 .384.073.53.219z"
                        fill-rule="nonzero"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* user is not signed OR has not created username */}
        {!username && (
          <li>
            <Link href="/enter">
              <button className="button">Log in</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
