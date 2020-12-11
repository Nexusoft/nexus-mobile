import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { shadow, overlay } from 'react-native-paper';
import { mix } from 'utils/color';
import { useTheme } from 'lib/theme';

const styles = {
  wrapper: ({ theme }) => ({
    flex: 1,
    backgroundColor: theme.dark ? theme.background : theme.primary,
  }),
  backPane: {
    height: '30%',
    paddingVertical: 25,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frontPane: ({ theme }) => ({
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 50,
    paddingTop: 20,
    backgroundColor: overlay(2, theme.surface),
    elevation: 8,
    ...shadow(8),
  }),
  /* TODO: Remove */
  beta: ({ theme }) => ({
    color: theme.background,
    backgroundColor: mix('black', theme.primary, 0.9),
    textAlign: 'center',
  }),
};

export default function Backdrop({
  children,
  backdropContent,
  style,
  ...rest
}) {
  const theme = useTheme();
  return (
    <View style={[styles.wrapper({ theme }), style]} {...rest}>
      <Text style={styles.beta({ theme })}>Beta</Text>
      <View style={styles.backPane}>{backdropContent}</View>
      <ScrollView
        style={styles.frontPane({ theme })}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </View>
  );
}
