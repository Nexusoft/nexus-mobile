import styled from '@emotion/native';
import { fade } from 'utils/color';

export default styled.View(({ theme, vertical, color }) => ({
  height: vertical ? undefined : 1,
  width: vertical ? 1 : undefined,
  backgroundColor: fade(color || theme.foreground, 0.8),
}));
