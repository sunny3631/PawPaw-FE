import { useState } from "react";

import Header from "./Header";
import Navigation from "./Navigation";

const Layout = ({ name, imgUrl, children }) => {
  const [activate, setActivate] = useState();
  return (
    <div>
      <Header name={name} imgUrl={imgUrl} />
      {children}
      <Navigation activate={activate} setActivate={setActivate} />
    </div>
  );
};

export default Layout;
