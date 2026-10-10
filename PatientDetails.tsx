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
  getPatientDetails
} from "../../services/api";

import {
  useParams
} from "react-router-dom";


export default function PatientDetails() {

  const { patientId } =
    useParams();

  const [data, setData] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    if (!patientId) {
      return;
    }

    getPatientDetails(
      Number(patientId)
    )
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));

  }, [patientId]);


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


  if (!data) {

    return (
      <Typography sx={{ p: 4 }}>
        Patient details unavailable.
      </Typography>
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
        {data.patient.name}
      </Typography>


      <Card sx={{ mb: 3 }}>
        <CardContent>

          <Typography>
            Email: {data.patient.email}
          </Typography>

          <Typography>
            Subscription:{" "}
            {data.patient.subscription_plan}
          </Typography>

        </CardContent>
      </Card>


      <Typography
        variant="h6"
        fontWeight={800}
        mb={2}
      >
        Assessment History
      </Typography>


      {data.assessment_history.map(
        (item: any) => (

          <Card
            key={item.id}
            sx={{ mb: 2 }}
          >

            <CardContent>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between"
                }}
              >

                <Typography
                  fontWeight={800}
                >
                  Risk Score: {item.risk_score}
                </Typography>

                <Chip
                  label={item.risk_level}
                  color={
                    item.risk_level === "High"
                      ? "error"
                      : item.risk_level === "Moderate"
                      ? "warning"
                      : "success"
                  }
                />

              </Box>

              <Typography
                variant="body2"
                color="text.secondary"
                mt={1}
              >
                {new Date(
                  item.created_at
                ).toLocaleString()}
              </Typography>

              <Typography mt={2}>
                Risk Factors
              </Typography>

              {item.risk_factors.map(
                (factor: string) => (
                  <Typography
                    key={factor}
                    variant="body2"
                  >
                    • {factor}
                  </Typography>
                )
              )}

            </CardContent>

          </Card>

        )
      )}

    </Box>
  );
}