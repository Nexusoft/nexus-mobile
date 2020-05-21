import styled from '@emotion/native';

export default styled.Text(
  ({ theme, emphasis, mono, bold, disabled, primary }) => {
    return {
      fontFamily: mono ? 'robotomono' : bold ? 'noto-sans-bold' : 'noto-sans',
      color: primary
        ? theme.primary
        : disabled
        ? theme.foregroundDisabled
        : emphasis
        ? theme.foregroundEmphasis
        : theme.foreground,
      fontWeight: bold ? 'bold' : 'normal',
    };
  }
);
