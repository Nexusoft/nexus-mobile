import React from 'react';
import { ScrollView } from 'react-native';
import { HeaderTitle } from '@react-navigation/elements';
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
import { t } from 'lib/i18n';
import { addressRegex } from 'consts/regex';
import parseAmount from 'utils/parseAmount';
import { getStore } from 'store';
import { useSelector } from 'react-redux';
import { defaultAccountOf } from 'lib/accounts';
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

async function reverseLookup(address) {
  try {
    const result = await callAPI('names/reverse/lookup', { address });
    const { name, local, mine, namespace } = result;

    if (namespace) {
      return namespace + '::' + name;
    }

    //another user's local name is ambiguous, show the address instead
    if (local) {
      return mine ? name : null;
    }
    return name;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function resolveNameOrAddress(nameOrAddress) {
  nameOrAddress = nameOrAddress?.trim();
  if (!nameOrAddress) return null;

  if (addressRegex.test(nameOrAddress)) {
    const addressResult = await callAPI('system/validate/address', {
      address: nameOrAddress,
    });
    if (addressResult.valid) {
      // This is a Nexus address
      const resolvedName = await reverseLookup(nameOrAddress);
      return {
        name: resolvedName,
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
      address: nameResult.register,
      contactName: findContactName(nameResult.register),
    };
  } catch (err) {
    try {
      const fullName = `${nameOrAddress}:default`;
      const nameResult = await callAPI('names/get/name', {
        name: fullName,
      });
      return {
        name: fullName,
        address: nameResult.register,
        contactName: findContactName(nameResult.register),
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
    if (tempEndReached !== endReached) setEndReached(tempEndReached);
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

export default function SendScreen({ route, navigation }) {
  const theme = useTheme();
  const accounts = useSelector((state) => state.user.accounts);
  //fresh balance of the picked account, default account when none was given
  const account =
    accounts?.find((a) => a.address === route.params?.account?.address) ||
    route.params?.account ||
    defaultAccountOf(accounts);
  const sendTo = route.params?.sendTo;
  const { endReached, scrollViewProps } = useEndReached();

  return (
    <Formik
      initialValues={{
        amount: route.params?.amount || '',
        nameOrAddress: sendTo || '',
        reference: route.params?.reference || '',
        requestLabel: route.params?.label || '',
      }}
      validationSchema={yup.object().shape({
        nameOrAddress: yup.string().required(t('Required!')),
        amount: yup
          .string()
          .required(t('Required!'))
          .test('amount', t('Invalid!'), (value) => parseAmount(value) > 0)
          .test(
            'balance',
            t('More than the account holds'),
            (value) =>
              typeof account?.balance !== 'number' ||
              !(parseAmount(value) > account.balance)
          ),
        reference: yup
          .number()
          .typeError(t('Invalid!'))
          .integer(t('Invalid!'))
          .min(0, t('Invalid!')),
      })}
      onSubmit={async (
        { nameOrAddress, amount, reference },
        { setFieldError }
      ) => {
        let resolved = null;
        try {
          resolved = await resolveNameOrAddress(nameOrAddress);
        } catch (err) {
          setFieldError(
            'nameOrAddress',
            err?.message || t('Could not check this name/address')
          );
          return;
        }
        if (resolved) {
          navigate('ConfirmSend', {
            account,
            recipient: resolved,
            amount: parseAmount(amount),
            reference: reference === '' ? undefined : Number(reference),
          });
        } else {
          setFieldError('nameOrAddress', t('Invalid name/address!'));
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
            <SendFrom
              account={account}
              onChange={(picked) => navigation.setParams({ account: picked })}
            />

            <SendTo
              account={account}
              autoScan={!!route.params?.scan}
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              {...rest}
            />
            <ZeroConnectionsOverlay />
          </ScrollView>
          <FAB
            style={{
              position: 'absolute',
              bottom: 15,
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
                  ? t('Validating...')
                  : t('Proceed')
                : undefined
            }
          />
        </ScreenBody>
      )}
    </Formik>
  );
}

SendScreen.nav = ({ theme }) => ({
  name: 'Send',
  options: ({ route }) => ({
    headerTitle: ({ style, tintColor }) => (
      <HeaderTitle style={style} tintColor={tintColor}>
        Send{' '}
        <TokenName
          color={theme.dark ? theme.foreground : theme.onPrimary}
          bold
          account={route.params?.account}
          verbose
        />
      </HeaderTitle>
    ),
  }),
});
