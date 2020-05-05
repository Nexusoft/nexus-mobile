import styled from "@emotion/native";
import { fade } from "utils/color";

export const Text = styled.Text(({ theme, emphasis, disabled }) => {
  const opacity = disabled ? 0.38 : emphasis ? 0.87 : 0.6;
  return {
    fontFamily: "noto-sans",
    color: fade(theme.foreground, 1 - opacity),
  };
});
