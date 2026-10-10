import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress
} from "@mui/material";

import {
  useEffect,
  useState
} from "react";

import {
  getRiskMonitoring
} from "../../services/api";


export default function RiskMonitoring() {

  const [patients, setPatients] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    getRiskMonitoring()
      .then(setPatients)
      .catch(console.error)
      .finally(() => setLoading(false));

  }, []);


  if (loading) {

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 8
        }}
      >
        <CircularProgress />
      </Box>
    );
  }


  return (
    <Box
      sx={{
        maxWidth: 1100,
        mx: "auto",
        p: { xs: 2, md: 4 }
      }}
    >

      <Typography
        variant="h4"
        fontWeight={800}
        mb={3}
      >
        Risk Monitoring
      </Typography>


      {patients.map((patient) => (

        <Card
          key={patient.patient_id}
          sx={{ mb: 2 }}
        >

          <CardContent>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >

              <Box>

                <Typography
                  fontWeight={800}
                >
                  {patient.patient_name}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Last assessment:{" "}
                  {new Date(
                    patient.created_at
                  ).toLocaleString()}
                </Typography>

              </Box>


              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center"
                }}
              >

                <Typography
                  variant="h5"
                  fontWeight={900}
                >
                  {patient.risk_score}
                </Typography>

                <Chip
                  label={patient.risk_level}
                  color={
                    patient.risk_level === "High"
                      ? "error"
                      : patient.risk_level === "Moderate"
                      ? "warning"
                      : "success"
                  }
                />

              </Box>

            </Box>

          </CardContent>

        </Card>

      ))}

    </Box>
  );
}