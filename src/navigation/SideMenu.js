import * as React from "react";
import styled from "@emotion/native";

const StyledSideMenu = styled.View(({ theme }) => ({
  backgroundColor: theme.background,
  flex: 1,
}));

export default function SideMenu(props) {
  return <StyledSideMenu />;
}
