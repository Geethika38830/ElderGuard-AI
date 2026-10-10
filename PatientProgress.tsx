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
  getPatientProgress
} from "../../services/api";


export default function PatientProgress() {

  const [data, setData] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    getPatientProgress()
      .then(setData)
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
        maxWidth: 1000,
        mx: "auto",
        p: { xs: 2, md: 4 }
      }}
    >

      <Typography
        variant="h4"
        fontWeight={800}
        mb={3}
      >
        My Progress
      </Typography>


      {data.length === 0 ? (

        <Card>
          <CardContent>
            <Typography>
              Complete your first assessment
              to start tracking progress.
            </Typography>
          </CardContent>
        </Card>

      ) : (

        data
          .slice()
          .reverse()
          .map((item) => (

            <Card
              key={item.id}
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

                  <Typography
                    fontWeight={700}
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

                <Typography mt={1}>
                  Daily Steps: {item.daily_steps}
                </Typography>

                <Typography>
                  Exercise Days: {item.exercise_days}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  mt={1}
                >
                  {new Date(
                    item.created_at
                  ).toLocaleString()}
                </Typography>

              </CardContent>

            </Card>

          ))

      )}

    </Box>
  );
}