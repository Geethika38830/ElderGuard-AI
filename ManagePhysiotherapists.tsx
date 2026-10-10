import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Divider
} from "@mui/material";

import {
  useEffect,
  useState
} from "react";

import {
  getAdminPhysiotherapists,
  createPhysiotherapist
} from "../../services/api";


export default function ManagePhysiotherapists() {

  const [data, setData] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [creating, setCreating] =
    useState(false);

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // =====================================================
  // LOAD PHYSIOTHERAPISTS
  // =====================================================

  const loadPhysiotherapists = async () => {

    try {

      setLoading(true);

      const result =
        await getAdminPhysiotherapists();

      setData(result || []);

    } catch (error) {

      console.error(
        error
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    loadPhysiotherapists();

  }, []);


  // =====================================================
  // CREATE PHYSIOTHERAPIST
  // =====================================================

  const handleCreate = async () => {

    setError("");
    setSuccess("");

    const cleanName =
      name.trim();

    const cleanEmail =
      email.trim().toLowerCase();

    const cleanPassword =
      password.trim();


    if (!cleanName) {

      setError(
        "Please enter the physiotherapist name."
      );

      return;
    }


    if (!cleanEmail) {

      setError(
        "Please enter the physiotherapist email."
      );

      return;
    }


    if (cleanPassword.length < 6) {

      setError(
        "Password must contain at least 6 characters."
      );

      return;
    }


    try {

      setCreating(true);

      const result =
        await createPhysiotherapist(
          cleanName,
          cleanEmail,
          cleanPassword
        );


      if (result?.success) {

        setSuccess(
          "Physiotherapist account created successfully."
        );

        setName("");
        setEmail("");
        setPassword("");

        await loadPhysiotherapists();

      } else {

        setError(
          "Unable to create physiotherapist."
        );

      }

    } catch (error: any) {

      console.error(
        "Create physiotherapist error:",
        error
      );

      setError(
        error?.response?.data?.detail ||
        "Unable to create physiotherapist."
      );

    } finally {

      setCreating(false);

    }
  };


  // =====================================================
  // LOADING
  // =====================================================

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


  // =====================================================
  // UI
  // =====================================================

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
        Physiotherapists
      </Typography>


      {/* =================================================
          CREATE PHYSIOTHERAPIST
      ================================================= */}

      <Card
        sx={{
          mb: 4,
          borderRadius: 3
        }}
      >

        <CardContent>

          <Typography
            variant="h6"
            fontWeight={800}
            mb={1}
          >
            Add New Physiotherapist
          </Typography>

          <Typography
            color="text.secondary"
            mb={3}
          >
            Create a physiotherapist account that can
            later be assigned to patients.
          </Typography>


          {error && (

            <Alert
              severity="error"
              sx={{ mb: 2 }}
            >
              {error}
            </Alert>

          )}


          {success && (

            <Alert
              severity="success"
              sx={{ mb: 2 }}
            >
              {success}
            </Alert>

          )}


          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr"
              },
              gap: 2
            }}
          >

            <TextField
              label="Physiotherapist Name"
              placeholder="e.g. Dr. Priya"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              fullWidth
            />


            <TextField
              label="Email"
              type="email"
              placeholder="doctor@example.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              fullWidth
            />


            <TextField
              label="Password"
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              fullWidth
            />

          </Box>


          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={creating}
            sx={{
              mt: 3,
              px: 4,
              py: 1.2,
              borderRadius: 2,
              fontWeight: 700
            }}
          >

            {creating
              ? "CREATING..."
              : "CREATE PHYSIOTHERAPIST"}

          </Button>

        </CardContent>

      </Card>


      {/* =================================================
          EXISTING PHYSIOTHERAPISTS
      ================================================= */}

      <Typography
        variant="h6"
        fontWeight={800}
        mb={2}
      >
        Registered Physiotherapists
      </Typography>


      {data.length === 0 ? (

        <Card>

          <CardContent>

            <Typography
              color="text.secondary"
            >
              No physiotherapists have been added yet.
            </Typography>

          </CardContent>

        </Card>

      ) : (

        data.map((item) => (

          <Card
            key={item.id}
            sx={{
              mb: 2,
              borderRadius: 3
            }}
          >

            <CardContent>

              <Typography
                variant="h6"
                fontWeight={800}
              >
                {item.name}
              </Typography>

              <Typography
                color="text.secondary"
              >
                {item.email}
              </Typography>

              <Divider
                sx={{ my: 1.5 }}
              />

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Role: Physiotherapist
              </Typography>

            </CardContent>

          </Card>

        ))

      )}

    </Box>
  );
}