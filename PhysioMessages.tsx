import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  List,
  ListItemButton,
  Divider,
  Chip,
  CircularProgress
} from "@mui/material";

import {
  useEffect,
  useState
} from "react";

import API, {
  getCurrentUser,
  getAssignedPatients
} from "../../services/api";


interface Patient {
  id: number;
  name: string;
  email: string;
}


interface ChatMessage {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  created_at: string;
  read_status?: string;
}


export default function PhysioMessages() {

  const [patients, setPatients] =
    useState<Patient[]>([]);

  const [selectedPatient, setSelectedPatient] =
    useState<Patient | null>(null);

  const [messages, setMessages] =
    useState<ChatMessage[]>([]);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [loadingMessages, setLoadingMessages] =
    useState(false);

  const [sending, setSending] =
    useState(false);


  /* =====================================================
     LOAD ASSIGNED PATIENTS
  ===================================================== */

  useEffect(() => {

    loadPatients();

  }, []);


  async function loadPatients() {

    try {

      setLoading(true);

      const result =
        await getAssignedPatients();

      const formattedPatients =
        result.map((item: any) => ({

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
          formattedPatients[0]
        );

      }

    } catch (error) {

      console.error(
        "Failed to load patients:",
        error
      );

    } finally {

      setLoading(false);

    }
  }


  /* =====================================================
     LOAD CONVERSATION
  ===================================================== */

  useEffect(() => {

    if (!selectedPatient) {
      return;
    }

    loadConversation(
      selectedPatient.id
    );

  }, [selectedPatient]);


  async function loadConversation(
    patientId: number
  ) {

    const user =
      getCurrentUser();

    if (!user) {
      return;
    }

    try {

      setLoadingMessages(true);

      const response =
        await API.get(
          "/api/chat/conversation",
          {
            params: {

              patient_id:
                patientId,

              physiotherapist_id:
                user.id

            }
          }
        );

      setMessages(
        response.data
      );

    } catch (error) {

      console.error(
        "Failed to load conversation:",
        error
      );

      setMessages([]);

    } finally {

      setLoadingMessages(false);

    }
  }


  /* =====================================================
     SEND MESSAGE
  ===================================================== */

  async function handleSend() {

    const user =
      getCurrentUser();

    if (!user) {
      return;
    }

    if (!selectedPatient) {
      return;
    }

    if (!message.trim()) {
      return;
    }

    try {

      setSending(true);

      await API.post(
        "/api/chat/send",
        null,
        {
          params: {

            sender_id:
              user.id,

            receiver_id:
              selectedPatient.id,

            message:
              message.trim()

          }
        }
      );

      setMessage("");

      await loadConversation(
        selectedPatient.id
      );

    } catch (error: any) {

      console.error(
        "Failed to send message:",
        error
      );

      alert(
        error?.response?.data?.detail ||
        "Unable to send message."
      );

    } finally {

      setSending(false);

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
          mt: 10
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
        maxWidth: 1200,
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
        Messages
      </Typography>


      <Typography
        color="text.secondary"
        mb={4}
      >
        Communicate securely with your assigned patients.
      </Typography>


      {patients.length === 0 ? (

        <Card>

          <CardContent>

            <Typography
              color="text.secondary"
            >
              No patients are currently assigned to you.
            </Typography>

          </CardContent>

        </Card>

      ) : (

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "280px 1fr"
            },
            gap: 2
          }}
        >

          {/* =================================================
              PATIENT LIST
          ================================================= */}

          <Card>

            <CardContent
              sx={{
                p: 1
              }}
            >

              <Typography
                fontWeight={800}
                sx={{
                  px: 2,
                  py: 1.5
                }}
              >
                My Patients
              </Typography>


              <Divider />


              <List
                disablePadding
              >

                {patients.map(
                  (patient) => (

                    <ListItemButton
                      key={patient.id}
                      selected={
                        selectedPatient?.id ===
                        patient.id
                      }
                      onClick={() =>
                        setSelectedPatient(
                          patient
                        )
                      }
                      sx={{
                        borderRadius: 2,
                        mx: 0.5,
                        my: 0.5
                      }}
                    >

                      <Box>

                        <Typography
                          fontWeight={700}
                        >
                          {patient.name}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {patient.email}
                        </Typography>

                      </Box>

                    </ListItemButton>

                  )
                )}

              </List>

            </CardContent>

          </Card>


          {/* =================================================
              CHAT WINDOW
          ================================================= */}

          <Card>

            <CardContent>

              {selectedPatient && (

                <>

                  {/* CHAT HEADER */}

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                      mb: 2
                    }}
                  >

                    <Box>

                      <Typography
                        variant="h6"
                        fontWeight={800}
                      >
                        {selectedPatient.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {selectedPatient.email}
                      </Typography>

                    </Box>


                    <Chip
                      label="Assigned Patient"
                      color="primary"
                      variant="outlined"
                    />

                  </Box>


                  <Divider />


                  {/* MESSAGE AREA */}

                  <Box
                    sx={{
                      height: 420,
                      overflowY: "auto",
                      backgroundColor:
                        "#f5f7fa",
                      borderRadius: 2,
                      p: 2,
                      mt: 2,
                      mb: 2
                    }}
                  >

                    {loadingMessages ? (

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent:
                            "center",
                          mt: 10
                        }}
                      >

                        <CircularProgress
                          size={28}
                        />

                      </Box>

                    ) : messages.length === 0 ? (

                      <Typography
                        color="text.secondary"
                        textAlign="center"
                        sx={{
                          mt: 10
                        }}
                      >
                        No messages yet.
                      </Typography>

                    ) : (

                      messages.map(
                        (item) => {

                          const user =
                            getCurrentUser();

                          const isMine =
                            item.sender_id ===
                            user?.id;

                          return (

                            <Box
                              key={item.id}
                              sx={{
                                display: "flex",
                                justifyContent:
                                  isMine
                                    ? "flex-end"
                                    : "flex-start",
                                mb: 1.5
                              }}
                            >

                              <Box
                                sx={{
                                  maxWidth:
                                    "75%",
                                  backgroundColor:
                                    isMine
                                      ? "#1976d2"
                                      : "#ffffff",
                                  color:
                                    isMine
                                      ? "#ffffff"
                                      : "#222",
                                  borderRadius: 2,
                                  px: 2,
                                  py: 1.2,
                                  boxShadow:
                                    "0 1px 3px rgba(0,0,0,0.12)"
                                }}
                              >

                                <Typography>
                                  {item.message}
                                </Typography>

                                <Typography
                                  variant="caption"
                                  sx={{
                                    display:
                                      "block",
                                    mt: 0.5,
                                    opacity: 0.7
                                  }}
                                >
                                  {new Date(
                                    item.created_at
                                  ).toLocaleString()}
                                </Typography>

                              </Box>

                            </Box>

                          );

                        }
                      )

                    )}

                  </Box>


                  {/* MESSAGE INPUT */}

                  <Box
                    sx={{
                      display: "flex",
                      gap: 1
                    }}
                  >

                    <TextField
                      fullWidth
                      placeholder="Type your reply..."
                      value={message}
                      onChange={(event) =>
                        setMessage(
                          event.target.value
                        )
                      }
                      onKeyDown={(event) => {

                        if (
                          event.key ===
                          "Enter"
                        ) {

                          event.preventDefault();

                          handleSend();

                        }

                      }}
                    />


                    <Button
                      variant="contained"
                      onClick={handleSend}
                      disabled={
                        sending ||
                        !message.trim()
                      }
                      sx={{
                        px: 3
                      }}
                    >
                      {sending
                        ? "Sending..."
                        : "SEND"}
                    </Button>

                  </Box>

                </>

              )}

            </CardContent>

          </Card>

        </Box>

      )}

    </Box>

  );
}