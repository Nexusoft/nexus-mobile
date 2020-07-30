import React from 'react';
import { View } from 'react-native';
import { FAB, Button } from 'react-native-paper';
import { Formik } from 'formik';
import { useSelector } from 'react-redux';
import * as yup from 'yup';

import Text from 'components/Text';
import TextBox from 'components/TextBox';
import ScreenBody from 'components/ScreenBody';
import { refreshUserStatus } from 'lib/user';
import { sendAPI } from 'lib/api';
import { goBack } from 'lib/navigation';
import { showError, showNotification } from 'lib/ui';

const styles = {
  generation: {
    marginTop: 20,
    marginBottom: 10,
  },
  generateText: {
    textAlign: 'center',
    marginBottom: 15,
  },
  btns: {
    flexDirection: 'row',
  },
  btn: {
    flex: 1,
  },
};

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
  const hasRecoveryPhrase = useSelector(
    (state) => !!state.user?.status?.recovery
  );
  const wordList = useLoadWordList();

  return (
    <ScreenBody style={{ paddingVertical: 50, paddingHorizontal: 30 }}>
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
          newRecovery: yup.string().required('Required!'),
        })}
        onSubmit={async ({ password, pin, recovery, newRecovery }) => {
          try {
            await sendAPI('users/update/user', {
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
        {({ isSubmitting, handleSubmit, setFieldValue }) => {
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
              <TextBox.Formik secure name="password" label="Password" />
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
                style={{ marginTop: 30 }}
                onPress={handleSubmit}
                label="Update recovery phrase"
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
