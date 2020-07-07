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
  value: ({ inline, bordered, theme }) => [
    !inline && {
      marginTop: 7,
    },
    bordered && {
      borderWidth: 1,
      borderColor: disabledColor(theme.foreground),
      borderRadius: 4,
      paddingVertical: 5,
      paddingHorizontal: 8,
      marginTop: 5,
    },
  ],
};

export default function InfoField({
  inline,
  compact,
  label,
  control,
  value,
  mono,
  bordered,
}) {
  const theme = useTheme();
  return (
    <View style={styles.line({ inline, compact })}>
      <View style={styles.label({ expanded: !inline && !!control })}>
        <Text sub size={14}>
          {label}
        </Text>
        {!inline && control}
      </View>
      <View style={styles.value({ inline, bordered, theme })}>
        <Text size={15} inline={inline} selectable mono={mono}>
          {value}
        </Text>
      </View>
    </View>
  );
}
