import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress
} from "@mui/material";

import {
  useEffect,
  useState
} from "react";

import {
  getAssignedPatients
} from "../../services/api";

import { useNavigate } from "react-router-dom";


export default function MyPatients() {

  const [patients, setPatients] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const navigate = useNavigate();


  useEffect(() => {

    getAssignedPatients()
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
        My Patients
      </Typography>


      {patients.length === 0 ? (

        <Card>
          <CardContent>
            <Typography>
              No patients have been assigned yet.
            </Typography>
          </CardContent>
        </Card>

      ) : (

        patients.map((patient) => (

          <Card
            key={patient.id}
            sx={{ mb: 2 }}
          >

            <CardContent>

              <Typography
                variant="h6"
                fontWeight={800}
              >
                {patient.name}
              </Typography>

              <Typography
                color="text.secondary"
              >
                {patient.email}
              </Typography>

              <Button
                sx={{ mt: 2 }}
                variant="contained"
                onClick={() =>
                  navigate(
                    `/physiotherapist/patient/${patient.id}`
                  )
                }
              >
                View Patient
              </Button>

            </CardContent>

          </Card>

        ))

      )}

    </Box>
  );
}