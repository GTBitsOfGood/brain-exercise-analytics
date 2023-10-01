import React from "react";

interface DropdownOption<T> {
  value: T;
  displayValue: string;
}

interface DropdownProps<T> {
  options: DropdownOption<T>[];
  className?: string;
  value?: T;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

function Dropdown<T>(props: DropdownProps<T>) {
  const { className, options } = props;

  return (
    <select className={className}>
      {options.map((option, index) => (
        <option key={index} value={option.value as unknown as string}>
          {option.displayValue}
        </option>
      ))}
    </select>
  );
}

export default Dropdown;
