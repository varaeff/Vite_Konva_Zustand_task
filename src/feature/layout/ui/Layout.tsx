import { PropsWithChildren } from "react";
import { Left } from "./Left";
import { Main } from "./Main";

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Left />
      <Main>{children}</Main>
    </>
  );
};
