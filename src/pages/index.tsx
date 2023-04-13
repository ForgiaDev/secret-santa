import { type GetServerSideProps, type NextPage } from "next";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { error } = useRouter().query;

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
      <main className="flex min-h-screen flex-col items-center justify-center gap-8">
        <h2 className="text-3xl">
          Sign in to create a Secret Santa group or join an existing one.
        </h2>
        <div className="flex flex-row items-center justify-center gap-4">
          <button
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            onClick={() => void signIn("discord")}
          >
            Sign in with Discord
          </button>
          <button
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            onClick={() => void signIn("google")}
          >
            Sign in with Google
          </button>
        </div>
        {error && <SignInError error={error as keyof typeof errors} />}
      </main>
    </>
  );
};

export default Home;

const errors = {
  Signin: "Try signing with a different account.",
  OAuthSignin: "Try signing with a different account.",
  OAuthCallback: "Try signing with a different account.",
  OAuthCreateAccount: "Try signing with a different account.",
  EmailCreateAccount: "Try signing with a different account.",
  Callback: "Try signing with a different account.",
  OAuthAccountNotLinked:
    "To confirm your identity, sign in with the same account you used originally.",
  EmailSignin: "Check your email address.",
  CredentialsSignin:
    "Sign in failed. Check the details you provided are correct.",
  default: "Unable to sign in.",
};
const SignInError: React.FC<{ error: keyof typeof errors }> = ({ error }) => {
  const errorMessage = error && (errors[error] ?? errors.default);
  return <div className="text-red-500">{errorMessage}</div>;
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  // If user is already logged in, redirect to the dashboard
  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: { session }, // Pass the session object to the component
  };
};
