import styled from "@emotion/native";

export const Text = styled.Text(({ theme, emphasis, disabled }) => {
  return {
    fontFamily: "noto-sans",
    color: disabled
      ? theme.foregroundDisabled
      : emphasis
      ? theme.foregroundEmphasis
      : theme.foreground,
  };
});
