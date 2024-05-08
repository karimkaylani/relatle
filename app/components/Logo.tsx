import React from "react";
import { Image } from "@mantine/core";
import { phoneMaxWidth } from "./Game";

const Logo = () => {
  return (
    <Image
      style={{ cursor: "pointer" }}
      w={window.innerWidth > phoneMaxWidth ? 250 : 175}
      src="images/logo.png"
      alt="Relatle Logo"
    ></Image>
  );
};

export default Logo;
