import { useState } from 'react';

const useBoolean = (defaultValue: boolean = false) => {
  const [value, setValue] = useState(defaultValue);

  const action = () => {
    const setTrue = (): void => {
      setValue(true);
    };

    const setFalse = (): void => {
      setValue(false);
    };

    const setToggle = (): void => {
      setValue(!value);
    };

    return {
      setTrue,
      setFalse,
      setToggle,
    };
  };

  return [value, action];
};

export { useBoolean };
