import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  CircularProgress
} from "@mui/material";

import {
  useEffect,
  useState
} from "react";

import {
  getPhysioDashboard
} from "../../services/api";


export default function PhysiotherapistDashboard() {

  const [data, setData] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    getPhysioDashboard()
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


  if (!data) {

    return (
      <Typography sx={{ p: 4 }}>
        Unable to load physiotherapist dashboard.
      </Typography>
    );
  }


  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        p: { xs: 2, md: 4 }
      }}
    >

      <Typography
        variant="h4"
        fontWeight={800}
      >
        Physiotherapist Dashboard
      </Typography>

      <Typography
        color="text.secondary"
        mb={4}
      >
        Welcome, {data.physiotherapist.name}
      </Typography>


      <Grid
        container
        spacing={2}
        mb={4}
      >

        {[
          [
            "Patients",
            data.total_patients
          ],
          [
            "Assessments",
            data.total_assessments
          ],
          [
            "High Risk",
            data.high_risk
          ],
          [
            "Moderate Risk",
            data.moderate_risk
          ],
          [
            "Low Risk",
            data.low_risk
          ]
        ].map(([title, value]) => (

          <Grid
            key={title}
            size={{
              xs: 12,
              sm: 6,
              md: 2.4
            }}
          >

            <Card>
              <CardContent>

                <Typography
                  color="text.secondary"
                >
                  {title}
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={900}
                  mt={1}
                >
                  {value}
                </Typography>

              </CardContent>
            </Card>

          </Grid>

        ))}

      </Grid>


      <Card>

        <CardContent>

          <Typography
            variant="h6"
            fontWeight={800}
            mb={2}
          >
            Recent Patient Assessments
          </Typography>


          {data.recent_assessments.length === 0 ? (

            <Typography>
              No patient assessments yet.
            </Typography>

          ) : (

            data.recent_assessments.map(
              (item: any) => (

                <Box
                  key={item.assessment_id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 2,
                    borderBottom:
                      "1px solid #eee"
                  }}
                >

                  <Box>

                    <Typography
                      fontWeight={700}
                    >
                      {item.patient_name}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {new Date(
                        item.created_at
                      ).toLocaleString()}
                    </Typography>

                  </Box>


                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2
                    }}
                  >

                    <Typography
                      fontWeight={800}
                    >
                      {item.risk_score}
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

                </Box>

              )
            )

          )}

        </CardContent>

      </Card>

    </Box>
  );
}