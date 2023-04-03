import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  return (
    <>
      <Head>
        <title>Santafy</title>
        <meta
          name="description"
          content="Digitalize your Secret Santa shenanigans"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        {status === "authenticated" && (
          <div className="flex flex-col items-center justify-center gap-8">
            Welcome back {session.user.name}! <GroupView />
            <button
              className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
              onClick={() => void signOut()}
            >
              Sign out
            </button>
          </div>
        )}
        {status === "unauthenticated" && <LoginView />}
      </main>
    </>
  );
};

const GroupView = () => {
  const { data: groups, isLoading, isError } = api.groups.getAll.useQuery();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <h2 className="text-2xl">Your groups</h2>
      <ul className="flex flex-col gap-4">
        {groups.map((group) => (
          <li key={group.id}>
            <Link
              href={`/groups/${group.id}`}
              className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            >
              {group.name}
            </Link>
          </li>
        ))}
      </ul>
      <Link
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        href="/groups/create"
      >
        Create a group
      </Link>
    </div>
  );
};

const LoginView = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <p>Sign in to create a Secret Santa group or join an existing one.</p>

      <button
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        onClick={() => void signIn("discord")}
      >
        Sign in with Discord
      </button>
    </div>
  );
};

export default Home;
