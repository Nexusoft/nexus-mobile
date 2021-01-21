import { refreshUserSync } from 'lib/user';
import { useState, useCallback } from 'react';

export default function useRefresh(doRefresh, options = {resync: true}) {
  const [refreshing, setRefreshing] = useState(false);
  const refresh = async () => {
    setRefreshing(true);
    try {
      options.resync && await refreshUserSync();
      await doRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  return [refreshing, refresh];
}
