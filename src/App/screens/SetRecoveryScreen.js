import React from 'react';
import { View } from 'react-native';
import { FAB, Button, Dialog } from 'react-native-paper';
import { Formik } from 'formik';
import { useSelector } from 'react-redux';
import * as yup from 'yup';

import Portal from 'components/Portal';
import Text from 'components/Text';
import TextBox from 'components/TextBox';
import ScreenBody from 'components/ScreenBody';
import { refreshUserStatus } from 'lib/user';
import { callAPI } from 'lib/api';
import { goBack } from 'lib/navigation';
import { showError, showNotification } from 'lib/ui';
import { disabledColor, useTheme } from 'lib/theme';

const styles = {
  screen: {
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  msgBox: ({ theme }) => ({
    borderWidth: 1,
    borderColor: disabledColor(theme.foreground),
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  }),
  generation: {
    marginTop: 20,
    marginBottom: 10,
  },
  generateText: {
    textAlign: 'center',
    marginBottom: 15,
  },
  submit: { marginTop: 30 },
  btns: {
    flexDirection: 'row',
  },
  btn: {
    flex: 1,
  },
};

function ConfirmRecoveryDialog({ newRecovery, visible, onDismiss, onConfirm }) {
  const theme = useTheme();
  return (
    <Portal>
      <Formik
        initialValues={{
          recovery: '',
        }}
        validationSchema={yup.object().shape({
          recovery: yup
            .string()
            .required('Required!')
            .oneOf([newRecovery], 'Mismatch!'),
        })}
        onSubmit={onConfirm}
      >
        {({ handleSubmit }) => (
          <Dialog visible={visible} onDismiss={onDismiss}>
            <Dialog.Content>
              <View style={styles.msgBox({ theme })}>
                <Text sub>
                  Re-enter your recovery phrase to make sure you have saved your
                  recovery phrase
                </Text>
              </View>
              <TextBox.Formik
                autoFocus
                multiline
                name="recovery"
                label="Re-enter new recovery phrase"
              />
              <FAB
                mode="contained"
                style={{ marginTop: 10 }}
                onPress={handleSubmit}
                label="Confirm"
              />
            </Dialog.Content>
          </Dialog>
        )}
      </Formik>
    </Portal>
  );
}

function useLoadWordList() {
  const [wordList, setWordList] = React.useState(null);
  React.useEffect(() => {
    (async () => {
      const module = await import('consts/wordlist.json');
      const wordList = module?.default?.words;
      setWordList(wordList);
    })();
  }, []);
  return wordList;
}

export default function SetRecoveryScreen() {
  const theme = useTheme();
  const hasRecoveryPhrase = useSelector(
    (state) => !!state.user?.status?.recovery
  );
  const wordList = useLoadWordList();
  const [confirming, setConfirming] = React.useState(false);

  return (
    <ScreenBody style={styles.screen}>
      <Formik
        initialValues={{
          password: '',
          pin: '',
          recovery: '',
          newRecovery: '',
        }}
        validationSchema={yup.object().shape({
          password: yup.string().required('Required!'),
          pin: yup.string().required('Required!'),
          recovery: hasRecoveryPhrase
            ? yup.string().required('Required!')
            : undefined,
          newRecovery: yup
            .string()
            .required('Required!')
            .min(40, 'Must be at least 40 characters'),
        })}
        onSubmit={async ({ password, pin, recovery, newRecovery }) => {
          try {
            await callAPI('users/update/user', {
              password,
              pin,
              recovery: hasRecoveryPhrase ? recovery : undefined,
              new_recovery: newRecovery,
            });
          } catch (err) {
            showError(err && err.message);
            return;
          }
          refreshUserStatus();
          showNotification('Recovery phrase has been updated');
          goBack();
        }}
      >
        {({ isSubmitting, handleSubmit, setFieldValue, values }) => {
          const generate = (wordCount) => {
            if (!wordList) return;
            const words = [];
            for (let i = 0; i < wordCount; i++) {
              const randomIndex = Math.floor(Math.random() * wordList.length);
              words.push(wordList[randomIndex]);
            }
            const recovery = words.join(' ');
            setFieldValue('newRecovery', recovery);
          };

          return (
            <>
              <View style={styles.msgBox({ theme })}>
                <Text>
                  Recovery phrase can be used to recover your account and set
                  new password and PIN in the event that you lose or forget
                  them.{' '}
                  <Text bold>
                    Save this new recovery phrase in a safe place
                  </Text>
                  , because if you lose your recovery phrase, there will be{' '}
                  <Text bold>no way</Text> to recover it.
                </Text>
              </View>

              <TextBox.Formik
                secure
                name="password"
                label="Password"
                autoFocus
              />
              <TextBox.Formik secure name="pin" label="PIN" />
              {hasRecoveryPhrase && (
                <TextBox.Formik
                  multiline
                  name="recovery"
                  label="Current recovery phrase"
                />
              )}

              <View style={styles.generation}>
                <Text style={styles.generateText}>
                  Generate random recovery phrase
                </Text>
                <View style={styles.btns}>
                  <Button
                    compact
                    uppercase={false}
                    mode="outlined"
                    onPress={() => {
                      generate(10);
                    }}
                    style={styles.btn}
                    labelStyle={{ fontSize: 13 }}
                  >
                    10 words
                  </Button>
                  <Button
                    compact
                    uppercase={false}
                    mode="outlined"
                    onPress={() => {
                      generate(20);
                    }}
                    style={[styles.btn, { marginHorizontal: 10 }]}
                    labelStyle={{ fontSize: 13 }}
                  >
                    20 words
                  </Button>
                  <Button
                    compact
                    uppercase={false}
                    mode="outlined"
                    onPress={() => {
                      generate(100);
                    }}
                    style={styles.btn}
                    labelStyle={{ fontSize: 13 }}
                  >
                    100 words
                  </Button>
                </View>
              </View>
              <TextBox.Formik
                multiline
                name="newRecovery"
                label="New recovery phrase"
              />
              <FAB
                mode="contained"
                loading={isSubmitting}
                disabled={isSubmitting}
                style={styles.submit}
                onPress={() => {
                  setConfirming(true);
                }}
                label="Update recovery phrase"
              />
              <ConfirmRecoveryDialog
                visible={confirming}
                onDismiss={() => {
                  setConfirming(false);
                }}
                newRecovery={values.newRecovery}
                onConfirm={() => {
                  setConfirming(false);
                  handleSubmit();
                }}
              />
            </>
          );
        }}
      </Formik>
    </ScreenBody>
  );
}

SetRecoveryScreen.nav = {
  name: 'SetRecovery',
  options: {
    title: 'Recovery phrase',
  },
};
