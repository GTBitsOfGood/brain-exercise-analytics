import { useCallback, useEffect, useState } from "react";
import styles from "./LiveSearchDropdown.module.css";
import InputField from "../InputField/InputField";

interface Props<T> {
  options?: T[];
  renderItem(item: T): JSX.Element;
  onChange?: React.ChangeEventHandler;
  onSelect?: (item: T) => void;
  value: string;
  setValue: (arg: string) => void;
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
  error,
}: Props<T>): JSX.Element => {
  const [showOptions, setShowOptions] = useState(false);

  const resetSearchComplete = useCallback(() => {
    setShowOptions(false);
  }, []);

  const handleSelection = (selectedIndex: number) => {
    const selectedItem = options[selectedIndex];
    if (!selectedItem) return resetSearchComplete();
    if (onSelect) {
      onSelect(selectedItem);
    }
    resetSearchComplete();
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    const { key } = e;
    // hide search options
    if (key === "Escape") {
      resetSearchComplete();
    }
  };

  type ChangeHandler = React.ChangeEventHandler<HTMLInputElement>;
  const handleChange: ChangeHandler = (e) => {
    setValue(e.target.value);
    if (onChange) {
      onChange(e);
    }
  };

  useEffect(() => {
    if (options.length > 0 && !showOptions) setShowOptions(true);

    if (options.length <= 0) setShowOptions(false);
  }, [options]);

  return (
    <div className={styles.container}>
      <div
        tabIndex={1}
        onBlur={resetSearchComplete}
        onKeyDown={handleKeyDown}
        className={styles.dropdown}
      >
        <InputField
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          showError={showError}
          error={error}
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
