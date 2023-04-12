import { type NextPage } from "next";
import type { AppProps } from "next/app";
import { type ReactElement, type ReactNode } from "react";

export type NextPageWithLayout<P = Record<string, never>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (_page: ReactElement) => ReactNode;
  // layout?: ComponentType;
  requireAuth?: boolean;
};

export type AppPropsWithLayout<T> = AppProps<T> & {
  Component: NextPageWithLayout;
};
