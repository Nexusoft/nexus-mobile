import { Text as NativeText } from 'react-native';
import styled from '@emotion/native';

const Text = styled(NativeText)(({ mono, bold }) => ({
  fontFamily: mono ? 'robotomono' : bold ? 'noto-sans-bold' : 'noto-sans',
  fontWeight: bold ? 'bold' : 'normal',
}));

export default Text;
