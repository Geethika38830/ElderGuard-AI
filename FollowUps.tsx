import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Button,
  TextField,
  MenuItem,
  Divider,
  Alert
} from "@mui/material";

import {
  useEffect,
  useState
} from "react";

import API, {
  getFollowUps,
  getAssignedPatients,
  getCurrentUser
} from "../../services/api";


interface Patient {
  id: number;
  name: string;
  email: string;
}


interface FollowUp {
  id: number;
  patient_id: number;
  patient_name: string;
  title: string;
  notes: string;
  status: string;
  followup_date: string | null;
  created_at: string;
}


export default function FollowUps() {

  const [followups, setFollowups] =
    useState<FollowUp[]>([]);

  const [patients, setPatients] =
    useState<Patient[]>([]);

  const [selectedPatient, setSelectedPatient] =
    useState("");

  const [title, setTitle] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  /* =====================================================
     LOAD DATA
  ===================================================== */

  useEffect(() => {

    loadData();

  }, []);


  async function loadData() {

    try {

      setLoading(true);
      setError("");

      const [
        followupData,
        patientData
      ] = await Promise.all([
        getFollowUps(),
        getAssignedPatients()
      ]);


      setFollowups(
        followupData
      );


      const formattedPatients =
        patientData.map((item: any) => ({

          id:
            item.patient_id ??
            item.id,

          name:
            item.patient_name ??
            item.name ??
            "Patient",

          email:
            item.patient_email ??
            item.email ??
            ""

        }));


      setPatients(
        formattedPatients
      );


      if (
        formattedPatients.length > 0
      ) {

        setSelectedPatient(
          String(
            formattedPatients[0].id
          )
        );

      }

    } catch (err) {

      console.error(
        "Failed to load follow-ups:",
        err
      );

      setError(
        "Unable to load follow-up information."
      );

    } finally {

      setLoading(false);

    }
  }


  /* =====================================================
     CREATE FOLLOW-UP
  ===================================================== */

  async function createFollowUp() {

    const user =
      getCurrentUser();

    if (!user) {
      setError(
        "Please log in again."
      );
      return;
    }


    if (!selectedPatient) {

      setError(
        "Please select a patient."
      );

      return;
    }


    if (!title.trim()) {

      setError(
        "Follow-up title is required."
      );

      return;
    }


    try {

      setSaving(true);
      setError("");
      setSuccess("");


      await API.post(
        "/api/physiotherapist/followups",
        null,
        {
          params: {

            physiotherapist_id:
              user.id,

            patient_id:
              Number(
                selectedPatient
              ),

            title:
              title.trim(),

            notes:
              notes.trim()

          }
        }
      );


      setTitle("");
      setNotes("");


      setSuccess(
        "Follow-up created successfully."
      );


      const updated =
        await getFollowUps();

      setFollowups(
        updated
      );

    } catch (err: any) {

      console.error(
        "Failed to create follow-up:",
        err
      );

      setError(
        err?.response?.data?.detail ||
        "Unable to create follow-up."
      );

    } finally {

      setSaving(false);

    }
  }


  /* =====================================================
     LOADING
  ===================================================== */

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


  /* =====================================================
     PAGE
  ===================================================== */

  return (

    <Box
      sx={{
        maxWidth: 1100,
        mx: "auto",
        p: {
          xs: 2,
          md: 4
        }
      }}
    >

      <Typography
        variant="h4"
        fontWeight={800}
        mb={1}
      >
        Follow-ups
      </Typography>


      <Typography
        color="text.secondary"
        mb={4}
      >
        Manage patient follow-up activities and clinical notes.
      </Typography>


      {error && (

        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>

      )}


      {success && (

        <Alert
          severity="success"
          sx={{ mb: 2 }}
          onClose={() => setSuccess("")}
        >
          {success}
        </Alert>

      )}


      {/* =================================================
          CREATE FOLLOW-UP
      ================================================= */}

      <Card
        sx={{
          mb: 4
        }}
      >

        <CardContent>

          <Typography
            variant="h6"
            fontWeight={800}
            mb={3}
          >
            Create New Follow-up
          </Typography>


          {patients.length === 0 ? (

            <Alert severity="info">
              No assigned patients are available.
            </Alert>

          ) : (

            <Box
              sx={{
                display: "grid",
                gap: 2
              }}
            >

              <TextField
                select
                fullWidth
                label="Select Patient"
                value={selectedPatient}
                onChange={(event) =>
                  setSelectedPatient(
                    event.target.value
                  )
                }
              >

                {patients.map(
                  (patient) => (

                    <MenuItem
                      key={patient.id}
                      value={patient.id}
                    >
                      {patient.name}
                      {patient.email
                        ? ` — ${patient.email}`
                        : ""}
                    </MenuItem>

                  )
                )}

              </TextField>


              <TextField
                fullWidth
                label="Follow-up Title"
                placeholder="Example: Balance training review"
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
              />


              <TextField
                fullWidth
                multiline
                minRows={4}
                label="Notes"
                placeholder="Enter follow-up notes..."
                value={notes}
                onChange={(event) =>
                  setNotes(
                    event.target.value
                  )
                }
              />


              <Box>

                <Button
                  variant="contained"
                  onClick={
                    createFollowUp
                  }
                  disabled={
                    saving ||
                    patients.length === 0
                  }
                  sx={{
                    px: 3
                  }}
                >
                  {saving
                    ? "Creating..."
                    : "CREATE FOLLOW-UP"}
                </Button>

              </Box>

            </Box>

          )}

        </CardContent>

      </Card>


      {/* =================================================
          EXISTING FOLLOW-UPS
      ================================================= */}

      <Typography
        variant="h6"
        fontWeight={800}
        mb={2}
      >
        Existing Follow-ups
      </Typography>


      {followups.length === 0 ? (

        <Card>

          <CardContent>

            <Typography
              color="text.secondary"
            >
              No follow-ups have been created yet.
            </Typography>

          </CardContent>

        </Card>

      ) : (

        followups.map(
          (item) => (

            <Card
              key={item.id}
              sx={{
                mb: 2
              }}
            >

              <CardContent>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: {
                      xs: "flex-start",
                      sm: "center"
                    },
                    gap: 2,
                    flexDirection: {
                      xs: "column",
                      sm: "row"
                    }
                  }}
                >

                  <Box>

                    <Typography
                      variant="h6"
                      fontWeight={800}
                    >
                      {item.title}
                    </Typography>


                    <Typography
                      sx={{
                        mt: 0.5
                      }}
                    >
                      Patient:{" "}
                      <strong>
                        {item.patient_name}
                      </strong>
                    </Typography>

                  </Box>


                  <Chip
                    label={
                      item.status
                        ?.toUpperCase() ||
                      "PENDING"
                    }
                    color={
                      item.status ===
                      "completed"
                        ? "success"
                        : "warning"
                    }
                  />

                </Box>


                <Divider
                  sx={{
                    my: 2
                  }}
                />


                <Typography
                  color="text.secondary"
                >
                  {item.notes ||
                    "No notes added."}
                </Typography>


                {item.followup_date && (

                  <Typography
                    variant="body2"
                    sx={{
                      mt: 2
                    }}
                  >
                    Follow-up date:{" "}
                    {new Date(
                      item.followup_date
                    ).toLocaleString()}
                  </Typography>

                )}


                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  sx={{
                    mt: 2
                  }}
                >
                  Created:{" "}
                  {new Date(
                    item.created_at
                  ).toLocaleString()}
                </Typography>

              </CardContent>

            </Card>

          )
        )

      )}

    </Box>

  );
}