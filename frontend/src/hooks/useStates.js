import { useState, useEffect } from 'react';
import { getStates } from '../services/mastersService';
import { DEFAULT_YEAR_ID } from '../utils/constants';

export function useStates() {
  const [states, setStates] = useState([]);

  useEffect(() => {
    getStates(DEFAULT_YEAR_ID)
      .then(d => { if (d.status && d.data) setStates(d.data); })
      .catch(() => {});
  }, []);

  return states;
}
