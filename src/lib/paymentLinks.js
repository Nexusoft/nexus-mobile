import { Linking } from 'react-native';

import { addressRegex } from 'consts/regex';
import { callAPI } from 'lib/api';
import { navReadyRef, push } from 'lib/navigation';
import { parsePaymentRequest } from 'lib/paymentRequest';
import { mainAccount, selectLoggedIn } from 'lib/user';
import { getStore } from 'store';

const navWaitMs = 500;

//a link that arrives before login waits here
let pendingRequest = null;

//send from an own account of the recipient's token, the fullest one
async function pickAccount(request, accounts) {
  try {
    const recipient = await callAPI(
      'finance/get/any',
      addressRegex.test(request.address)
        ? { address: request.address }
        : { name: request.address }
    );
    const sameToken = accounts.filter(
      (acc) => acc.token === recipient?.token && acc.type !== 'TRUST'
    );
    if (sameToken.length) {
      return sameToken.reduce((a, b) => ((b.balance || 0) > (a.balance || 0) ? b : a));
    }
  } catch (err) {}
  return mainAccount(accounts);
}

async function openPendingRequest() {
  const state = getStore().getState();
  if (!pendingRequest || !selectLoggedIn(state) || !state.user.accounts?.length) {
    return;
  }
  if (!navReadyRef.current) {
    setTimeout(openPendingRequest, navWaitMs);
    return;
  }
  const request = pendingRequest;
  pendingRequest = null;
  const account = await pickAccount(request, state.user.accounts);
  //push, so an already open Send screen does not keep its old form
  push('Send', {
    account,
    sendTo: request.address,
    amount: request.amount,
    reference: request.reference,
    label: request.label,
  });
}

export function openPaymentLink(url) {
  const request = parsePaymentRequest(url);
  if (!request) return false;
  pendingRequest = request;
  openPendingRequest();
  return true;
}

export function watchPaymentLinks() {
  Linking.getInitialURL()
    .then((url) => url && openPaymentLink(url))
    .catch(() => {});
  Linking.addEventListener('url', ({ url }) => openPaymentLink(url));
  getStore().observe(
    (state) => selectLoggedIn(state) && state.user.accounts?.length > 0,
    (ready) => {
      if (ready) openPendingRequest();
    }
  );
}
