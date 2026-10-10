import {
  Card,
  CardContent,
  Typography,
  Box
} from "@mui/material";

import {
  Assessment,
  WarningAmber,
  ErrorOutline,
  CheckCircleOutline
} from "@mui/icons-material";

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
}


export default function HealthCard({
  title,
  value,
  subtitle
}: Props) {

  const getCardStyle = () => {

    if (title.toLowerCase().includes("high")) {
      return {
        icon: <ErrorOutline />,
        iconColor: "#d32f2f",
        iconBg: "#ffebee",
        accent: "#d32f2f"
      };
    }

    if (title.toLowerCase().includes("moderate")) {
      return {
        icon: <WarningAmber />,
        iconColor: "#ed6c02",
        iconBg: "#fff3e0",
        accent: "#ed6c02"
      };
    }

    if (title.toLowerCase().includes("low")) {
      return {
        icon: <CheckCircleOutline />,
        iconColor: "#2e7d32",
        iconBg: "#e8f5e9",
        accent: "#2e7d32"
      };
    }

    return {
      icon: <Assessment />,
      iconColor: "#1976d2",
      iconBg: "#e3f2fd",
      accent: "#1976d2"
    };
  };


  const style = getCardStyle();


  return (

    <Card
      elevation={0}
      sx={{
        position: "relative",
        overflow: "hidden",
        height: "100%",
        borderRadius: 4,
        border: "1px solid #e2e8f0",
        background:
          "linear-gradient(145deg,#ffffff,#f8fafc)",
        transition:
          "all 0.25s ease",

        "&:hover": {
          transform:
            "translateY(-4px)",
          boxShadow:
            "0 12px 30px rgba(15,23,42,0.10)"
        }
      }}
    >

      {/* TOP ACCENT */}

      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 4,
          background:
            style.accent
        }}
      />


      <CardContent
        sx={{
          p: 2.5
        }}
      >

        {/* HEADER */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between"
          }}
        >

          <Typography
            variant="body2"
            sx={{
              color: "#64748b",
              fontWeight: 600
            }}
          >
            {title}
          </Typography>


          {/* ICON */}

          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                style.iconBg,
              color:
                style.iconColor
            }}
          >
            {style.icon}
          </Box>

        </Box>


        {/* VALUE */}

        <Typography
          sx={{
            mt: 2,
            fontSize: "2.1rem",
            lineHeight: 1,
            fontWeight: 800,
            color: "#172033"
          }}
        >
          {value}
        </Typography>


        {/* SUBTITLE */}

        {subtitle && (

          <Typography
            variant="body2"
            sx={{
              mt: 1.2,
              color: "#64748b"
            }}
          >
            {subtitle}
          </Typography>

        )}

      </CardContent>

    </Card>
  );
}