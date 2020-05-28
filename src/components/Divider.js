import styled from '@emotion/native';
import { fade } from 'utils/color';

export default styled.View(({ theme, vertical }) => ({
  height: vertical ? undefined : 1,
  width: vertical ? 1 : undefined,
  backgroundColor: fade(theme.foreground, 0.8),
}));
