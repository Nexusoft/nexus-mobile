import { useState, useCallback } from 'react';

export default function useRefresh(doRefresh) {
  const [refreshing, setRefreshing] = useState(false);
  const refresh = async () => {
    setRefreshing(true);
    try {
      await doRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  return [refreshing, refresh];
}
