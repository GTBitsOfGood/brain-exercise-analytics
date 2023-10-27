import { Poppins, Inter } from "next/font/google";
import { CSSProperties } from "react";
import { Days } from "@/common_utils/types";
import { Box } from "@mui/material";
import { grayCircle as GC } from "@src/app/icons";

const poppins500 = Poppins({ subsets: ["latin"], weight: "500" });
const inter700 = Inter({ subsets: ["latin"], weight: "700" });

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
interface DataParams {
  days: Days[];
  style?: CSSProperties;
}

export default function WeeklyProgress({ days, style = {} }: DataParams) {
  return (
    <Box
      sx={{
        width: "1401px",
        height: "163px",
        backgroundColor: "white",
        borderRadius: "15px",
        boxShadow: "14px 17px 40px 4px rgba(112, 144, 176, 0.08)",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingLeft: "21px",
        ...style,
      }}
    >
      <Box
        sx={{
          width: "1355px",
          height: "16px",
          alignItems: "flex-start",
          gap: "180px",
          backgroundColor: "#f3f3f3",
          position: "absolute",
          marginLeft: "5px",
        }}
      />
      {[...Array(7)].map((_, i) => (
        <Box
          key={i}
          sx={{
            marginLeft: `${221 * i}px`,
            position: "absolute",
          }}
        >
          <GC />
        </Box>
      ))}
    </Box>
  );
}
