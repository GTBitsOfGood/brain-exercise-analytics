"use client";

import { useState } from "react";
import { SelectChangeEvent } from "@mui/material";
import { Poppins } from "next/font/google";
import Dropdown, { DropdownOption } from "../Dropdown/Dropdown";

const poppins500 = Poppins({ subsets: ["latin"], weight: "500" });

function DateSelector() {
  const [selectedValue, setSelectedValue] = useState("Most Recent");
  const options: DropdownOption<string>[] = [
    { value: "Most Recent", displayValue: "Most Recent" },
    { value: "3 Months", displayValue: "3 Months" },
    { value: "6 Months", displayValue: "6 Months" },
    { value: "1 Year", displayValue: "1 Year" },
    { value: "Max", displayValue: "Max" },
  ];

  return (
    <Dropdown
      options={options}
      value={selectedValue}
      showError={false}
      onChange={(e: SelectChangeEvent) => {
        setSelectedValue(e.target.value);
      }}
      style={{
        borderRadius: 0,
        color: "#8d8d8d",
        border: "none",
        width: "130px",
        textAlign: "center",
      }}
      sx={{
        "&.MuiOutlinedInput-root": {
          "& fieldset": {
            borderRadius: "0px",
          },
        },
      }}
      menuItemStyle={{
        justifyContent: "center",
        color: "#313144",
        fontSize: "12px",
        fontFamily: poppins500.style.fontFamily,
      }}
    />
  );
}

export default DateSelector;
