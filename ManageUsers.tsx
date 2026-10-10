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
  getAdminUsers
} from "../../services/api";


export default function ManageUsers() {

  const [users, setUsers] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    getAdminUsers()
      .then(setUsers)
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
        Manage Users
      </Typography>


      {users.map((user) => (

        <Card
          key={user.id}
          sx={{ mb: 2 }}
        >

          <CardContent>

            <Typography
              fontWeight={800}
            >
              {user.name}
            </Typography>

            <Typography
              color="text.secondary"
            >
              {user.email}
            </Typography>

            <Box mt={2}>

              <Chip
                label={user.role}
                sx={{ mr: 1 }}
              />

              {user.role === "patient" && (
                <Chip
                  label={
                    user.subscription_plan
                  }
                  color="primary"
                />
              )}

            </Box>

          </CardContent>

        </Card>

      ))}

    </Box>
  );
}