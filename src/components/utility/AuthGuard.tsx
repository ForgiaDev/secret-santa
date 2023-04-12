import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, type ReactNode } from "react";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      void router.push("/");
    }
  }, [status, router]);

  // show loading indicator while the auth provider is still initializing
  if (status === "loading") {
    return <h1> Loading </h1>;
  }

  // if auth initialized with a valid user show protected page
  if (status === "authenticated") {
    return <>{children}</>;
  }

  return null;
}
