import { ReactNode } from "react";
import V2Enhancements from "./V2Enhancements";

type V2LayoutProps = {
  children: ReactNode;
};

export default function V2Layout({ children }: V2LayoutProps) {
  return (
    <>
      <V2Enhancements />
      {children}
    </>
  );
}
