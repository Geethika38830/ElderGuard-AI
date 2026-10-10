import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Chip
} from "@mui/material";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  getCurrentUser
} from "../services/api";


export default function Navbar() {

  const navigate = useNavigate();
  const location = useLocation();

  const user = getCurrentUser();


  /* =====================================================
     ROLE HOME
  ===================================================== */

  const getHomePath = () => {

    if (user?.role === "admin") {
      return "/admin";
    }

    if (user?.role === "physiotherapist") {
      return "/physiotherapist";
    }

    return "/dashboard";
  };


  /* =====================================================
     LOGOUT
  ===================================================== */

  const logout = () => {

    localStorage.removeItem("user");
    localStorage.removeItem("latestPrediction");

    navigate(
      "/login",
      {
        replace: true
      }
    );
  };


  /* =====================================================
     ACTIVE ROUTE
  ===================================================== */

  const isActive = (
    path: string
  ) => {

    return (
      location.pathname === path ||
      location.pathname.startsWith(
        `${path}/`
      )
    );
  };


  /* =====================================================
     BUTTON STYLE
  ===================================================== */

  const navButtonStyle = (
    path: string
  ) => ({

    borderRadius: 2,

    px: {
      xs: 1,
      sm: 1.5
    },

    fontWeight:
      isActive(path)
        ? 700
        : 500,

    backgroundColor:
      isActive(path)
        ? "rgba(255,255,255,0.16)"
        : "transparent",

    "&:hover": {
      backgroundColor:
        "rgba(255,255,255,0.10)"
    }

  });


  /* =====================================================
     PATIENT NAVIGATION
  ===================================================== */

  const patientNavigation = [

    {
      label: "Dashboard",
      path: "/dashboard"
    },

    {
      label: "Assessment",
      path: "/assessment"
    },

    {
      label: "Progress",
      path: "/patient/progress"
    },

    {
      label: "History",
      path: "/history"
    },

    {
      label: "Physiotherapist",
      path: "/patient/chat"
    },

    {
      label: "Patient Plus",
      path: "/patient/subscription"
    }

  ];


  /* =====================================================
     PHYSIOTHERAPIST NAVIGATION
  ===================================================== */

  const physiotherapistNavigation = [

    {
      label: "Dashboard",
      path: "/physiotherapist"
    },

    {
      label: "My Patients",
      path: "/physiotherapist/patients"
    },

    {
      label: "Risk Monitoring",
      path: "/physiotherapist/risk-monitoring"
    },

    {
      label: "Follow-ups",
      path: "/physiotherapist/followups"
    },

    {
      label: "Messages",
      path: "/physiotherapist/messages"
    }

  ];


  /* =====================================================
     ADMIN NAVIGATION
  ===================================================== */

  const adminNavigation = [

    {
      label: "Dashboard",
      path: "/admin"
    },

    {
      label: "Users",
      path: "/admin/users"
    },

    {
      label: "Patients",
      path: "/admin/patients"
    },

    {
      label: "Physiotherapists",
      path: "/admin/physiotherapists"
    },

    {
      label: "Assignments",
      path: "/admin/assignments"
    },

    {
      label: "Subscriptions",
      path: "/admin/subscriptions"
    }

  ];


  /* =====================================================
     SELECT NAVIGATION
  ===================================================== */

  let navigation =
    patientNavigation;


  if (
    user?.role ===
    "physiotherapist"
  ) {

    navigation =
      physiotherapistNavigation;

  }


  if (
    user?.role ===
    "admin"
  ) {

    navigation =
      adminNavigation;

  }


  /* =====================================================
     ROLE LABEL
  ===================================================== */

  const roleLabel =
    user?.role === "admin"
      ? "Admin"
      : user?.role === "physiotherapist"
      ? "Physiotherapist"
      : "Patient";


  /* =====================================================
     PLUS STATUS
  ===================================================== */

  const showPlus =
    user?.role === "patient" &&
    user?.subscription_plan === "plus" &&
    user?.subscription_status === "active";


  /* =====================================================
     RENDER
  ===================================================== */

  return (

    <AppBar
      position="static"
      elevation={0}
      sx={{
        background:
          "linear-gradient(90deg, #1565c0, #1976d2)"
      }}
    >

      <Toolbar
        sx={{
          minHeight: "64px",

          px: {
            xs: 1.5,
            sm: 3,
            md: 4
          },

          gap: 1
        }}
      >

        {/* =================================================
            BRAND
        ================================================= */}

        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,

            fontWeight: 800,

            letterSpacing:
              "0.3px",

            cursor:
              "pointer",

            whiteSpace:
              "nowrap"
          }}

          onClick={() =>
            navigate(
              getHomePath()
            )
          }
        >
          ElderCare AI
        </Typography>


        {/* =================================================
            ROLE / PLUS
        ================================================= */}

        {user && (

          <Box
            sx={{
              display: {
                xs: "none",
                md: "flex"
              },

              alignItems:
                "center",

              gap: 0.7,

              mr: 1
            }}
          >

            <Chip
              label={roleLabel}
              size="small"
              sx={{
                color: "#fff",

                backgroundColor:
                  "rgba(255,255,255,0.12)",

                fontWeight: 600
              }}
            />


            {showPlus && (

              <Chip
                label="PLUS"
                size="small"
                sx={{
                  color: "#fff",

                  backgroundColor:
                    "rgba(255,193,7,0.25)",

                  fontWeight: 800
                }}
              />

            )}

          </Box>

        )}


        {/* =================================================
            NAVIGATION
        ================================================= */}

        <Box
          sx={{
            display:
              "flex",

            alignItems:
              "center",

            gap: {
              xs: 0,
              sm: 0.3
            },

            overflowX:
              "auto",

            "&::-webkit-scrollbar": {
              display: "none"
            }
          }}
        >

          {navigation.map(
            (item) => (

              <Button
                key={item.path}
                color="inherit"

                onClick={() =>
                  navigate(
                    item.path
                  )
                }

                sx={
                  navButtonStyle(
                    item.path
                  )
                }
              >
                {item.label}
              </Button>

            )
          )}


          {/* =================================================
              LOGOUT
          ================================================= */}

          <Button
            color="inherit"

            onClick={
              logout
            }

            sx={{
              borderRadius: 2,

              px: {
                xs: 1,
                sm: 1.5
              },

              ml: 0.5,

              fontWeight: 500,

              "&:hover": {
                backgroundColor:
                  "rgba(255,255,255,0.10)"
              }
            }}
          >
            Logout
          </Button>

        </Box>

      </Toolbar>

    </AppBar>
  );
}