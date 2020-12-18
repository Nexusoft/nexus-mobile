import React from 'react';
import { View, Linking, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { Surface } from 'react-native-paper';

import Divider from 'components/Divider';
import InfoField from 'components/InfoField';
import ScreenBody from 'components/ScreenBody';
import Text from 'components/Text';
import { useTheme } from 'lib/theme';

import { version, builddate } from '../../../package.json'; //not too happy about this

const styles = {
  subHeader: {
    marginLeft: 30,
    marginTop: 30,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  infoSection: {
    elevation: 3,
    paddingHorizontal: 30,
  },
  legal: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  section: {
    marginVertical: 30,
    alignItems: 'center',
  },
  paragraph: {
    marginTop: 15,
  },
  center: {
    alignItems: 'center',
    textAlign: 'center',
  },
  header: {
    fontSize: 18,
  },
  link: ({ theme }) => ({
    color: theme.primary,
    textDecorationLine: 'underline',
  }),
};

function Link({ children, url, style, ...rest }) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      onPress={() => {
        Linking.openURL(url);
      }}
    >
      <Text style={[styles.link({ theme }), style]} {...rest}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

export default function CoreInfoScreen() {
  const coreVer = useSelector((state) => state.core.info.version)
    .substring(0, 10)
    .replace(/[^0-9\.]+/g, '');
  const coreDate = 'fff';
  console.log(coreDate);

  return (
    <ScreenBody>
      <Surface style={styles.infoSection}>
        <InfoField inline label="Wallet version" value={version} />
        <Divider />
        <InfoField inline label="Wallet build date" value={builddate} />
        <Divider />
        <InfoField inline label="Embedded core version" value={coreVer} />
        <Divider />
        <InfoField inline label="Embedded core build date" value={coreDate} />
      </Surface>

      <View style={styles.legal}>
        <View style={styles.section}>
          <Text style={styles.center}>
            <Text bold style={styles.center}>
              Copyright
            </Text>{' '}
            2020 NEXUS DEVELOPMENT, U.S. LLC.
          </Text>
          <Link url="https://nexus.io/">nexus.io</Link>

          <View style={styles.paragraph}>
            <Text bold style={styles.center}>
              Nexus Embassy USA
            </Text>
            <Text style={styles.center}>
              Tempe, Arizona, United States Of America
            </Text>
          </View>

          <View style={styles.paragraph}>
            <Text bold style={styles.center}>
              Nexus Embassy Australia
            </Text>
            <Text style={styles.center}>
              Sydney, New South Wales, Australia
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.paragraph}>
            <Text bold style={styles.center}>
              THIS IS EXPERIMENTAL SOFTWARE AND THE NEXUS EMBASSY HOLDS NO
              LIABILITY FOR THE USE OF THIS SOFTWARE
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text bold style={styles.header}>
            License Agreement
          </Text>
          <Text style={styles.paragraph}>Copyright 2020 Nexus</Text>
          <Text style={styles.paragraph}>
            Permission is hereby granted, free of charge, to any person
            obtaining a copy of this software and associated documentation files
            (the "Software"), to deal in the Software without restriction,
            including without limitation the rights to use, copy, modify, merge,
            publish, distribute, sublicense, and/or sell copies of the Software,
            and to permit persons to whom the Software is furnished to do so,
            subject to the following conditions:
          </Text>
          <Text style={styles.paragraph}>
            The above copyright notice and this permission notice shall be
            included in all copies or substantial portions of the Software.
          </Text>
          <Text style={styles.paragraph}>
            THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
            EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
            MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
            NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
            BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
            ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
            CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
            SOFTWARE.
          </Text>
        </View>

        <View style={styles.section}>
          <Text bold style={styles.header}>
            Open source credits
          </Text>

          <View style={[styles.paragraph, { flexDirection: 'row' }]}>
            <Link bold url="https://reactjs.org/">
              React
            </Link>
            <Text> - MIT License</Text>
          </View>

          <View style={[styles.paragraph, { flexDirection: 'row' }]}>
            <Link bold url="https://reactnative.dev/">
              React Native
            </Link>
            <Text> - MIT License</Text>
          </View>

          <View style={[styles.paragraph, { flexDirection: 'row' }]}>
            <Link bold url="https://expo.io/">
              Expo
            </Link>
            <Text> - MIT License</Text>
          </View>

          <View style={[styles.paragraph, { flexDirection: 'row' }]}>
            <Link bold url="https://redux.js.org/">
              Redux
            </Link>
            <Text> - MIT License</Text>
          </View>

          <View style={styles.paragraph}>
            <Text style={styles.center}>Icons made by</Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <Link url="https://www.flaticon.com/authors/freepik">
                Freepik
              </Link>
              <Text>, </Text>
              <Link url="https://www.flaticon.com/authors/pixel-perfect">
                Pixel perfect
              </Link>
              <Text>, </Text>
              <Link url="https://www.flaticon.com/authors/google">Google</Link>
              <Text>, </Text>
              <Link url="https://www.flaticon.com/authors/prosymbols">
                Prosymbols
              </Link>
              <Text>, </Text>
              <Link url="https://www.flaticon.com/authors/dave-gandy">
                Dave Gandy
              </Link>
              <Text>, </Text>
              <Link url="https://www.flaticon.com/authors/bqlqn">bqlqn</Link>
              <Text>, </Text>
              <Link url="https://www.flaticon.com/authors/roundicons">
                Roundicons
              </Link>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text>from </Text>
              <Link url="https://www.flaticon.com/">www.flaticon.com</Link>
            </View>
          </View>
        </View>
      </View>
    </ScreenBody>
  );
}

CoreInfoScreen.nav = {
  name: 'About',
  options: {
    title: 'About',
  },
};
