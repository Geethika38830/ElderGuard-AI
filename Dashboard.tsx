import {
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Typography,
  Stack
} from "@mui/material";

import {
  Person,
  AssessmentOutlined,
  WarningAmber,
  ErrorOutline,
  CheckCircleOutline,
  History,
  AddCircleOutline
} from "@mui/icons-material";

import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import HealthCard from "../components/HealthCard";
import RiskCard from "../components/RiskCard";
import RiskChart from "../components/RiskChart";

import {
  getHistory
} from "../services/api";


interface AssessmentRecord {
  id: number;
  elderly_name: string;
  age: number;
  gender: string;

  height: number;
  weight: number;

  daily_steps: number;
  exercise_days: number;

  mobility: number;
  balance: number;
  walking_difficulty: number;

  previous_falls: number;
  near_falls: number;

  dizziness: number;
  weakness: number;

  medication_risk: boolean;

  activity_level: string;

  risk_score: number;
  risk_level: string;

  risk_factors: string[];
  recommendations: string[];

  created_at: string;
}


export default function Dashboard() {

  const navigate = useNavigate();

  const [
    history,
    setHistory
  ] = useState<AssessmentRecord[]>([]);

  const [
    loading,
    setLoading
  ] = useState(true);


  useEffect(() => {
    loadData();
  }, []);


  const loadData = async () => {

    try {

      setLoading(true);

      const records =
        await getHistory();

      setHistory(records);

    } catch (error) {

      console.error(
        "Dashboard loading error:",
        error
      );

    } finally {

      setLoading(false);

    }
  };


  /* =========================
     SUMMARY VALUES
  ========================= */

  const totalAssessments =
    history.length;

  const highRisk =
    history.filter(
      item =>
        item.risk_level === "High"
    ).length;

  const moderateRisk =
    history.filter(
      item =>
        item.risk_level === "Moderate"
    ).length;

  const lowRisk =
    history.filter(
      item =>
        item.risk_level === "Low"
    ).length;


  const latest =
    history.length > 0
      ? history[0]
      : null;


  /* =========================
     LOADING
  ========================= */

  if (loading) {

    return (
      <Box
        sx={{
          minHeight:
            "calc(100vh - 64px)",

          display: "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          background:
            "linear-gradient(135deg,#f5f9ff,#eef5fb)"
        }}
      >

        <Typography
          color="text.secondary"
          fontWeight={600}
        >
          Loading health dashboard...
        </Typography>

      </Box>
    );
  }


  return (
    <Box
      sx={{
        minHeight:
          "calc(100vh - 64px)",

        background:
          "linear-gradient(135deg,#f5f9ff 0%,#f8fafc 50%,#eef6ff 100%)",

        p: {
          xs: 2,
          sm: 3,
          md: 4
        }
      }}
    >

      {/* =========================
          HEADER
      ========================= */}

      <Box
        sx={{
          mb: 4,

          display: "flex",

          justifyContent:
            "space-between",

          alignItems: {
            xs: "flex-start",
            md: "center"
          },

          flexDirection: {
            xs: "column",
            md: "row"
          },

          gap: 2
        }}
      >

        <Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#172033",
              mb: 0.5
            }}
          >
            Health Dashboard
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              fontSize: "0.98rem"
            }}
          >
            Elderly fall-risk screening
            and health monitoring
          </Typography>

        </Box>


        <Button
          variant="contained"
          startIcon={
            <AddCircleOutline />
          }
          onClick={() =>
            navigate("/assessment")
          }
          sx={{
            borderRadius: 2.5,
            px: 3,
            py: 1.2,
            fontWeight: 700,
            textTransform: "none",
            boxShadow:
              "0 6px 18px rgba(25,118,210,0.25)"
          }}
        >
          New Assessment
        </Button>

      </Box>


      {/* =========================
          SUMMARY CARDS
      ========================= */}

      <Grid
        container
        spacing={3}
      >

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3
          }}
        >
          <HealthCard
            title="Total Assessments"
            value={totalAssessments}
            subtitle="Completed screenings"
          />
        </Grid>


        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3
          }}
        >
          <HealthCard
            title="Low Risk"
            value={lowRisk}
            subtitle="Low-risk profiles"
          />
        </Grid>


        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3
          }}
        >
          <HealthCard
            title="Moderate Risk"
            value={moderateRisk}
            subtitle="Cases requiring monitoring"
          />
        </Grid>


        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3
          }}
        >
          <HealthCard
            title="High Risk"
            value={highRisk}
            subtitle="Cases requiring attention"
          />
        </Grid>

      </Grid>


      {/* =========================
          LATEST RISK
      ========================= */}

      {latest && (

        <Box sx={{ mt: 3 }}>

          <RiskCard
            level={
              latest.risk_level
            }
            score={
              latest.risk_score
            }
          />

        </Box>

      )}


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <Grid
        container
        spacing={3}
        sx={{ mt: 0 }}
      >

        {/* RISK TREND */}

        <Grid
          size={{
            xs: 12,
            md: 8
          }}
        >

          <Paper
            elevation={0}
            sx={{
              p: {
                xs: 2,
                md: 3
              },

              height: "100%",

              borderRadius: 4,

              border:
                "1px solid #e3e8ef",

              background:
                "rgba(255,255,255,0.92)"
            }}
          >

            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
                mb: 2
              }}
            >

              <Box>

                <Typography
                  variant="h6"
                  fontWeight={800}
                >
                  Risk Trend
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Fall-risk scores across
                  assessments
                </Typography>

              </Box>


              <Chip
                icon={
                  <AssessmentOutlined />
                }
                label={`${history.length} assessments`}
                size="small"
                variant="outlined"
              />

            </Box>


            {history.length > 0 ? (

              <RiskChart
                data={history}
              />

            ) : (

              <Box
                sx={{
                  height: 250,

                  display: "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  textAlign: "center"
                }}
              >

                <Box>

                  <AssessmentOutlined
                    sx={{
                      fontSize: 45,
                      color: "#94a3b8",
                      mb: 1
                    }}
                  />

                  <Typography
                    fontWeight={700}
                    sx={{ mb: 1 }}
                  >
                    No assessment data yet
                  </Typography>

                  <Typography
                    color="text.secondary"
                    variant="body2"
                  >
                    Complete an assessment
                    to generate your risk
                    trend.
                  </Typography>

                </Box>

              </Box>

            )}

          </Paper>

        </Grid>


        {/* QUICK ACTIONS */}

        <Grid
          size={{
            xs: 12,
            md: 4
          }}
        >

          <Paper
            elevation={0}
            sx={{
              p: 3,

              height: "100%",

              borderRadius: 4,

              border:
                "1px solid #e3e8ef",

              background:
                "rgba(255,255,255,0.92)"
            }}
          >

            <Typography
              variant="h6"
              fontWeight={800}
              sx={{ mb: 0.5 }}
            >
              Quick Actions
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Manage elderly health
              assessments
            </Typography>


            <Button
              fullWidth
              variant="contained"
              startIcon={
                <AddCircleOutline />
              }
              onClick={() =>
                navigate("/assessment")
              }
              sx={{
                mb: 2,
                py: 1.3,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700
              }}
            >
              Start New Assessment
            </Button>


            <Button
              fullWidth
              variant="outlined"
              startIcon={
                <History />
              }
              onClick={() =>
                navigate("/history")
              }
              sx={{
                py: 1.3,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700
              }}
            >
              View Assessment History
            </Button>

          </Paper>

        </Grid>

      </Grid>


      {/* =========================
          LATEST PATIENT
      ========================= */}

      {latest && (

        <Paper
          elevation={0}
          sx={{
            mt: 3,

            p: {
              xs: 2.5,
              md: 3
            },

            borderRadius: 4,

            border:
              "1px solid #e3e8ef",

            background:
              "rgba(255,255,255,0.92)"
          }}
        >

          <Box
            sx={{
              display: "flex",

              justifyContent:
                "space-between",

              alignItems: {
                xs: "flex-start",
                sm: "center"
              },

              flexDirection: {
                xs: "column",
                sm: "row"
              },

              gap: 2
            }}
          >

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2
              }}
            >

              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: 3,

                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",

                  backgroundColor:
                    "#e3f2fd",

                  color:
                    "#1976d2"
                }}
              >
                <Person />
              </Box>


              <Box>

                <Typography
                  variant="h6"
                  fontWeight={800}
                >
                  Latest Assessment
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Most recent screening
                  result
                </Typography>

              </Box>

            </Box>


            <Chip
              label={`${latest.risk_score}% · ${latest.risk_level} Risk`}
              color={
                latest.risk_level ===
                "High"
                  ? "error"
                  : latest.risk_level ===
                    "Moderate"
                  ? "warning"
                  : "success"
              }
              sx={{
                fontWeight: 700
              }}
            />

          </Box>


          <Grid
            container
            spacing={2}
            sx={{ mt: 2 }}
          >

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3
              }}
            >

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  backgroundColor:
                    "#f8fafc"
                }}
              >

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Patient
                </Typography>

                <Typography
                  fontWeight={700}
                  sx={{ mt: 0.5 }}
                >
                  {latest.elderly_name}
                </Typography>

              </Box>

            </Grid>


            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3
              }}
            >

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  backgroundColor:
                    "#f8fafc"
                }}
              >

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Age
                </Typography>

                <Typography
                  fontWeight={700}
                  sx={{ mt: 0.5 }}
                >
                  {latest.age} years
                </Typography>

              </Box>

            </Grid>


            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3
              }}
            >

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  backgroundColor:
                    "#f8fafc"
                }}
              >

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Gender
                </Typography>

                <Typography
                  fontWeight={700}
                  sx={{ mt: 0.5 }}
                >
                  {latest.gender}
                </Typography>

              </Box>

            </Grid>


            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3
              }}
            >

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  backgroundColor:
                    "#f8fafc"
                }}
              >

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Activity
                </Typography>

                <Typography
                  fontWeight={700}
                  sx={{
                    mt: 0.5,
                    textTransform:
                      "capitalize"
                  }}
                >
                  {latest.activity_level}
                </Typography>

              </Box>

            </Grid>

          </Grid>


          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1
            }}
          >

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Assessed on{" "}
              {new Date(
                latest.created_at
              ).toLocaleDateString(
                "en-IN"
              )}
            </Typography>


            <Button
              size="small"
              onClick={() =>
                navigate("/history")
              }
              sx={{
                textTransform: "none",
                fontWeight: 700
              }}
            >
              View Full History →
            </Button>

          </Box>

        </Paper>

      )}


      {/* =========================
          RISK STATUS GUIDE
      ========================= */}

      <Paper
        elevation={0}
        sx={{
          mt: 3,
          p: 3,
          borderRadius: 4,
          border:
            "1px solid #e3e8ef",
          background:
            "rgba(255,255,255,0.92)"
        }}
      >

        <Typography
          variant="h6"
          fontWeight={800}
          sx={{ mb: 2 }}
        >
          Risk Level Guide
        </Typography>


        <Grid
          container
          spacing={2}
        >

          <Grid
            size={{
              xs: 12,
              md: 4
            }}
          >

            <Box
              sx={{
                p: 2,
                borderRadius: 2.5,
                backgroundColor:
                  "#e8f5e9"
              }}
            >

              <Box
                sx={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: 1,
                  mb: 0.5
                }}
              >

                <CheckCircleOutline
                  color="success"
                />

                <Typography
                  fontWeight={800}
                  color="success.dark"
                >
                  Low Risk
                </Typography>

              </Box>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                0–30: Continue healthy
                activity and regular
                monitoring.
              </Typography>

            </Box>

          </Grid>


          <Grid
            size={{
              xs: 12,
              md: 4
            }}
          >

            <Box
              sx={{
                p: 2,
                borderRadius: 2.5,
                backgroundColor:
                  "#fff3e0"
              }}
            >

              <Box
                sx={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: 1,
                  mb: 0.5
                }}
              >

                <WarningAmber
                  color="warning"
                />

                <Typography
                  fontWeight={800}
                  color="warning.dark"
                >
                  Moderate Risk
                </Typography>

              </Box>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                31–60: Preventive measures
                and continued monitoring
                are recommended.
              </Typography>

            </Box>

          </Grid>


          <Grid
            size={{
              xs: 12,
              md: 4
            }}
          >

            <Box
              sx={{
                p: 2,
                borderRadius: 2.5,
                backgroundColor:
                  "#ffebee"
              }}
            >

              <Box
                sx={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: 1,
                  mb: 0.5
                }}
              >

                <ErrorOutline
                  color="error"
                />

                <Typography
                  fontWeight={800}
                  color="error.dark"
                >
                  High Risk
                </Typography>

              </Box>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                61–100: Additional
                preventive support may
                be appropriate.
              </Typography>

            </Box>

          </Grid>

        </Grid>

      </Paper>


      {/* =========================
          DISCLAIMER
      ========================= */}

      <Box
        sx={{
          mt: 4,
          textAlign: "center"
        }}
      >

        <Typography
          variant="caption"
          color="text.secondary"
        >
          This system provides fall-risk
          screening and decision support.
          It is not a medical diagnosis.
        </Typography>

      </Box>

    </Box>
  );
}