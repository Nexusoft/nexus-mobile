import styled from '@emotion/native';
import { fade } from 'utils/color';

export default styled.View(
  ({ theme, color }) => ({
    backgroundColor: fade(color || theme.foreground, 0.85),
  }),
  ({ vertical, inset, spacing }) =>
    vertical && {
      width: 1,
      marginVertical: inset,
      marginHorizontal: spacing,
    },
  ({ vertical, inset, spacing }) =>
    !vertical && {
      height: 1,
      marginHorizontal: inset,
      marginVertical: spacing,
    }
);
