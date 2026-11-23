import React from 'react';
import { View } from 'react-native';
import CommunitySlider from '@react-native-community/slider';

import { useTheme } from 'lib/theme';

//value between min and max, snapped to step, theme colors
export default function Slider({
  value,
  min = 0,
  max = 1,
  step = 0,
  disabled,
  onChange,
  onRelease,
  color,
  style,
  testID,
}) {
  const theme = useTheme();
  const accent = color || theme.primary;
  const clamp = (v) =>
    Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : min;
  return (
    <View style={[{ justifyContent: 'center' }, style]} testID={testID}>
      <CommunitySlider
        style={{ height: 40 }}
        value={clamp(value)}
        minimumValue={min}
        maximumValue={max > min ? max : min + 1}
        step={step > 0 ? step : 0}
        disabled={disabled || max <= min}
        minimumTrackTintColor={accent}
        maximumTrackTintColor={theme.dark ? '#2c3a48' : '#b9c7d6'}
        thumbTintColor={accent}
        onValueChange={(v) => onChange?.(clamp(v))}
        onSlidingComplete={(v) => onRelease?.(clamp(v))}
      />
    </View>
  );
}
