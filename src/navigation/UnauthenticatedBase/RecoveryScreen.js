import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { Formik } from 'formik';
import { FAB, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import AuthenticatedBase from 'navigation/AuthenticatedBase';
import ScreenBody from 'components/ScreenBody';
import Text from 'components/Text';
import TextBox from 'components/TextBox';
import SvgIcon from 'components/SvgIcon';
import { refreshCoreInfo, selectConnected } from 'lib/coreInfo';
import { useTheme } from 'lib/theme';
import { navigate } from 'lib/navigation';
import { selectLoggedIn, refreshUserStatus } from 'lib/user';
import { sendAPI } from 'lib/api';
import { showError } from 'lib/user';
import { flatHeader } from 'utils/styles';
import SettingsIcon from 'icons/settings.svg';
import Backdrop from './Backdrop';

const styles = {
  field: {
    marginBottom: 10,
  },
  loginBtn: {
    marginTop: 10,
  },
};

function LoginForm({ handleSubmit, isSubmitting }) {
  return (
    <View>
      <TextBox.Formik
        name="username"
        label="Username"
        background="surface"
        style={styles.field}
      />
      <TextBox.Formik
        name="password"
        label="Password"
        background="surface"
        secure
        style={styles.field}
      />
      <TextBox.Formik
        name="pin"
        label="PIN"
        background="surface"
        secure
        style={styles.field}
      />
      <FAB
        style={styles.loginBtn}
        disabled={isSubmitting}
        onPress={handleSubmit}
        label="Log in"
      />
    </View>
  );
}

export default function RecoveryScreen() {
  return (
    <Backdrop>
      <Formik
        initialValues={{ username: '', password: '', pin: '' }}
        onSubmit={async ({ username, password, pin }) => {
          try {
            await sendAPI('users/login/user', { username, password, pin });
            await refreshUserStatus();
          } catch (err) {
            showError(err && err.message);
          }
        }}
        component={LoginForm}
      />
    </Backdrop>
  );
}

RecoveryScreen.nav = {
  name: 'RecoverPassword',
  title: 'Recover',
};
