import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip
} from "@mui/material";

import {
  useEffect,
  useState
} from "react";

import {
  getAdminPatients
} from "../../services/api";


export default function ManageSubscriptions() {

  const [patients, setPatients] =
    useState<any[]>([]);


  useEffect(() => {

    getAdminPatients()
      .then(setPatients)
      .catch(console.error);

  }, []);


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
        Subscription Management
      </Typography>


      {patients.map((patient) => (

        <Card
          key={patient.id}
          sx={{ mb: 2 }}
        >

          <CardContent>

            <Typography
              fontWeight={800}
            >
              {patient.name}
            </Typography>

            <Typography
              color="text.secondary"
            >
              {patient.email}
            </Typography>

            <Chip
              sx={{ mt: 2 }}
              label={
                patient.subscription_plan === "plus"
                  ? "Patient Plus"
                  : "Free"
              }
              color={
                patient.subscription_plan === "plus"
                  ? "primary"
                  : "default"
              }
            />

          </CardContent>

        </Card>

      ))}

    </Box>
  );
}