import { callAPI } from 'lib/api';

const trustNotFound = -70;

//null when the profile has no trust account yet
export async function fetchStakeInfo() {
  try {
    return await callAPI('finance/get/stakeinfo');
  } catch (err) {
    if (err?.code === trustNotFound) return null;
    throw err;
  }
}

//newest staking rewards (trust and genesis blocks)
export async function fetchStakeRewards(limit = 20) {
  return (
    (await callAPI('profiles/transactions/master', {
      verbose: 'summary',
      limit,
      where: '(results.contracts.OP=TRUST OR results.contracts.OP=GENESIS)',
    })) || []
  )
    .map((tx) => ({
      txid: tx.txid,
      timestamp: tx.timestamp,
      amount: (tx.contracts || [])
        .filter((c) => c.OP === 'TRUST' || c.OP === 'GENESIS')
        .reduce((sum, c) => sum + (c.amount || 0), 0),
    }))
    .filter((r) => r.amount);
}

//new total stake: more than now comes from the trust account balance, less goes back to it
export async function setStake(amount, pin) {
  return await callAPI('finance/set/stake', { amount, pin });
}

//the core's stake minter for this profile, full nodes only
export async function setStaking(on, pin) {
  return await callAPI(on ? 'sessions/unlock/local' : 'sessions/lock/local', {
    pin,
    staking: true,
  });
}
