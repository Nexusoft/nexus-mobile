import React from 'react';
import { View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';

import Text from 'components/Text';

const styles = {
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 18,
    minHeight: 16,
  },
  dot: ({ color }) => ({
    width: 14,
    height: 14,
    borderRadius: 7,
    marginHorizontal: 7,
    backgroundColor: color,
  }),
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 276,
    justifyContent: 'space-between',
  },
  key: ({ plain }) => ({
    width: 76,
    height: 76,
    borderRadius: 38,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: plain ? 'transparent' : 'rgba(255,255,255,0.16)',
  }),
};

const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

//digit pad for PINs; the left key switches to the keyboard for PINs with letters
export default function PinPad({ value, onChange, onKeyboard, color, disabled }) {
  const press = (key) => {
    if (disabled) return;
    if (key === 'back') onChange(value.slice(0, -1));
    else onChange(value + key);
  };
  const Key = ({ k, label, plain, a11y }) => (
    <TouchableRipple
      borderless
      style={styles.key({ plain })}
      onPress={() => (k === 'abc' ? onKeyboard?.() : press(k))}
      accessibilityLabel={a11y || label}
    >
      <Text style={{ color, fontSize: plain ? 14 : 28 }}>{label}</Text>
    </TouchableRipple>
  );
  return (
    <View style={{ alignItems: 'center' }}>
      <View style={styles.dots}>
        {[...value].map((_, i) => (
          <View key={i} style={styles.dot({ color })} />
        ))}
      </View>
      <View style={styles.grid}>
        {digits.map((d) => (
          <Key key={d} k={d} label={d} />
        ))}
        <Key k="abc" label="ABC" plain a11y="Type PIN with keyboard" />
        <Key k="0" label="0" />
        <Key k="back" label={'⌫'} plain a11y="Delete" />
      </View>
    </View>
  );
}
