import { useState, useCallback } from 'react';

export default function useRefresh(doRefresh) {
  const [refreshing, setRefreshing] = useState(false);
  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await doRefresh();
    } finally {
      setRefreshing(false);
    }
  }, [refreshing]);

  return [refreshing, refresh];
}
