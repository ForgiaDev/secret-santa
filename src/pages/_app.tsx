import type { NextPage } from "next";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps, AppType } from "next/app";
import type { ReactElement, ReactNode } from "react";

import { AuthGuard } from "~/components/utility/AuthGuard";
import { api } from "~/utils/api";
import "../styles/globals.css";

export type NextPageWithLayout<P = unknown, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
  requireAuth?: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
  pageProps: {
    session: Session | null;
  };
};

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    <SessionProvider session={session}>
      {Component.requireAuth ? (
        <AuthGuard>{getLayout(<Component {...pageProps} />)}</AuthGuard>
      ) : (
        getLayout(<Component {...pageProps} />)
      )}
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
