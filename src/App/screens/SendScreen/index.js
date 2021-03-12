import React from 'react';
import { ScrollView, LayoutAnimation } from 'react-native';
import { HeaderTitle } from '@react-navigation/stack';
import { FAB, overlay } from 'react-native-paper';
import { Formik } from 'formik';
import * as yup from 'yup';

import ScreenBody from 'components/ScreenBody';
import ZeroConnectionsOverlay from 'components/ZeroConnectionsOverlay';
import TokenName from 'components/TokenName';
import SvgIcon from 'components/SvgIcon';
import { navigate } from 'lib/navigation';
import { callAPI } from 'lib/api';
import { useTheme } from 'lib/theme';
import { addressRegex } from 'consts/regex';
import { getStore } from 'store';
import SendIcon from 'icons/send.svg';
import SendFrom from './SendFrom';
import SendTo from './SendTo';

function findContactName(addr) {
  const store = getStore();
  const state = store.getState();
  const contact = Object.entries(state.contacts).find(
    ([name, { address }]) => address === addr
  );
  return contact?.[0];
}

async function resolveNameOrAddress(nameOrAddress) {
  if (!nameOrAddress) return null;

  if (addressRegex.test(nameOrAddress)) {
    const addressResult = await callAPI('system/validate/address', {
      address: nameOrAddress,
    });
    if (addressResult.is_valid) {
      // This is a Nexus address
      return {
        address: nameOrAddress,
        contactName: findContactName(nameOrAddress),
      };
    }
  }

  // This is a name
  try {
    const nameResult = await callAPI('names/get/name', { name: nameOrAddress });
    return {
      name: nameOrAddress,
      address: nameResult.register_address,
      contactName: findContactName(nameResult.register_address),
    };
  } catch (err) {
    try {
      const nameResult = await callAPI('names/get/name', {
        name: `${nameOrAddress}:default`,
      });
      return {
        name: `${nameOrAddress}:default`,
        address: nameResult.register_address,
        contactName: findContactName(nameResult.register_address),
      };
    } catch (err) {
      return null;
    }
  }
}
function useEndReached() {
  const [endReached, setEndReached] = React.useState(false);
  const sizes = React.useRef({});
  const checkEndReached = ({
    viewHeight = sizes.current.viewHeight,
    contentHeight = sizes.current.contentHeight,
    scrollPosition = sizes.current.scrollPosition,
  } = {}) => {
    if (viewHeight === undefined || contentHeight === undefined) return;
    scrollPosition = scrollPosition || 0;
    const tempEndReached = scrollPosition + viewHeight > contentHeight - 1;
    if (tempEndReached !== endReached) {
      LayoutAnimation.easeInEaseOut();
      setEndReached(tempEndReached);
    }
  };
  const scrollHandler = ({
    nativeEvent: {
      contentOffset: { y: scrollPosition },
      contentSize: { height: contentHeight },
      layoutMeasurement: { height: viewHeight },
    },
  }) => {
    sizes.current.scrollPosition = scrollPosition;
    checkEndReached({ viewHeight, contentHeight, scrollPosition });
  };

  return {
    endReached,
    scrollViewProps: {
      onScroll: scrollHandler,
      onMomentumScrollEnd: scrollHandler,
      onContentSizeChange: (width, height) => {
        sizes.current.contentHeight = height;
        checkEndReached();
      },
      onLayout: ({
        nativeEvent: {
          layout: { height },
        },
      }) => {
        sizes.current.viewHeight = height;
        checkEndReached();
      },
    },
  };
}

export default function SendScreen({ route }) {
  const theme = useTheme();
  const account = route.params?.account;
  const { endReached, scrollViewProps } = useEndReached();

  return (
    <Formik
      initialValues={{
        amount: '',
        nameOrAddress: '',
        reference: '',
      }}
      validationSchema={yup.object().shape({
        nameOrAddress: yup.string().required('Required!'),
        amount: yup.number().typeError('Invalid!').min(0, 'Invalid!'),
        reference: yup
          .number()
          .typeError('Invalid!')
          .integer('Invalid!')
          .min(0, 'Invalid!'),
      })}
      onSubmit={async (
        { nameOrAddress, amount, reference },
        { setFieldError }
      ) => {
        const resolved = await resolveNameOrAddress(nameOrAddress);
        if (resolved) {
          navigate('ConfirmSend', {
            account,
            recipient: resolved,
            amount,
            reference,
          });
        } else {
          setFieldError('nameOrAddress', 'Invalid name/address!');
        }
      }}
    >
      {({ handleSubmit, isSubmitting, ...rest }) => (
        <ScreenBody scroll={false}>
          <ScrollView
            style={{ flex: 1, backgroundColor: overlay(2, theme.surface) }}
            scrollEventThrottle={160}
            {...scrollViewProps}
          >
            <SendFrom account={account} />

            <SendTo
              account={account}
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              {...rest}
            />
            <ZeroConnectionsOverlay />
          </ScrollView>
          <FAB
            style={{
              position: 'absolute',
              bottom: 10,
              right: 30,
              left: endReached ? 30 : undefined,
            }}
            animated={false}
            mode="contained"
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
            icon={({ size, color }) => (
              <SvgIcon icon={SendIcon} {...{ size, color }} />
            )}
            label={
              endReached
                ? isSubmitting
                  ? 'Validating...'
                  : 'Proceed'
                : undefined
            }
          />
        </ScreenBody>
      )}
    </Formik>
  );
}

SendScreen.nav = {
  name: 'Send',
  options: ({ route }) => ({
    headerTitle: ({ style, tintColor }) => (
      <HeaderTitle style={style} tintColor={tintColor}>
        Send <TokenName bold account={route.params?.account} verbose />
      </HeaderTitle>
    ),
  }),
};
