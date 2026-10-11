import React, { useEffect } from 'react';
import { useData } from '../context/DataContext';

export default function Toast() {
  const { toastMsg, hideToast } = useData();

  useEffect(() => {
    if (!toastMsg) return;
    const timer = setTimeout(() => {
      hideToast();
    }, 2800);
    return () => clearTimeout(timer);
  }, [toastMsg, hideToast]);

  if (!toastMsg) return null;

  return <div id="tt">{toastMsg}</div>;
}
