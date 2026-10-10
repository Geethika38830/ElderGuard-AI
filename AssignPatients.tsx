import {
  Box,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  Button,
  Alert
} from "@mui/material";

import {
  useEffect,
  useState
} from "react";

import {
  getAdminPatients,
  getAdminPhysiotherapists,
  assignPatient
} from "../../services/api";


export default function AssignPatients() {

  const [patients, setPatients] =
    useState<any[]>([]);

  const [physios, setPhysios] =
    useState<any[]>([]);

  const [selectedPhysio, setSelectedPhysio] =
    useState<Record<number, number>>({});

  const [message, setMessage] =
    useState("");


  useEffect(() => {

    Promise.all([
      getAdminPatients(),
      getAdminPhysiotherapists()
    ])
      .then(([patientsData, physiosData]) => {

        setPatients(patientsData);
        setPhysios(physiosData);

      })
      .catch(console.error);

  }, []);


  const assign = async (
    patientId: number
  ) => {

    const physioId =
      selectedPhysio[patientId];

    if (!physioId) {
      setMessage(
        "Please select a physiotherapist."
      );
      return;
    }

    try {

      const result =
        await assignPatient(
          patientId,
          physioId
        );

      setMessage(
        result.message
      );

    } catch (error: any) {

      setMessage(
        error?.response?.data?.detail ||
        "Assignment failed."
      );

    }
  };


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
        Assign Patients
      </Typography>


      {message && (
        <Alert sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}


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
              mb={2}
            >
              {patient.email}
            </Typography>


            <Box
              sx={{
                display: "flex",
                gap: 2
              }}
            >

              <Select
                size="small"
                value={
                  selectedPhysio[patient.id] || ""
                }
                displayEmpty
                onChange={(e) =>
                  setSelectedPhysio({
                    ...selectedPhysio,
                    [patient.id]:
                      Number(e.target.value)
                  })
                }
              >

                <MenuItem value="">
                  Select Physiotherapist
                </MenuItem>

                {physios.map((physio) => (

                  <MenuItem
                    key={physio.id}
                    value={physio.id}
                  >
                    {physio.name}
                  </MenuItem>

                ))}

              </Select>


              <Button
                variant="contained"
                onClick={() =>
                  assign(patient.id)
                }
              >
                Assign
              </Button>

            </Box>

          </CardContent>

        </Card>

      ))}

    </Box>
  );
}