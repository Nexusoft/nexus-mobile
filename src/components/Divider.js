import styled from '@emotion/native';
import { fade } from 'utils/color';

export default styled.View(({ theme, vertical }) => ({
  height: vertical ? undefined : 0.5,
  width: vertical ? 0.5 : undefined,
  backgroundColor: fade(theme.foreground, 0.5),
}));
