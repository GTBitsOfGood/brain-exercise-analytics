import React from "react";

interface CheckboxProps {
  className?: string;
  idCheckLineStyleOverrideClassName?: string;
  isChecked: boolean;
  onChange: () => void;
  size?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  className,
  idCheckLineStyleOverrideClassName,
  isChecked,
  onChange,
  size,
}) => (
  <label className={`${className} ${size}`}>
    <input type="checkbox" checked={isChecked} onChange={onChange} />
    <span className={idCheckLineStyleOverrideClassName}></span>
  </label>
);

export default Checkbox;
