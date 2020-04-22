import styled from "@emotion/native";

export const Text = styled.Text(({ theme }) => ({
  fontFamily: "noto-sans",
  color: theme.mix(0.75),
}));
