"use client";

import { SelectChangeEvent } from "@mui/material";
import { Poppins } from "next/font/google";
import { DateRangeEnum } from "@/common_utils/types";
import Dropdown, { DropdownOption } from "../Dropdown/Dropdown";

const poppins500 = Poppins({ subsets: ["latin"], weight: "500" });
const poppins400 = Poppins({ subsets: ["latin"], weight: "400" });
const options: DropdownOption<DateRangeEnum>[] = Object.values(
  DateRangeEnum,
).map((range) => ({
  value: range,
  displayValue: range.toString(),
}));

function GroupSelector({
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
        borderRadius: 0,
        color: "#2B3674",
        border: "none",
        fontSize: "18px",
        fontFamily: poppins500.style.fontFamily,
        width: "180px",
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
        color: "#2B3674",
        backgroundColor: "#FCE8DC",
        borderRadius: "10px",
        marginBottom: "10px",
        marginLeft: "16px",
        marginRight: "auto",
        width: "fit-content",
        fontSize: "16px",
        fontFamily: poppins400.style.fontFamily,
      }}
    />
  );
}

export default GroupSelector;
