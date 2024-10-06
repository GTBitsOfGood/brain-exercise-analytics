import { FC, useCallback, useEffect, useRef, useState } from "react";
import styles from "./LiveSearchDropdown.module.css"

interface Props<T> {
  results?: T[];
  renderItem(item: T): JSX.Element;
  onChange?: React.ChangeEventHandler;
  onSelect?: (item: T) => void;
  value?: string;
}

const LiveSearchDropdown = <T extends object>({
  results = [],
  renderItem,
  value,
  onChange,
  onSelect,
}: Props<T>): JSX.Element => {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const resultContainer = useRef<HTMLDivElement>(null);
  const [showResults, setShowResults] = useState(false);
  const [defaultValue, setDefaultValue] = useState("");

  const handleSelection = (selectedIndex: number) => {
    const selectedItem = results[selectedIndex];
    if (!selectedItem) return resetSearchComplete();
    onSelect && onSelect(selectedItem);
    resetSearchComplete();
  };

  const resetSearchComplete = useCallback(() => {
    setFocusedIndex(-1);
    setShowResults(false);
  }, []);

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    const { key } = e;
    let nextIndexCount = 0;

    // move down
    if (key === "ArrowDown")
      nextIndexCount = (focusedIndex + 1) % results.length;

    // move up
    if (key === "ArrowUp")
      nextIndexCount = (focusedIndex + results.length - 1) % results.length;

    // hide search results
    if (key === "Escape") {
      resetSearchComplete();
    }

    // select the current item
    if (key === "Enter") {
      e.preventDefault();
      handleSelection(focusedIndex);
    }

    setFocusedIndex(nextIndexCount);
  };

  type changeHandler = React.ChangeEventHandler<HTMLInputElement>;
  const handleChange: changeHandler = (e) => {
    setDefaultValue(e.target.value);
    onChange && onChange(e);
  };

  useEffect(() => {
    if (!resultContainer.current) return;

    resultContainer.current.scrollIntoView({
      block: "center",
    });
  }, [focusedIndex]);

  useEffect(() => {
    if (results.length > 0 && !showResults) setShowResults(true);

    if (results.length <= 0) setShowResults(false);
  }, [results]);

  useEffect(() => {
    if (value) setDefaultValue(value);
  }, [value]);

  return (
    <div className={styles.container}>
      <div
        tabIndex={1}
        onBlur={resetSearchComplete}
        onKeyDown={handleKeyDown}
        className={styles.dropdown}
      >
        <input
          value={defaultValue}
          onChange={handleChange}
          type="text"
          className={styles.input}
          placeholder="Search your query..."
        />

        {/* Search Results Container */}
        {showResults && (
          <div className={styles.results}>
            {results.map((item, index) => {
              return (
                <div
                  key={index}
                  onMouseDown={() => handleSelection(index)}
                  ref={index === focusedIndex ? resultContainer : null}
                  style={{
                    backgroundColor:
                      index === focusedIndex ? "rgba(0,0,0,0.1)" : "",
                  }}
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