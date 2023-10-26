import { useState } from "react";
import Dropdown, { DropdownProps, DropdownOption } from "../Dropdown/Dropdown";

const Calendar = () => {
  return (
    <>
      <svg
        width="14"
        height="15"
        viewBox="0 0 14 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.6 1.36364H11.9V0.681818C11.9 0.306818 11.585 0 11.2 0C10.815 0 10.5 0.306818 10.5 0.681818V1.36364H3.5V0.681818C3.5 0.306818 3.185 0 2.8 0C2.415 0 2.1 0.306818 2.1 0.681818V1.36364H1.4C0.63 1.36364 0 1.97727 0 2.72727V13.6364C0 14.3864 0.63 15 1.4 15H12.6C13.37 15 14 14.3864 14 13.6364V2.72727C14 1.97727 13.37 1.36364 12.6 1.36364ZM11.9 13.6364H2.1C1.715 13.6364 1.4 13.3295 1.4 12.9545V4.77273H12.6V12.9545C12.6 13.3295 12.285 13.6364 11.9 13.6364Z"
          fill="#0061FF"
        />
      </svg>
    </>
  );
};

function DateSelector() {
  const [selectedValue, setSelectedValue] = useState("Recent");
  const options: DropdownOption<string>[] = [];
  options.push({ value: "Most Recent", displayValue: "Most Recent" });
  options.push({ value: "3 Months", displayValue: "3 Months" });
  options.push({ value: "6 Months", displayValue: "6 Months" });
  options.push({ value: "1 Year", displayValue: "1 Year" });
  options.push({ value: "Max", displayValue: "Max" });

  const placeHolder = (
    <p>
      {" "}
      <Calendar /> Recent
    </p>
  );

  const dropdownprops: DropdownProps<string> = {
    options,
    value: selectedValue,
    required: true,
    showError: false,
    placeholder: "Recent",
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedValue(e.target.value);
    },
  };

  return <Dropdown props={dropdownprops} />;
}

export default DateSelector;
