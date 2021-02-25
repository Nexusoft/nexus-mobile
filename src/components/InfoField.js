import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'lib/theme';

import Text from 'components/Text';
import { disabledColor } from 'lib/theme';

const styles = {
  line: ({ inline, compact }) => [
    { paddingVertical: compact ? 12 : 20 },
    inline && {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  ],
  label: ({ expanded }) =>
    expanded && {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  value: ({ inline, bordered, theme, color, colorName }) => [
    !!inline && { flex: 1, marginLeft: 8, alignItems: 'flex-end' },
    !inline && {
      marginTop: 7,
    },
    bordered && {
      borderWidth: 1,
      borderColor: disabledColor(color || theme[colorName] || theme.foreground),
      borderRadius: 4,
      paddingVertical: 5,
      paddingHorizontal: 8,
      marginTop: 5,
    },
  ],
  valueText: ({ inline }) => ({
    textAlign: inline ? 'right' : 'left',
  }),
};

export default function InfoField({
  inline,
  compact,
  label,
  control,
  value,
  mono,
  bordered,
  color,
  colorName,
}) {
  const theme = useTheme();
  return (
    <View style={styles.line({ inline, compact })}>
      <View style={styles.label({ expanded: !inline && !!control })}>
        <Text sub size={14} color={color} colorName={colorName}>
          {label}
        </Text>
        {!inline && control}
      </View>
      <View
        style={styles.value({
          inline,
          bordered,
          theme,
          color,
          colorName,
        })}
      >
        {typeof value === 'string' || typeof value === 'number' ? (
          <Text
            size={15}
            inline={inline}
            selectable
            mono={mono}
            style={styles.valueText({ inline })}
            color={color}
            colorName={colorName}
          >
            {value}
          </Text>
        ) : (
          value
        )}
      </View>
    </View>
  );
}
