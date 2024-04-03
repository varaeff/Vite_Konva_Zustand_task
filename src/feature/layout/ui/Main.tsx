import { FC, PropsWithChildren } from "react";
import { Hamburger } from "./Hamburger";

interface MainProps extends PropsWithChildren {}

export const Main: FC<MainProps> = ({ children }) => {
  return (
    <div className="flex-grow overflow-auto px-2">
      <Hamburger></Hamburger>
      {children}
    </div>
  );
};
