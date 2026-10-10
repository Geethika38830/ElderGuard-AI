import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Stack
} from "@mui/material";

import {
  TrendingUp,
  WarningAmber,
  CheckCircleOutline,
  ErrorOutline
} from "@mui/icons-material";


interface Props {
  level: string;
  score: number;
}


export default function RiskCard({
  level,
  score
}: Props) {

  let color = "#2e7d32";
  let background = "#e8f5e9";
  let icon = <CheckCircleOutline />;
  let message =
    "Low fall-risk profile. Continue regular monitoring.";

  if (level === "Moderate") {

    color = "#ed6c02";
    background = "#fff3e0";
    icon = <WarningAmber />;
    message =
      "Some risk factors detected. Preventive measures are recommended.";

  }

  if (level === "High") {

    color = "#d32f2f";
    background = "#ffebee";
    icon = <ErrorOutline />;
    message =
      "Elevated fall-risk profile. Consider additional preventive support.";

  }


  return (

    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border:
          "1px solid #e2e8f0",
        overflow: "hidden",
        background:
          "linear-gradient(145deg,#ffffff,#f8fafc)",
        transition:
          "all 0.25s ease",

        "&:hover": {
          transform:
            "translateY(-3px)",
          boxShadow:
            "0 12px 30px rgba(15,23,42,0.10)"
        }
      }}
    >

      <CardContent
        sx={{
          p: {
            xs: 2.5,
            md: 3
          }
        }}
      >

        {/* HEADER */}

        <Box
          sx={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "flex-start",
            gap: 2
          }}
        >

          <Box>

            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                fontWeight: 600
              }}
            >
              Current Fall-Risk Status
            </Typography>

            <Typography
              variant="h6"
              fontWeight={800}
              sx={{
                mt: 0.5,
                color: "#172033"
              }}
            >
              Latest Screening Result
            </Typography>

          </Box>


          {/* STATUS ICON */}

          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color,
              backgroundColor:
                background
            }}
          >
            {icon}
          </Box>

        </Box>


        {/* SCORE */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mt: 3
          }}
        >

          <Typography
            sx={{
              fontSize: "3rem",
              lineHeight: 1,
              fontWeight: 800,
              color
            }}
          >
            {score}%
          </Typography>


          <Stack spacing={0.5}>

            <Chip
              label={`${level} Risk`}
              size="small"
              sx={{
                width: "fit-content",
                fontWeight: 700,
                color: "#fff",
                backgroundColor: color
              }}
            />

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Risk score
            </Typography>

          </Stack>

        </Box>


        {/* PROGRESS */}

        <Box sx={{ mt: 3 }}>

          <Box
            sx={{
              display: "flex",
              justifyContent:
                "space-between",
              mb: 0.8
            }}
          >

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Risk level
            </Typography>

            <Typography
              variant="caption"
              fontWeight={700}
              sx={{ color }}
            >
              {score} / 100
            </Typography>

          </Box>


          <LinearProgress
            variant="determinate"
            value={Math.min(
              Math.max(score, 0),
              100
            )}
            sx={{
              height: 9,
              borderRadius: 10,
              backgroundColor:
                "#e2e8f0",

              "& .MuiLinearProgress-bar":
                {
                  borderRadius: 10,
                  backgroundColor: color
                }
            }}
          />

        </Box>


        {/* MESSAGE */}

        <Box
          sx={{
            mt: 3,
            p: 1.8,
            borderRadius: 2.5,
            backgroundColor:
              background
          }}
        >

          <Typography
            variant="body2"
            sx={{
              color: "#475569",
              lineHeight: 1.6
            }}
          >
            {message}
          </Typography>

        </Box>


        {/* SCALE */}

        <Box
          sx={{
            display: "flex",
            justifyContent:
              "space-between",
            mt: 2
          }}
        >

          <Typography
            variant="caption"
            sx={{
              color: "#2e7d32",
              fontWeight: 600
            }}
          >
            0–30 Low
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: "#ed6c02",
              fontWeight: 600
            }}
          >
            31–60 Moderate
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: "#d32f2f",
              fontWeight: 600
            }}
          >
            61–100 High
          </Typography>

        </Box>

      </CardContent>

    </Card>
  );
}