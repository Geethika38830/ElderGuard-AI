import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress
} from "@mui/material";

import {
  useEffect,
  useState
} from "react";

import {
  getAdminDashboard
} from "../../services/api";


export default function AdminDashboard() {

  const [data, setData] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    getAdminDashboard()
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
        Unable to load admin dashboard.
      </Typography>
    );
  }


  const cards = [
    ["Total Users", data.total_users],
    ["Patients", data.total_patients],
    ["Physiotherapists", data.total_physiotherapists],
    ["Assessments", data.total_assessments],
    ["High Risk", data.high_risk_assessments],
    ["Plus Subscribers", data.plus_subscribers],
    ["Assignments", data.active_assignments]
  ];


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
        mb={4}
      >
        Admin Dashboard
      </Typography>


      <Grid
        container
        spacing={2}
      >

        {cards.map(([title, value]) => (

          <Grid
            key={title}
            size={{
              xs: 12,
              sm: 6,
              md: 4
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

    </Box>
  );
}