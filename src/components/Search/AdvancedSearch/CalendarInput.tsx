import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { styled } from "@mui/material";
import { Poppins } from "next/font/google";
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
  },
  "& .MuiOutlinedInput-root": {
    height: "30px",
    "& fieldset": {
      border: "0px solid black",
      outline: "none",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#3b82f6",
    },
  },
})) as typeof DatePicker;

export default function Calendar({ value = "", onChange }: CalendarInputProp) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={[styles.answer, styles.calendarContainer].join(" ")}>
        <StyledDatePicker
          value={value}
          sx={{
            "& .MuiInputBase-root": {
              color: value === "" ? "#a3aed0" : "#313144",
            },
          }}
          onChange={(val) => {
            if (val === null) return;
            onChange(val.toString());
          }}
        />
      </div>
    </LocalizationProvider>
  );
}
