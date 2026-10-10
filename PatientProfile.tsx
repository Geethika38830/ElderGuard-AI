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
  getPatientProfile
} from "../../services/api";


export default function PatientProfile() {

  const [data, setData] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    getPatientProfile()
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
        Unable to load profile.
      </Typography>
    );
  }


  const patient =
    data.patient;

  const physio =
    data.physiotherapist;


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
        My Profile
      </Typography>


      <Card sx={{ mb: 3 }}>
        <CardContent>

          <Typography
            variant="h6"
            fontWeight={700}
          >
            Personal Information
          </Typography>

          <Typography mt={2}>
            Name: {patient.name}
          </Typography>

          <Typography>
            Email: {patient.email}
          </Typography>

          <Typography>
            Account Type: Patient
          </Typography>

        </CardContent>
      </Card>


      <Card sx={{ mb: 3 }}>
        <CardContent>

          <Typography
            variant="h6"
            fontWeight={700}
          >
            Subscription
          </Typography>

          <Box mt={2}>
            <Chip
              label={
                patient.subscription_plan === "plus"
                  ? "Patient Plus"
                  : "Free Plan"
              }
              color={
                patient.subscription_plan === "plus"
                  ? "primary"
                  : "default"
              }
            />
          </Box>

        </CardContent>
      </Card>


      <Card>
        <CardContent>

          <Typography
            variant="h6"
            fontWeight={700}
          >
            Assigned Physiotherapist
          </Typography>

          {physio ? (
            <>
              <Typography mt={2}>
                {physio.name}
              </Typography>

              <Typography>
                {physio.email}
              </Typography>
            </>
          ) : (
            <Typography mt={2}>
              No physiotherapist assigned yet.
            </Typography>
          )}

        </CardContent>
      </Card>

    </Box>
  );
}