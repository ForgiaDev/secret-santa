import { type ReactNode } from "react";
import Navbar from "../navigation/Navbar";

export interface PrimaryLayout extends React.ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  groupPage?: boolean;
  hasGraph?: boolean;
}

const PrimaryLayout: React.FC<PrimaryLayout> = ({
  children,
  groupPage,
  hasGraph,
  ...divProps
}) => {
  return (
    <>
      <div {...divProps} className={`flex min-h-screen flex-col`}>
        <Navbar groupPage={!!groupPage} hasGraph={!!hasGraph} />
        <main className="px-5">{children}</main>
      </div>
    </>
  );
};

export default PrimaryLayout;
