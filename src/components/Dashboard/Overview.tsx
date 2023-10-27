import { Box, Typography } from "@mui/material";
import { DM_Sans } from "next/font/google";
import { personIcon, barChartIcon } from "@src/app/icons";
import { SmallDataBox } from "../Graphs";
import peopleIcon from "@src/app/icons/personIcon";

interface Params {
  activeUsers: number;
  totalUsers: number;
  usersOverTime: {
    users: number;
    date: string;
  }[];
  style?: object;
}

const dmSans700 = DM_Sans({ subsets: ["latin"], weight: "700" });

export default function Overview(params: Params) {
  return (
    <Box
      sx={{
        height: 164,
      }}
    >
      <Typography
        sx={{
          color: "#2B3674",
          fontFamily: dmSans700.style.fontFamily,
          fontSize: "29.705px",
          fontStyle: "normal",
          lineHeight: "36.695px",
          letterSpacing: "-0.594px",
        }}
      >
        Overview / Report
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "row", marginTop: "51px" }}>
        <SmallDataBox
          title={"Active Users"}
          Icon={personIcon}
          titleAboveText
          text={`${params.activeUsers} / ${params.totalUsers}`}
        />
        <SmallDataBox
          title={"Total Users"}
          Icon={peopleIcon}
          titleAboveText
          text={`${params.totalUsers}`}
          style={{ marginLeft: 15 }}
        />
      </Box>
    </Box>
  );
}
