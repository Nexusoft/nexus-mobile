import styled from '@emotion/native';
import { fade } from 'utils/color';

export default styled.View(
  ({ theme, color }) => ({
    backgroundColor: fade(color || theme.foreground, 0.85),
  }),
  ({ vertical, inset, spacing }) =>
    vertical && {
      width: 1,
      marginTop: Array.isArray(inset) ? inset[0] : inset,
      marginBottom: Array.isArray(inset) ? inset[1] : inset,
      marginLeft: Array.isArray(spacing) ? spacing[0] : spacing,
      marginRight: Array.isArray(spacing) ? spacing[1] : spacing,
    },
  ({ vertical, inset, spacing }) =>
    !vertical && {
      height: 1,
      marginLeft: Array.isArray(inset) ? inset[0] : inset,
      marginRight: Array.isArray(inset) ? inset[1] : inset,
      marginTop: Array.isArray(spacing) ? spacing[0] : spacing,
      marginBottom: Array.isArray(spacing) ? spacing[1] : spacing,
    }
);
