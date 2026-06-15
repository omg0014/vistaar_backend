import { useState, useEffect } from 'react';
import { searchByKeyword } from '../services/searchService';

export function useKeywordSuggestions(keyword, activeTab) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (activeTab !== 'keyword' || keyword.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(() => {
      searchByKeyword(keyword)
        .then(d => {
          if (d.status && d.data) {
            const kw = keyword.trim().toLowerCase();
            const sorted = [...d.data].sort((a, b) => {
              const na = (a.schoolName || '').toLowerCase();
              const nb = (b.schoolName || '').toLowerCase();
              const sa = na === kw ? 0 : na.startsWith(kw) ? 1 : 2;
              const sb = nb === kw ? 0 : nb.startsWith(kw) ? 1 : 2;
              return sa !== sb ? sa - sb : na.localeCompare(nb);
            });
            setSuggestions(sorted);
          } else {
            setSuggestions([]);
          }
        })
        .catch(() => setSuggestions([]));
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword, activeTab]);

  return { suggestions, showSuggestions, setShowSuggestions };
}
