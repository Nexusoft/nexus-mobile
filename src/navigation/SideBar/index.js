import React from 'react';
import { View, ScrollView } from 'react-native';

import SideBarHeader from './SideBarHeader';
import SideMenu from './SideMenu';

const styles = {
  wrapper: {
    flex: 1,
  },
  items: {
    flex: 1,
    paddingTop: 10,
  },
};

export default function SideBar({ navigation }) {
  return (
    <View style={styles.wrapper}>
      <SideBarHeader navigation={navigation} />

      <ScrollView style={styles.items}>
        <SideMenu />
      </ScrollView>
    </View>
  );
}
