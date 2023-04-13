import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

const Navbar: React.FC<{ groupPage: boolean; hasGraph?: boolean }> = ({
  groupPage = false,
  hasGraph,
}) => {
  const { data } = useSession();
  console.log(data);
  const router = useRouter();

  return (
    <div className="flex w-full justify-center py-2">
      <div className="navbar w-[99%] rounded-lg bg-base-200">
        {/* Logo */}
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn-ghost btn lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
            >
              <li>
                <a>Item 1</a>
              </li>
              <li tabIndex={0}>
                <a className="justify-between">
                  Parent
                  <svg
                    className="fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                  </svg>
                </a>
                <ul className="p-2">
                  <li>
                    <a>Submenu 1</a>
                  </li>
                  <li>
                    <a>Submenu 2</a>
                  </li>
                </ul>
              </li>
              <li>
                <a>Item 3</a>
              </li>
            </ul>
          </div>
          <Link
            href={"/dashboard"}
            className="btn-ghost btn text-xl normal-case"
          >
            Santafy
          </Link>
        </div>

        {/* Tabs */}

        {groupPage && (
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
              <li>
                <Link href={router.asPath + "/../general"}>General</Link>
              </li>
              <li>
                <Link href={router.asPath + "/../graph"}>Graph</Link>
              </li>
            </ul>
          </div>
        )}
        <div className="navbar-end">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
              {/* <div className="w-10 rounded-full bg-purple-500" /> */}
              <Image
                src={data?.user.image ?? ""}
                alt="profile pic"
                width={1000}
                height={1000}
                className="aspect-square w-10 rounded-full"
              />
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box menu-compact mt-3 w-40 bg-base-100 p-2 shadow-2xl"
            >
              <li>
                <a>Settings</a>
              </li>
              <li>
                <button onClick={() => void signOut({ callbackUrl: "/" })}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
