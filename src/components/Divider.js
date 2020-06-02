import styled from '@emotion/native';
import { fade } from 'utils/color';

export default styled.View(({ theme, vertical, color }) => ({
  height: vertical ? undefined : 0.5,
  width: vertical ? 0.5 : undefined,
  backgroundColor: fade(color || theme.foreground, 0.8),
}));
