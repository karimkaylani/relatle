import React from "react";
import ShareButton from "./ShareButton";
import { gray9, gray7, white, gray6 } from "../colors";

export interface SharePathProps {
  path: string[];
}

const SharePath = (props: SharePathProps) => {
  const { path } = props;
  let pathString = path[0] + " ";

  path.slice(1).forEach((curr) => {
    pathString += "→ ";
    if (curr == "RESET") {
      pathString += "RESET\n";
    } else {
      pathString += curr + " ";
    }
  });

  return (
    <ShareButton
      shareText={pathString}
      buttonText="Path"
      color={white}
      borderColor={gray6}
    />
  );
};

export default SharePath;
