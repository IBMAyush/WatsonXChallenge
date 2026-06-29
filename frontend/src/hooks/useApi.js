import { useState, useEffect } from 'react';

const API = 'http://localhost:3000';

export function useApi(path, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(API + path)
      .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
      .then(json => { setData(json.data ?? json); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}

export const API_BASE = API;
