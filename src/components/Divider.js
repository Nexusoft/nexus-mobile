import styled from '@emotion/native';

export default styled.View(({ theme, vertical }) => ({
  height: vertical ? undefined : 0.5,
  width: vertical ? 0.5 : undefined,
  backgroundColor: theme.foregroundDisabled,
}));
