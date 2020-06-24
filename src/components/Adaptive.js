import { View as NativeView } from 'react-native';
import { ScrollView as NativeScrollView } from 'react-native-gesture-handler';
import { Surface as PaperSurface } from 'react-native-paper';

import { backgroundProvider, adaptive } from 'lib/adaptive';
import SvgIcon from 'components/SvgIcon';
import { default as MyText } from 'components/Text';

export const View = backgroundProvider()(NativeView);
export const ScrollView = backgroundProvider()(NativeScrollView);
export const Surface = backgroundProvider({
  presetBgColorName: 'surface',
  elevated: true,
  defaultElevation: 4,
})(PaperSurface);

export const Text = adaptive()(MyText);
export const SubText = adaptive({ modifier: 'sub' })(MyText);
export const DisabledText = adaptive({
  modifier: 'disabled',
})(MyText);

export const Icon = adaptive({
  modifier: null,
  colorProp: true,
})(SvgIcon);
export const SubIcon = adaptive({
  modifier: 'sub',
  colorProp: true,
})(SvgIcon);
export const DisabledIcon = adaptive({
  modifier: 'disabled',
  colorProp: true,
})(SvgIcon);
