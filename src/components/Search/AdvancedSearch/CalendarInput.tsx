import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { styled } from "@mui/material";
import { Poppins } from "next/font/google";
import { useMemo } from "react";
import { transformDate } from "@src/utils/utils";
import styles from "./AdvancedSearch.module.css";

interface CalendarInputProp {
  value: string;
  onChange: (value: string) => void;
}

const poppins500 = Poppins({
  subsets: ["latin-ext"],
  weight: "500",
});

const StyledDatePicker = styled(DatePicker)(() => ({
  "& .MuiInputBase-root": {
    fontSize: 12,
    fontFamily: poppins500.style.fontFamily,
    borderRadius: "10px",
    color: "orange",
  },
  "& .MuiOutlinedInput-root": {
    height: "31px",
    "& fieldset": {
      border: "0px solid red",
      outline: "none",
      borderRadius: "10",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#008AFC",
    },
  },
})) as typeof DatePicker;

export default function Calendar({ value, onChange }: CalendarInputProp) {
  const date = useMemo(() => new Date(value), [value]);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={[styles.answer, styles.calendarContainer].join(" ")}>
        <StyledDatePicker
          value={date}
          sx={{
            "& .MuiInputBase-root": {
              color: value === null ? "#a3aed0" : "#313144",
            },
          }}
          onChange={(val) => {
            if (val === null) return;
            onChange(transformDate(val));
          }}
        />
      </div>
    </LocalizationProvider>
  );
}
