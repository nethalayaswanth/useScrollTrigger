import * as React from "react";

/**
 * Creates a stable reference to the provided value.
 * 
 * @template T The type of the provided value.
 * @param {T} current The value to be referenced.
 * @returns {React.MutableRefObject<T>} A reference to the provided value.
 */
const useLatest = <T>(current: T): React.MutableRefObject<T> => {
  const storedValue = React.useRef<T>(current);
  React.useEffect(() => {
    storedValue.current = current;
  });
  return storedValue;
};


export default useLatest;
