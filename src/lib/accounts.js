//the two accounts every profile gets at creation: default and trust
const baseName = (account) => (account?.name || '').split(':').pop();

export function accountRole(account) {
  if (!account) return null;
  if (account.type === 'TRUST' || account.stake !== undefined) return 'trust';
  const name = baseName(account);
  if (name === 'trust') return 'trust';
  if (name === 'default' && isNxs(account)) return 'default';
  return null;
}

export const isMainAccount = (account) => !!accountRole(account);

export const isNxs = (account) => !account?.token || account.token === '0';

const roleOrder = { default: 0, trust: 1 };

//default first, then trust, then the rest in the order the core gave them
export function sortAccounts(accounts) {
  if (!Array.isArray(accounts)) return accounts;
  return accounts
    .map((account, i) => ({ account, i, role: accountRole(account) }))
    .sort((a, b) => {
      const ra = a.role ? roleOrder[a.role] : 9;
      const rb = b.role ? roleOrder[b.role] : 9;
      return ra - rb || a.i - b.i;
    })
    .map((x) => x.account);
}

export const trustAccountOf = (accounts) =>
  accounts?.find((a) => accountRole(a) === 'trust');

export const defaultAccountOf = (accounts) =>
  accounts?.find((a) => accountRole(a) === 'default');
