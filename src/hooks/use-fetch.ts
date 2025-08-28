import React from "react";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface FetchResult<T> extends FetchState<T> {
  refetch: () => void;
}

export function useFetch<T>(url: string): FetchResult<T> {
  const [state, setState] = React.useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = React.useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
    }
  }, [url]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    refetch: fetchData,
  };
}
