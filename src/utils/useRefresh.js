import { refreshUserSync } from 'lib/user';
import { useState } from 'react';

export default function useRefresh(doRefresh, options = { resync: true }) {
  const [refreshing, setRefreshing] = useState(false);
  const refresh = async () => {
    setRefreshing(true);
    try {
      await doRefresh();
    } finally {
      setRefreshing(false);
    }
    //lite core: fetch history it may have missed in the background, can take a while
    if (options.resync && (await refreshUserSync())) {
      doRefresh();
    }
  };

  return [refreshing, refresh];
}
