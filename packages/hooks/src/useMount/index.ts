import { isFunction } from '@/utils/ts_tools/index';
import { useEffect } from 'react';

const useMount = (fn: () => void) => {
  if (!isFunction(fn)) {
    console.error(
      `useMount: parameter \`fn\` expected to be a function, but got "${typeof fn}".`,
    );
  }

  useEffect(() => {
    fn?.();
  }, []);
};

export default useMount;
