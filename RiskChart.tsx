import {
  Box,
  Typography
} from "@mui/material";

import {
  LineChart
} from "@mui/x-charts/LineChart";

interface RiskRecord {
  id: number;
  risk_score: number;
  risk_level: string;
  created_at: string;
}


interface Props {
  data: RiskRecord[];
}


export default function RiskChart({
  data
}: Props) {

  const sortedData = [...data].sort(
    (a, b) =>
      new Date(a.created_at).getTime() -
      new Date(b.created_at).getTime()
  );


  const scores = sortedData.map(
    item => item.risk_score
  );


  const labels = sortedData.map(
    item =>
      new Date(
        item.created_at
      ).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short"
        }
      )
  );


  if (scores.length === 0) {

    return (
      <Box
        sx={{
          height: 280,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >

        <Typography
          color="text.secondary"
        >
          No risk assessment data available.
        </Typography>

      </Box>
    );
  }


  return (

    <Box
      sx={{
        width: "100%",
        overflowX: "auto"
      }}
    >

      <LineChart
        height={300}
        series={[
          {
            data: scores,
            label: "Fall Risk Score",
            curve: "monotoneX",
            color: "#1976d2",
            showMark: true
          }
        ]}
        xAxis={[
          {
            scaleType: "point",
            data: labels,
            label: "Assessment Date"
          }
        ]}
        yAxis={[
          {
            min: 0,
            max: 100,
            label: "Risk Score"
          }
        ]}
        grid={{
          horizontal: true
        }}
        margin={{
          left: 65,
          right: 25,
          top: 25,
          bottom: 55
        }}
      />

    </Box>
  );
}