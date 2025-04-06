"use client";

import { SelectChangeEvent } from "@mui/material";
import { Poppins } from "next/font/google";
import { DateRangeEnum } from "@/common_utils/types";
import Dropdown, { DropdownOption } from "../Dropdown/Dropdown";

const poppins500 = Poppins({ subsets: ["latin"], weight: "500" });
const options: DropdownOption<DateRangeEnum>[] = Object.values(
  DateRangeEnum,
).map((range) => ({
  value: range,
  displayValue: range.toString(),
}));

function DateSelector({
  selectedValue,
  setSelectedValue,
}: {
  selectedValue: DateRangeEnum;
  setSelectedValue: (value: DateRangeEnum) => void;
}) {
  return (
    <Dropdown
      options={options}
      value={selectedValue}
      showError={false}
      onChange={(e: SelectChangeEvent<DateRangeEnum>) => {
        setSelectedValue(e.target.value as DateRangeEnum);
      }}
      style={{
        borderRadius: 12,
        color: "#8d8d8d",
        border: "none",
        width: "130px",
        textAlign: "center",
        backgroundColor: "white",
      }}
      sx={{
        "&.MuiOutlinedInput-root": {
          "& fieldset": {
            borderRadius: "12px",
          },
        },
      }}
      menuItemStyle={{
        justifyContent: "center",
        color: "#313144",
        fontSize: "12px",
        fontFamily: poppins500.style.fontFamily,
      }}
      defaultBackgroundColor="#ffffff"
    />
  );
}

export default DateSelector;
