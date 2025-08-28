import React from "react";

export function useToggle(
  initialValue: boolean = false
): [boolean, () => void, React.Dispatch<React.SetStateAction<boolean>>] {
  const [value, setValue] = React.useState<boolean>(initialValue);

  const toggle = React.useCallback(() => {
    setValue((v) => !v);
  }, []);

  return [value, toggle, setValue];
}
