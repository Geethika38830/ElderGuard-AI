import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  TextField,
  Alert,
  Divider,
  Link
} from "@mui/material";

import {
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  login,
  registerUser
} from "../services/api";


type AuthMode =
  | "login"
  | "register"
  | "forgot";


export default function Login() {

  const navigate = useNavigate();

  const [mode, setMode] =
    useState<AuthMode>("login");

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // =====================================================
  // CLEAR MESSAGES
  // =====================================================

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };


  // =====================================================
  // CHANGE MODE
  // =====================================================

  const changeMode = (
    newMode: AuthMode
  ) => {

    setMode(newMode);

    clearMessages();

    if (newMode === "register") {

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

    }

    if (newMode === "forgot") {

      setPassword("");
      setConfirmPassword("");

    }

    if (newMode === "login") {

      setPassword("");

    }
  };


  // =====================================================
  // ROLE BASED NAVIGATION
  // =====================================================

  const navigateByRole = (
    role: string
  ) => {

    if (role === "admin") {

      navigate(
        "/admin",
        { replace: true }
      );

      return;
    }


    if (
      role === "physiotherapist"
    ) {

      navigate(
        "/physiotherapist",
        { replace: true }
      );

      return;
    }


    navigate(
      "/dashboard",
      { replace: true }
    );
  };


  // =====================================================
  // LOGIN
  // =====================================================

  const handleLogin = async () => {

    clearMessages();

    if (
      !email.trim() ||
      !password.trim()
    ) {

      setError(
        "Please enter email and password."
      );

      return;
    }

    try {

      setLoading(true);

      const result =
        await login(
          email.trim().toLowerCase(),
          password
        );


      if (result?.success) {

        const loggedInUser =
          result.user;


        // Store complete user
        localStorage.setItem(
          "user",
          JSON.stringify(
            loggedInUser
          )
        );


        // Role-based redirect
        navigateByRole(
          loggedInUser.role
        );

      } else {

        setError(
          "Invalid email or password."
        );

      }

    } catch (error: any) {

      console.error(
        "Login error:",
        error
      );

      setError(
        error?.response?.data?.detail ||
        "Invalid email or password."
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // REGISTER
  // =====================================================

  const handleRegister = async () => {

    clearMessages();

    const registeredName =
      name.trim();

    const registeredEmail =
      email.trim().toLowerCase();


    if (
      !registeredName ||
      !registeredEmail ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {

      setError(
        "Please fill in all fields."
      );

      return;
    }


    if (password.length < 6) {

      setError(
        "Password must contain at least 6 characters."
      );

      return;
    }


    if (
      password !==
      confirmPassword
    ) {

      setError(
        "Passwords do not match."
      );

      return;
    }


    try {

      setLoading(true);

      const result =
        await registerUser(
          registeredName,
          registeredEmail,
          password
        );


      if (result?.success) {

        setEmail(
          registeredEmail
        );

        setName("");
        setPassword("");
        setConfirmPassword("");

        setSuccess(
          "Account created successfully. Your email is ready for sign in."
        );

        setMode("login");

      } else {

        setError(
          result?.message ||
          "Registration failed."
        );

      }

    } catch (error: any) {

      console.error(
        "Registration error:",
        error
      );

      setError(
        error?.response?.data?.detail ||
        "Unable to create account."
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // FORGOT PASSWORD
  // =====================================================

  const handleForgotPassword = () => {

    clearMessages();

    if (!email.trim()) {

      setError(
        "Please enter your registered email address."
      );

      return;
    }


    setSuccess(
      "Password reset request received. Please contact the administrator for the demo reset process."
    );
  };


  // =====================================================
  // ENTER KEY
  // =====================================================

  const handleEnter = (
    event: React.KeyboardEvent
  ) => {

    if (
      event.key !==
      "Enter"
    ) {
      return;
    }


    if (
      mode === "login"
    ) {

      handleLogin();

    } else if (
      mode === "register"
    ) {

      handleRegister();

    } else {

      handleForgotPassword();

    }
  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg,#e3f2fd 0%,#f5f7fa 55%,#e8f5e9 100%)",
        px: 2,
        py: 4
      }}
    >

      <Card
        elevation={8}
        sx={{
          width: "100%",
          maxWidth: 440,
          borderRadius: 5
        }}
      >

        <CardContent
          sx={{
            p: {
              xs: 4,
              sm: 5
            }
          }}
        >

          {/* BRAND */}

          <Box
            sx={{
              textAlign: "center",
              mb: 4
            }}
          >

            <Typography
              variant="h4"
              fontWeight={800}
              color="primary"
            >
              ElderCare AI
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 1
              }}
            >
              Elderly Fall-Risk Screening
              & Health Monitoring
            </Typography>

          </Box>


          {/* =================================================
              LOGIN
          ================================================= */}

          {mode === "login" && (

            <>

              <Typography
                variant="h5"
                fontWeight={800}
                sx={{
                  mb: 1
                }}
              >
                Welcome Back
              </Typography>


              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 3
                }}
              >
                Sign in to access your
                health monitoring dashboard.
              </Typography>


              {error && (

                <Alert
                  severity="error"
                  sx={{
                    mb: 2
                  }}
                >
                  {error}
                </Alert>

              )}


              {success && (

                <Alert
                  severity="success"
                  sx={{
                    mb: 2
                  }}
                >
                  {success}
                </Alert>

              )}


              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                onKeyDown={
                  handleEnter
                }
                autoComplete="email"
                sx={{
                  mb: 2
                }}
              />


              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                onKeyDown={
                  handleEnter
                }
                autoComplete="current-password"
                sx={{
                  mb: 1
                }}
              />


              <Box
                sx={{
                  textAlign: "right",
                  mb: 2
                }}
              >

                <Link
                  component="button"
                  type="button"
                  underline="hover"
                  onClick={() =>
                    changeMode(
                      "forgot"
                    )
                  }
                  sx={{
                    fontSize:
                      "0.875rem",
                    fontWeight: 600
                  }}
                >
                  Forgot Password?
                </Link>

              </Box>


              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={
                  handleLogin
                }
                disabled={
                  loading
                }
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 700
                }}
              >

                {loading
                  ? "SIGNING IN..."
                  : "SIGN IN"}

              </Button>


              <Divider
                sx={{
                  my: 3
                }}
              />


              <Typography
                textAlign="center"
                variant="body2"
                color="text.secondary"
              >
                Don't have an account?
              </Typography>


              <Button
                fullWidth
                variant="outlined"
                onClick={() =>
                  changeMode(
                    "register"
                  )
                }
                sx={{
                  mt: 1,
                  py: 1.2,
                  borderRadius: 2,
                  fontWeight: 700,
                  textTransform:
                    "none"
                }}
              >
                Create Account
              </Button>

            </>

          )}


          {/* =================================================
              REGISTER
          ================================================= */}

          {mode === "register" && (

            <>

              <Typography
                variant="h5"
                fontWeight={800}
                sx={{
                  mb: 1
                }}
              >
                Create Account
              </Typography>


              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 3
                }}
              >
                Create an account to access
                ElderCare AI.
              </Typography>


              {error && (

                <Alert
                  severity="error"
                  sx={{
                    mb: 2
                  }}
                >
                  {error}
                </Alert>

              )}


              <TextField
                fullWidth
                label="Full Name"
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
                onKeyDown={
                  handleEnter
                }
                autoComplete="name"
                sx={{
                  mb: 2
                }}
              />


              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                onKeyDown={
                  handleEnter
                }
                autoComplete="email"
                sx={{
                  mb: 2
                }}
              />


              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                onKeyDown={
                  handleEnter
                }
                helperText={
                  "Minimum 6 characters"
                }
                sx={{
                  mb: 2
                }}
              />


              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                onKeyDown={
                  handleEnter
                }
                sx={{
                  mb: 3
                }}
              />


              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={
                  handleRegister
                }
                disabled={
                  loading
                }
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 700
                }}
              >

                {loading
                  ? "CREATING ACCOUNT..."
                  : "CREATE ACCOUNT"}

              </Button>


              <Divider
                sx={{
                  my: 3
                }}
              />


              <Typography
                textAlign="center"
                variant="body2"
                color="text.secondary"
              >
                Already have an account?
              </Typography>


              <Button
                fullWidth
                variant="outlined"
                onClick={() =>
                  changeMode(
                    "login"
                  )
                }
                sx={{
                  mt: 1,
                  py: 1.2,
                  borderRadius: 2,
                  fontWeight: 700,
                  textTransform:
                    "none"
                }}
              >
                Back to Login
              </Button>

            </>

          )}


          {/* =================================================
              FORGOT PASSWORD
          ================================================= */}

          {mode === "forgot" && (

            <>

              <Typography
                variant="h5"
                fontWeight={800}
                sx={{
                  mb: 1
                }}
              >
                Forgot Password?
              </Typography>


              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 3
                }}
              >
                Enter your registered email
                address to request a password
                reset.
              </Typography>


              {error && (

                <Alert
                  severity="error"
                  sx={{
                    mb: 2
                  }}
                >
                  {error}
                </Alert>

              )}


              {success && (

                <Alert
                  severity="success"
                  sx={{
                    mb: 2
                  }}
                >
                  {success}
                </Alert>

              )}


              <TextField
                fullWidth
                label="Registered Email"
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                onKeyDown={
                  handleEnter
                }
                sx={{
                  mb: 3
                }}
              />


              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={
                  handleForgotPassword
                }
                disabled={
                  loading
                }
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 700
                }}
              >
                REQUEST PASSWORD RESET
              </Button>


              <Button
                fullWidth
                variant="text"
                onClick={() =>
                  changeMode(
                    "login"
                  )
                }
                sx={{
                  mt: 1,
                  py: 1.2,
                  textTransform:
                    "none",
                  fontWeight: 700
                }}
              >
                ← Back to Login
              </Button>

            </>

          )}


          {/* FOOTER */}

          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            textAlign="center"
            sx={{
              mt: 3
            }}
          >
            Fall-risk screening and
            decision-support system
          </Typography>

        </CardContent>

      </Card>

    </Box>
  );
}