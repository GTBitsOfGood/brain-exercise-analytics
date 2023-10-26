import { useState } from "react";
import Dropdown, { DropdownProps, DropdownOption } from "../Dropdown/Dropdown";

function DateSelector() {
  const [selectedValue, setSelectedValue] = useState("Recent");
  const options: DropdownOption<string>[] = [];
  options.push({ value: "Recent", displayValue: "Recent" });
  options.push({ value: "3 Months", displayValue: "3 Months" });
  options.push({ value: "6 Months", displayValue: "6 Months" });
  options.push({ value: "1 Year", displayValue: "1 Year" });
  options.push({ value: "Max", displayValue: "Max" });

  const dropdownprops: DropdownProps<string> = {
    options,
    value: selectedValue,
    required: true,
    showError: false,
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedValue(e.target.value);
    },
  };

  return <Dropdown props={dropdownprops} />;
}

export default DateSelector;
