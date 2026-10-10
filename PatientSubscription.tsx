import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Alert
} from "@mui/material";

import {
  useEffect,
  useState
} from "react";

import {
  getSubscriptionStatus,
  activatePlus,
  cancelSubscription,
  getCurrentUser
} from "../../services/api";


export default function PatientSubscription() {

  const [subscription, setSubscription] =
    useState<any>(null);

  const [message, setMessage] =
    useState("");


  const load = async () => {

    try {

      const result =
        await getSubscriptionStatus();

      setSubscription(result);

    } catch (error) {

      console.error(error);

    }
  };


  useEffect(() => {
    load();
  }, []);


  const activate = async () => {

    try {

      const result =
        await activatePlus();

      setMessage(
        result.message
      );

      const user =
        getCurrentUser();

      if (user) {

        user.subscription_plan =
          "plus";

        user.subscription_status =
          "active";

        user.subscription_expiry =
          result.subscription.expiry;

        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );

      }

      await load();

    } catch (error: any) {

      setMessage(
        error?.response?.data?.detail ||
        "Unable to activate subscription."
      );

    }
  };


  const cancel = async () => {

    try {

      const result =
        await cancelSubscription();

      setMessage(
        result.message
      );

      const user =
        getCurrentUser();

      if (user) {

        user.subscription_plan =
          "free";

        user.subscription_status =
          "inactive";

        user.subscription_expiry =
          null;

        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );

      }

      await load();

    } catch (error: any) {

      setMessage(
        error?.response?.data?.detail ||
        "Unable to cancel subscription."
      );

    }
  };


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
        Patient Plus
      </Typography>


      {message && (
        <Alert
          severity="info"
          sx={{ mb: 3 }}
        >
          {message}
        </Alert>
      )}


      <Card>

        <CardContent>

          <Typography
            variant="h5"
            fontWeight={800}
          >
            Patient Plus
          </Typography>

          <Typography
            variant="h4"
            fontWeight={900}
            mt={2}
          >
            ₹199 / month
          </Typography>

          <Typography
            color="text.secondary"
            mt={1}
          >
            Demo subscription for the academic project.
          </Typography>


          <Box mt={3}>

            <Typography>
              ✓ Physiotherapist chat
            </Typography>

            <Typography>
              ✓ Advanced progress monitoring
            </Typography>

            <Typography>
              ✓ Detailed reports
            </Typography>

            <Typography>
              ✓ Assigned physiotherapist
            </Typography>

            <Typography>
              ✓ Follow-up monitoring
            </Typography>

          </Box>


          <Box mt={3}>

            <Chip
              label={
                subscription?.plan === "plus"
                  ? "Active"
                  : "Free Plan"
              }
              color={
                subscription?.plan === "plus"
                  ? "success"
                  : "default"
              }
            />

          </Box>


          {subscription?.plan === "plus" ? (

            <Button
              sx={{ mt: 3 }}
              variant="outlined"
              color="error"
              onClick={cancel}
            >
              Cancel Plus
            </Button>

          ) : (

            <Button
              sx={{ mt: 3 }}
              variant="contained"
              onClick={activate}
            >
              Activate Patient Plus
            </Button>

          )}

        </CardContent>

      </Card>

    </Box>
  );
}