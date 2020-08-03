import React from 'react';
import { View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';

import SvgIcon from 'components/SvgIcon';
import Text from 'components/Text';
import { navigate } from 'lib/navigation';

const styles = {
  item: ({ small, padded }) => ({
    paddingVertical: small ? 12 : 16,
    paddingLeft: padded ? 36 : 20,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
  }),
  itemIcon: {
    marginRight: 10,
  },
};

export default function MenuItem({
  linkTo,
  icon,
  label,
  action,
  colorName,
  small,
  padded,
}) {
  return (
    <TouchableRipple
      borderless={false}
      onPress={() => {
        if (linkTo) {
          navigate(linkTo);
        } else if (action) {
          action();
        }
      }}
    >
      <View style={styles.item({ small, padded })}>
        {!!icon && (
          <SvgIcon
            style={styles.itemIcon}
            icon={icon}
            colorName={colorName}
            size={small ? 14 : 16}
          />
        )}
        <Text size={small ? 14 : 16} colorName={colorName}>
          {label}
        </Text>
      </View>
    </TouchableRipple>
  );
}
