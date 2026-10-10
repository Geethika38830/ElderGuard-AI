import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert
} from "@mui/material";

import {
  useEffect,
  useState
} from "react";

import {
  getPatientProfile,
  getConversation,
  sendMessage
} from "../../services/api";


export default function PatientChat() {

  const [profile, setProfile] =
    useState<any>(null);

  const [messages, setMessages] =
    useState<any[]>([]);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");


  const loadChat = async () => {

    try {

      const profileData =
        await getPatientProfile();

      setProfile(profileData);

      if (
        profileData?.patient
          ?.subscription_plan !== "plus"
      ) {
        return;
      }

      const physio =
        profileData.physiotherapist;

      if (!physio) {
        return;
      }

      const chat =
        await getConversation(
          physio.id
        );

      setMessages(chat);

    } catch (err: any) {

      setError(
        err?.response?.data?.detail ||
        err.message ||
        "Unable to load chat."
      );

    }
  };


  useEffect(() => {
    loadChat();
  }, []);


  const send = async () => {

    if (!message.trim()) {
      return;
    }

    const physio =
      profile?.physiotherapist;

    if (!physio) {
      return;
    }

    try {

      await sendMessage(
        physio.id,
        message
      );

      setMessage("");

      await loadChat();

    } catch (err: any) {

      setError(
        err?.response?.data?.detail ||
        "Unable to send message."
      );

    }
  };


  if (
    profile?.patient
      ?.subscription_plan !== "plus"
  ) {

    return (
      <Box
        sx={{
          maxWidth: 800,
          mx: "auto",
          p: 4
        }}
      >

        <Alert severity="info">
          Patient Plus is required to use
          physiotherapist chat.
        </Alert>

      </Box>
    );
  }


  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        p: { xs: 2, md: 4 }
      }}
    >

      <Typography
        variant="h4"
        fontWeight={800}
        mb={3}
      >
        Physiotherapist Chat
      </Typography>


      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      )}


      <Card>

        <CardContent>

          {profile?.physiotherapist ? (

            <Typography
              fontWeight={700}
              mb={2}
            >
              Chat with{" "}
              {profile.physiotherapist.name}
            </Typography>

          ) : (

            <Alert severity="info">
              No physiotherapist has been assigned
              to your account yet.
            </Alert>

          )}


          <Box
            sx={{
              minHeight: 300,
              maxHeight: 450,
              overflowY: "auto",
              mb: 2,
              p: 2,
              backgroundColor: "#f5f7fa",
              borderRadius: 2
            }}
          >

            {messages.map((item) => (

              <Box
                key={item.id}
                sx={{
                  mb: 2,
                  textAlign:
                    item.sender_id ===
                    profile?.patient?.id
                      ? "right"
                      : "left"
                }}
              >

                <Typography
                  component="span"
                  sx={{
                    display: "inline-block",
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor:
                      item.sender_id ===
                      profile?.patient?.id
                        ? "#1976d2"
                        : "#e0e0e0",
                    color:
                      item.sender_id ===
                      profile?.patient?.id
                        ? "white"
                        : "black",
                    maxWidth: "75%"
                  }}
                >
                  {item.message}
                </Typography>

              </Box>

            ))}

          </Box>


          {profile?.physiotherapist && (

            <Box
              sx={{
                display: "flex",
                gap: 1
              }}
            >

              <TextField
                fullWidth
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                placeholder="Type your message..."
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey
                  ) {
                    e.preventDefault();
                    send();
                  }
                }}
              />

              <Button
                variant="contained"
                onClick={send}
              >
                Send
              </Button>

            </Box>

          )}

        </CardContent>

      </Card>

    </Box>
  );
}