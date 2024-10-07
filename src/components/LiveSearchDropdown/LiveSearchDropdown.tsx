import { FC, useCallback, useEffect, useRef, useState } from "react";
import styles from "./LiveSearchDropdown.module.css"
import InputField from "../InputField/InputField";
import { Input } from "@mui/material";

interface Props<T> {
  options?: T[];
  renderItem(item: T): JSX.Element;
  onChange?: React.ChangeEventHandler;
  onSelect?: (item: T) => void;
  value: string;
  setValue: Function;
  placeholder?: string;
  showError?: boolean;
  error?: string;
}

const LiveSearchDropdown = <T extends object>({
  options = [],
  renderItem,
  value,
  setValue,
  onChange,
  onSelect,
  placeholder,
  showError,
  error
}: Props<T>): JSX.Element => {
  const [showOptions, setShowOptions] = useState(false);

  const handleSelection = (selectedIndex: number) => {
    const selectedItem = options[selectedIndex];
    if (!selectedItem) return resetSearchComplete();
    onSelect && onSelect(selectedItem);
    resetSearchComplete();
  };

  const resetSearchComplete = useCallback(() => {
    setShowOptions(false);
  }, []);

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    const { key } = e;
    // hide search options
    if (key === "Escape") {
      resetSearchComplete();
    }
  };

  type changeHandler = React.ChangeEventHandler<HTMLInputElement>;
  const handleChange: changeHandler = (e) => {
    setValue(e.target.value);
    onChange && onChange(e);
  };

  useEffect(() => {
    if (options.length > 0 && !showOptions) setShowOptions(true);

    if (options.length <= 0) setShowOptions(false);
  }, [options]);

  return (
    <div className={styles.container}>
      <div tabIndex={1} onBlur={resetSearchComplete} onKeyDown={handleKeyDown} className={styles.dropdown}>
        <InputField
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          showError={showError}
          error = {error}
        />

        {/* Search options Container */}
        {showOptions && (
          <div className={styles.options}>
            {options.map((item, index) => {
              return (
                <div
                  key={index}
                  onMouseDown={() => handleSelection(index)}
                  className={styles.row}
                >
                  {renderItem(item)}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveSearchDropdown;