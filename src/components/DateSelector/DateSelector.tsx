import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { Dropdown, IDropdownOption } from "../Dropdown/Dropdown";

function DateSelector() {
  const [selectedValue, setSelectedValue] = useState("Most Recent");
  const options: IDropdownOption[] = [];
  options.push({ value: "Most Recent", displayValue: "Most Recent" });
  options.push({ value: "3 Months", displayValue: "3 Months" });
  options.push({ value: "6 Months", displayValue: "6 Months" });
  options.push({ value: "1 Year", displayValue: "1 Year" });
  options.push({ value: "Max", displayValue: "Max" });

  return (
    <Dropdown
      options={options}
      required={false}
      placeholder={"Most Recent"}
      showError={false}
      onChange={(e) => {
        setSelectedValue(e.currentTarget.innerText);
        console.log(selectedValue);
      }}
      icon={<FontAwesomeIcon icon={faCalendarAlt} />}
    />
  );
}

export default DateSelector;
