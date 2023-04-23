import { type GetServerSideProps, type NextPage } from "next";
import { getSession, signIn } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { FaDiscord } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

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
      <main className="flex min-h-screen">
        <div className="flex w-1/2 items-center justify-center px-10">
          <div className="flex w-full flex-col gap-8 rounded-lg bg-gradient-to-t from-base-100 to-base-300 p-20">
            <h1 className="hero text-4xl font-bold normal-case">
              Welcome back to Santafy!
            </h1>
            <h2 className="hero-content text-center text-xl">
              Sign in to create a Secret Santa group
              <br /> or join an existing one.
            </h2>
            <div className="flex flex-row items-center justify-center gap-8">
              <button
                className="flex items-center gap-2 rounded bg-[#738ADB] px-4 py-2 font-medium text-white"
                onClick={() => void signIn("discord")}
              >
                <FaDiscord size={20} />
                <p>Sign in with Discord</p>
              </button>
              <button
                className="flex items-center gap-2 rounded bg-white px-4 py-2 font-medium text-black"
                onClick={() => void signIn("google")}
              >
                <FcGoogle size={20} />
                <p>Sign in with Google</p>
              </button>
            </div>
            {error && <SignInError error={error as keyof typeof errors} />}
          </div>
        </div>
        <div className="basis-1/2 bg-gradient-to-br from-purple-500 to-purple-800" />
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
