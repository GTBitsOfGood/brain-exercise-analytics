import { useState } from "react";
import Dropdown, { DropdownProps, DropdownOption } from "../Dropdown/Dropdown";

function DateSelector() {
  const [selectedValue, setSelectedValue] = useState("Most Recent");
  const options: DropdownOption<string>[] = [];
  options.push({ value: "Most Recent", displayValue: "Most Recent" });
  options.push({ value: "3 Months", displayValue: "3 Months" });
  options.push({ value: "6 Months", displayValue: "6 Months" });
  options.push({ value: "1 Year", displayValue: "1 Year" });
  options.push({ value: "Max", displayValue: "Max" });

  return (
    <Dropdown
      options={options}
      value={selectedValue}
      required={false}
      placeholder={"Most Recent"}
      showError={false}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedValue(e.target.value);
      }}
    />
  );
}

export default DateSelector;
