import React from "react";
import NavMenu from "../components/NavMenu";

type Props = {
  children?: React.ReactNode;
};

const HomeLayout: React.FC<Props> = ({children,}) => (
  <>
    <NavMenu></NavMenu>
    <div className="container mx-auto grid gap-8 grid-cols-6 flex-row-reverse">
      {children}
    </div>
  </>
);

export default HomeLayout;