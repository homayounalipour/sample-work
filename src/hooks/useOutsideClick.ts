import {useEffect, useRef} from 'react';

export type UseOutsideClickParams = {
  handler: () => void;
  listenCapturing?: boolean;
};

export default function useOutsideClick<T extends HTMLElement>(
  params: UseOutsideClickParams,
) {
  const {handler, listenCapturing = true} = params;
  const ref = useRef<T>(null);

  useEffect(() => {
    function handleClick(e: any) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handler();
      }
    }

    document.addEventListener('click', handleClick, listenCapturing);

    return () =>
      document.removeEventListener('click', handleClick, listenCapturing);
  }, [handler, listenCapturing]);

  return ref;
}
