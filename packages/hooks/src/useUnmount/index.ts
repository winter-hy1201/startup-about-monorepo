import useLatest from '@/hooks/useLatest';
import { isFunction } from '@/utils/ts_tools';
import { useEffect } from 'react';

const useUnmount = (fn: () => void) => {
  if (!isFunction(fn)) {
    console.error(
      `useUnmount expected parameter is a function, got ${typeof fn}`,
    );
  }

  const fnRef = useLatest(fn);

  useEffect(
    () => () => {
      fnRef.current();
    },
    [],
  );
};

export default useUnmount;
