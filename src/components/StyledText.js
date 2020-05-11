import styled from "@emotion/native";

export const Text = styled.Text(
  ({ theme, emphasis, bold, disabled, primary }) => {
    return {
      fontFamily: bold ? "noto-sans-bold" : "noto-sans",
      color: primary
        ? theme.primary
        : disabled
        ? theme.foregroundDisabled
        : emphasis
        ? theme.foregroundEmphasis
        : theme.foreground,
      fontWeight: bold ? "bold" : "normal",
    };
  }
);
