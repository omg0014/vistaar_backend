import { useState, useCallback } from 'react';
import { getCaptcha } from '../services/searchService';

export function useCaptcha() {
  const [captchaImg, setCaptchaImg] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');

  const refreshCaptcha = useCallback(() => {
    getCaptcha()
      .then(d => {
        // UDISE returns { data: "<base64>" } — data IS the string directly (no nested object)
        const raw = d?.data;
        const img = typeof raw === 'string' ? raw : raw?.captchaImage || '';
        setCaptchaImg(img);
      })
      .catch(() => {});
  }, []);

  return { captchaImg, captchaInput, setCaptchaInput, refreshCaptcha };
}
