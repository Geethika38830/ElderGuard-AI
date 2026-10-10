import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from "@mui/material";

import {
  CheckCircle,
  Warning,
  ArrowBack,
  Shield,
  TipsAndUpdates,
  DirectionsWalk,
  AccessibilityNew,
  FitnessCenter,
  MonitorHeart,
  Balance,
  ReportProblem
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import { generateReport } from "../utils/generateReport";


export default function PredictionResult() {

  const navigate = useNavigate();

  const stored =
    localStorage.getItem("latestPrediction");

  const result =
    stored
      ? JSON.parse(stored)
      : null;


  // =========================
  // NO RESULT
  // =========================

  if (!result) {

    return (

      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f6f8fb",
          p: 3
        }}
      >

        <Card
          sx={{
            maxWidth: 500,
            width: "100%",
            textAlign: "center",
            p: 5,
            borderRadius: 4
          }}
        >

          <Shield
            sx={{
              fontSize: 60,
              color: "#1976d2",
              mb: 2
            }}
          />

          <Typography
            variant="h5"
            fontWeight={800}
            mb={1}
          >
            No Assessment Available
          </Typography>

          <Typography
            color="text.secondary"
            mb={3}
          >
            Complete a fall-risk assessment
            to view the prediction.
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() =>
              navigate("/assessment")
            }
          >
            Start Assessment
          </Button>

        </Card>

      </Box>

    );

  }


  // =========================
  // RISK VALUES
  // =========================

  const score =
    Number(result.risk_score);

  const level =
    result.risk_level;

  const isHigh =
    level === "High";

  const isModerate =
    level === "Moderate";

  const isLow =
    level === "Low";


  const riskColor =
    isHigh
      ? "#dc2626"
      : isModerate
      ? "#d97706"
      : "#16a34a";


  const riskLight =
    isHigh
      ? "#fee2e2"
      : isModerate
      ? "#fef3c7"
      : "#dcfce7";


  const riskText =
    isHigh
      ? "Higher fall-risk screening result"
      : isModerate
      ? "Moderate fall-risk screening result"
      : "Lower fall-risk screening result";


  // ==================================================
  // PHYSIOTHERAPY FUNCTIONAL ASSESSMENT
  // ==================================================

  const getConcernLevel = (
    value: number | undefined,
    type:
      | "balance"
      | "mobility"
      | "walking"
      | "weakness"
  ) => {

    if (
      value === undefined ||
      value === null
    ) {

      return {
        label: "Not Available",
        color: "#64748b",
        background: "#f8fafc"
      };

    }


    // BALANCE

    if (type === "balance") {

      if (value <= 2) {

        return {
          label: "High Concern",
          color: "#dc2626",
          background: "#fee2e2"
        };

      }

      if (value === 3) {

        return {
          label: "Moderate Concern",
          color: "#d97706",
          background: "#fef3c7"
        };

      }

      return {
        label: "Good",
        color: "#16a34a",
        background: "#dcfce7"
      };

    }


    // MOBILITY

    if (type === "mobility") {

      if (value <= 2) {

        return {
          label: "High Concern",
          color: "#dc2626",
          background: "#fee2e2"
        };

      }

      if (value === 3) {

        return {
          label: "Moderate Concern",
          color: "#d97706",
          background: "#fef3c7"
        };

      }

      return {
        label: "Good",
        color: "#16a34a",
        background: "#dcfce7"
      };

    }


    // WALKING / GAIT

    if (type === "walking") {

      if (value <= 2) {

        return {
          label: "High Concern",
          color: "#dc2626",
          background: "#fee2e2"
        };

      }

      if (value === 3) {

        return {
          label: "Moderate Concern",
          color: "#d97706",
          background: "#fef3c7"
        };

      }

      return {
        label: "Good",
        color: "#16a34a",
        background: "#dcfce7"
      };

    }


    // WEAKNESS

    if (value >= 4) {

      return {
        label: "High Concern",
        color: "#dc2626",
        background: "#fee2e2"
      };

    }

    if (value >= 3) {

      return {
        label: "Moderate Concern",
        color: "#d97706",
        background: "#fef3c7"
      };

    }

    return {
      label: "Good",
      color: "#16a34a",
      background: "#dcfce7"
    };

  };


  const balanceStatus =
    getConcernLevel(
      result.balance,
      "balance"
    );


  const mobilityStatus =
    getConcernLevel(
      result.mobility,
      "mobility"
    );


  const walkingStatus =
    getConcernLevel(
      result.walking_difficulty,
      "walking"
    );


  const weaknessStatus =
    getConcernLevel(
      result.weakness,
      "weakness"
    );


  // =========================
  // ACTIVITY STATUS
  // =========================

  const activityStatus =
    result.daily_steps !== undefined

      ? result.daily_steps < 3000

        ? {
            label: "Low Activity",
            color: "#dc2626",
            background: "#fee2e2"
          }

        : result.daily_steps < 6000

        ? {
            label: "Moderate Activity",
            color: "#d97706",
            background: "#fef3c7"
          }

        : {
            label: "Good Activity",
            color: "#16a34a",
            background: "#dcfce7"
          }

      : {
          label: "Not Available",
          color: "#64748b",
          background: "#f8fafc"
        };


  // =========================
  // FALL HISTORY
  // =========================

  const fallHistoryStatus =
    Number(result.previous_falls || 0) > 0

      ? {
          label: "Attention Required",
          color: "#dc2626",
          background: "#fee2e2"
        }

      : {
          label: "No Previous Falls",
          color: "#16a34a",
          background: "#dcfce7"
        };


  return (

    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        background: "#f6f8fb",
        p: {
          xs: 2,
          md: 4
        }
      }}
    >

      {/* =========================
          PAGE HEADER
      ========================= */}

      <Box
        sx={{
          maxWidth: 1100,
          mx: "auto",
          mb: 4
        }}
      >

        <Button
          startIcon={<ArrowBack />}
          onClick={() =>
            navigate("/assessment")
          }
          sx={{
            mb: 2,
            textTransform: "none",
            fontWeight: 600
          }}
        >
          Back to Assessment
        </Button>


        <Typography
          variant="h4"
          fontWeight={800}
          color="#172033"
        >
          Fall Risk Assessment Result
        </Typography>


        <Typography
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          Fall-risk screening and
          decision-support summary
        </Typography>

      </Box>


      {/* =========================
          MAIN RESULT CARD
      ========================= */}

      <Card
        sx={{
          maxWidth: 1100,
          mx: "auto",
          borderRadius: 4,
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          boxShadow:
            "0 8px 30px rgba(15,23,42,0.07)"
        }}
      >

        {/* =========================
            RESULT HEADER
        ========================= */}

        <Box
          sx={{
            background:
              `linear-gradient(135deg, ${riskLight}, #ffffff)`,

            p: {
              xs: 3,
              md: 5
            },

            display: "flex",

            flexDirection: {
              xs: "column",
              md: "row"
            },

            alignItems: "center",
            gap: 5
          }}
        >

          {/* SCORE CIRCLE */}

          <Box
            sx={{
              width: {
                xs: 190,
                md: 220
              },

              height: {
                xs: 190,
                md: 220
              },

              borderRadius: "50%",

              border:
                `12px solid ${riskLight}`,

              outline:
                `4px solid ${riskColor}`,

              display: "flex",

              flexDirection: "column",

              alignItems: "center",

              justifyContent: "center",

              flexShrink: 0,

              background: "#fff"
            }}
          >

            <Typography
              variant="h1"
              sx={{
                fontSize: {
                  xs: "3.5rem",
                  md: "4.5rem"
                },

                fontWeight: 900,
                lineHeight: 1,
                color: riskColor
              }}
            >
              {score}%
            </Typography>


            <Typography
              color="text.secondary"
              fontWeight={600}
              sx={{ mt: 1 }}
            >
              Risk Score
            </Typography>

          </Box>


          {/* SUMMARY */}

          <Box
            sx={{
              textAlign: {
                xs: "center",
                md: "left"
              }
            }}
          >

            <Typography
              variant="overline"
              color="text.secondary"
              fontWeight={700}
            >
              SCREENING RESULT
            </Typography>


            <Typography
              variant="h3"
              fontWeight={900}
              sx={{
                color: riskColor,
                mb: 1
              }}
            >
              {level} Risk
            </Typography>


            <Typography
              color="text.secondary"
              sx={{
                maxWidth: 500,
                fontSize: "1rem"
              }}
            >
              {riskText}. The result is
              generated from the health and
              activity information provided
              during the assessment.
            </Typography>


            <Chip
              icon={
                isHigh
                  ? <Warning />
                  : <CheckCircle />
              }

              label={
                isHigh
                  ? "Attention Recommended"
                  : isModerate
                  ? "Continue Monitoring"
                  : "Maintain Healthy Habits"
              }

              sx={{
                mt: 2,
                fontWeight: 700,
                color: riskColor,
                backgroundColor: riskLight
              }}
            />

          </Box>

        </Box>


        {/* =========================
            CONTENT
        ========================= */}

        <Box
          sx={{
            p: {
              xs: 3,
              md: 5
            }
          }}
        >

          {/* =========================
              PATIENT SUMMARY
          ========================= */}

          {(result.elderly_name ||
            result.age ||
            result.gender) && (

            <>

              <Box sx={{ mb: 4 }}>

                <Typography
                  variant="h6"
                  fontWeight={800}
                  mb={2}
                >
                  Patient Summary
                </Typography>


                <Box
                  sx={{
                    display: "grid",

                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(3, 1fr)"
                    },

                    gap: 2
                  }}
                >

                  {/* PATIENT */}

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background: "#f8fafc",
                      border:
                        "1px solid #e5e7eb"
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
                      {result.elderly_name ||
                        "—"}
                    </Typography>

                  </Box>


                  {/* AGE */}

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background: "#f8fafc",
                      border:
                        "1px solid #e5e7eb"
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
                      {result.age || "—"}
                    </Typography>

                  </Box>


                  {/* GENDER */}

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background: "#f8fafc",
                      border:
                        "1px solid #e5e7eb"
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
                      {result.gender || "—"}
                    </Typography>

                  </Box>

                </Box>

              </Box>

              <Divider />

            </>

          )}


          {/* =========================
              RISK FACTORS
          ========================= */}

          <Box
            sx={{
              mb: 4,
              mt: 4
            }}
          >

            <Typography
              variant="h6"
              fontWeight={800}
              mb={0.5}
            >
              Contributing Risk Factors
            </Typography>


            <Typography
              variant="body2"
              color="text.secondary"
              mb={2}
            >
              Factors identified by the
              screening engine.
            </Typography>


            {result.risk_factors?.length > 0 ? (

              <Box
                sx={{
                  display: "grid",

                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)"
                  },

                  gap: 1.5
                }}
              >

                {result.risk_factors.map(
                  (
                    factor: string,
                    index: number
                  ) => (

                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        p: 2,
                        borderRadius: 2,

                        background:
                          isHigh
                            ? "#fff7f7"
                            : "#f8fafc",

                        border:
                          "1px solid #e5e7eb"
                      }}
                    >

                      <Warning
                        sx={{
                          color: riskColor,
                          fontSize: 22
                        }}
                      />

                      <Typography
                        fontWeight={600}
                      >
                        {factor}
                      </Typography>

                    </Box>

                  )
                )}

              </Box>

            ) : (

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: "#f0fdf4"
                }}
              >

                <Typography
                  color="#15803d"
                  fontWeight={600}
                >
                  No major risk factors
                  identified.
                </Typography>

              </Box>

            )}

          </Box>


          <Divider />


          {/* ==================================================
              NEW: PHYSIOTHERAPY FUNCTIONAL PROFILE
          ================================================== */}

          <Box sx={{ my: 4 }}>

            {/* SECTION HEADER */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 0.5
              }}
            >

              <AccessibilityNew
                sx={{
                  color: "#7c3aed",
                  fontSize: 30
                }}
              />

              <Typography
                variant="h6"
                fontWeight={800}
              >
                Physiotherapy Functional Profile
              </Typography>

            </Box>


            <Typography
              variant="body2"
              color="text.secondary"
              mb={2.5}
            >
              Functional areas identified from
              the screening assessment that may
              require physiotherapy-focused
              attention.
            </Typography>


            {/* FUNCTIONAL CARDS */}

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)"
                },

                gap: 2
              }}
            >

              {/* BALANCE */}

              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  background:
                    balanceStatus.background,
                  border:
                    "1px solid #e5e7eb"
                }}
              >

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 1.5
                  }}
                >

                  <Balance
                    sx={{
                      color:
                        balanceStatus.color,
                      fontSize: 28
                    }}
                  />

                  <Typography fontWeight={700}>
                    Balance
                  </Typography>

                </Box>


                <Typography
                  fontWeight={800}
                  sx={{
                    color:
                      balanceStatus.color
                  }}
                >
                  {balanceStatus.label}
                </Typography>


                {result.balance !== undefined && (

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Assessment level:{" "}
                    {result.balance}/5
                  </Typography>

                )}

              </Box>


              {/* MOBILITY */}

              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  background:
                    mobilityStatus.background,
                  border:
                    "1px solid #e5e7eb"
                }}
              >

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 1.5
                  }}
                >

                  <AccessibilityNew
                    sx={{
                      color:
                        mobilityStatus.color,
                      fontSize: 28
                    }}
                  />

                  <Typography fontWeight={700}>
                    Mobility
                  </Typography>

                </Box>


                <Typography
                  fontWeight={800}
                  sx={{
                    color:
                      mobilityStatus.color
                  }}
                >
                  {mobilityStatus.label}
                </Typography>


                {result.mobility !== undefined && (

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Assessment level:{" "}
                    {result.mobility}/5
                  </Typography>

                )}

              </Box>


              {/* GAIT / WALKING */}

              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  background:
                    walkingStatus.background,
                  border:
                    "1px solid #e5e7eb"
                }}
              >

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 1.5
                  }}
                >

                  <DirectionsWalk
                    sx={{
                      color:
                        walkingStatus.color,
                      fontSize: 28
                    }}
                  />

                  <Typography fontWeight={700}>
                    Gait / Walking
                  </Typography>

                </Box>


                <Typography
                  fontWeight={800}
                  sx={{
                    color:
                      walkingStatus.color
                  }}
                >
                  {walkingStatus.label}
                </Typography>


                {result.walking_difficulty !== undefined && (

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Assessment level:{" "}
                    {result.walking_difficulty}/5
                  </Typography>

                )}

              </Box>


              {/* LOWER-LIMB STRENGTH */}

              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  background:
                    weaknessStatus.background,
                  border:
                    "1px solid #e5e7eb"
                }}
              >

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 1.5
                  }}
                >

                  <FitnessCenter
                    sx={{
                      color:
                        weaknessStatus.color,
                      fontSize: 28
                    }}
                  />

                  <Typography fontWeight={700}>
                    Lower-Limb Strength
                  </Typography>

                </Box>


                <Typography
                  fontWeight={800}
                  sx={{
                    color:
                      weaknessStatus.color
                  }}
                >
                  {weaknessStatus.label}
                </Typography>


                {result.weakness !== undefined && (

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Assessment level:{" "}
                    {result.weakness}/5
                  </Typography>

                )}

              </Box>


              {/* PHYSICAL ACTIVITY */}

              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  background:
                    activityStatus.background,
                  border:
                    "1px solid #e5e7eb"
                }}
              >

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 1.5
                  }}
                >

                  <MonitorHeart
                    sx={{
                      color:
                        activityStatus.color,
                      fontSize: 28
                    }}
                  />

                  <Typography fontWeight={700}>
                    Physical Activity
                  </Typography>

                </Box>


                <Typography
                  fontWeight={800}
                  sx={{
                    color:
                      activityStatus.color
                  }}
                >
                  {activityStatus.label}
                </Typography>


                {result.daily_steps !== undefined && (

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Daily steps:{" "}
                    {result.daily_steps}
                  </Typography>

                )}

              </Box>


              {/* FALL HISTORY */}

              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  background:
                    fallHistoryStatus.background,
                  border:
                    "1px solid #e5e7eb"
                }}
              >

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 1.5
                  }}
                >

                  <ReportProblem
                    sx={{
                      color:
                        fallHistoryStatus.color,
                      fontSize: 28
                    }}
                  />

                  <Typography fontWeight={700}>
                    Fall History
                  </Typography>

                </Box>


                <Typography
                  fontWeight={800}
                  sx={{
                    color:
                      fallHistoryStatus.color
                  }}
                >
                  {fallHistoryStatus.label}
                </Typography>


                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Previous falls:{" "}
                  {result.previous_falls || 0}
                </Typography>

              </Box>

            </Box>


            {/* =========================
                PHYSIOTHERAPY FOCUS
            ========================= */}

            <Box
              sx={{
                mt: 3,
                p: 3,
                borderRadius: 3,

                background:
                  "linear-gradient(135deg, #f5f3ff, #ffffff)",

                border:
                  "1px solid #ddd6fe"
              }}
            >

              <Typography
                fontWeight={800}
                sx={{
                  color: "#5b21b6",
                  mb: 1.5
                }}
              >
                🧑‍⚕️ Suggested Physiotherapy Focus
              </Typography>


              <List sx={{ p: 0 }}>

                {/* BALANCE */}

                {result.balance !== undefined &&
                  Number(result.balance) <= 2 && (

                    <ListItem
                      sx={{
                        px: 0,
                        py: 0.5
                      }}
                    >

                      <ListItemIcon
                        sx={{
                          minWidth: 32
                        }}
                      >

                        <CheckCircle
                          sx={{
                            color: "#7c3aed",
                            fontSize: 20
                          }}
                        />

                      </ListItemIcon>


                      <ListItemText
                        primary={
                          "Balance and stability training"
                        }

                        primaryTypographyProps={{
                          fontWeight: 600
                        }}
                      />

                    </ListItem>

                  )}


                {/* MOBILITY */}

                {result.mobility !== undefined &&
                  Number(result.mobility) <= 2 && (

                    <ListItem
                      sx={{
                        px: 0,
                        py: 0.5
                      }}
                    >

                      <ListItemIcon
                        sx={{
                          minWidth: 32
                        }}
                      >

                        <CheckCircle
                          sx={{
                            color: "#7c3aed",
                            fontSize: 20
                          }}
                        />

                      </ListItemIcon>


                      <ListItemText
                        primary={
                          "Functional mobility assessment and training"
                        }

                        primaryTypographyProps={{
                          fontWeight: 600
                        }}
                      />

                    </ListItem>

                  )}


                {/* GAIT */}

                {result.walking_difficulty !== undefined &&
                  Number(result.walking_difficulty) <= 2 && (

                    <ListItem
                      sx={{
                        px: 0,
                        py: 0.5
                      }}
                    >

                      <ListItemIcon
                        sx={{
                          minWidth: 32
                        }}
                      >

                        <CheckCircle
                          sx={{
                            color: "#7c3aed",
                            fontSize: 20
                          }}
                        />

                      </ListItemIcon>


                      <ListItemText
                        primary={
                          "Gait and walking assessment"
                        }

                        primaryTypographyProps={{
                          fontWeight: 600
                        }}
                      />

                    </ListItem>

                  )}


                {/* LOWER LIMB STRENGTH */}

                {result.weakness !== undefined &&
                  Number(result.weakness) >= 3 && (

                    <ListItem
                      sx={{
                        px: 0,
                        py: 0.5
                      }}
                    >

                      <ListItemIcon
                        sx={{
                          minWidth: 32
                        }}
                      >

                        <CheckCircle
                          sx={{
                            color: "#7c3aed",
                            fontSize: 20
                          }}
                        />

                      </ListItemIcon>


                      <ListItemText
                        primary={
                          "Lower-limb strengthening and functional exercise"
                        }

                        primaryTypographyProps={{
                          fontWeight: 600
                        }}
                      />

                    </ListItem>

                  )}


                {/* PREVIOUS FALLS */}

                {Number(result.previous_falls || 0) > 0 && (

                  <ListItem
                    sx={{
                      px: 0,
                      py: 0.5
                    }}
                  >

                    <ListItemIcon
                      sx={{
                        minWidth: 32
                      }}
                    >

                      <CheckCircle
                        sx={{
                          color: "#7c3aed",
                          fontSize: 20
                        }}
                      />

                    </ListItemIcon>


                    <ListItemText
                      primary={
                        "Fall-prevention and functional safety assessment"
                      }

                      primaryTypographyProps={{
                        fontWeight: 600
                      }}
                    />

                  </ListItem>

                )}


                {/* LOW ACTIVITY */}

                {result.daily_steps !== undefined &&
                  Number(result.daily_steps) < 3000 && (

                    <ListItem
                      sx={{
                        px: 0,
                        py: 0.5
                      }}
                    >

                      <ListItemIcon
                        sx={{
                          minWidth: 32
                        }}
                      >

                        <CheckCircle
                          sx={{
                            color: "#7c3aed",
                            fontSize: 20
                          }}
                        />

                      </ListItemIcon>


                      <ListItemText
                        primary={
                          "Gradual functional activity progression"
                        }

                        primaryTypographyProps={{
                          fontWeight: 600
                        }}
                      />

                    </ListItem>

                  )}


                {/* NO MAJOR FUNCTIONAL CONCERN */}

                {result.balance !== undefined &&
                  result.mobility !== undefined &&
                  result.walking_difficulty !== undefined &&
                  result.weakness !== undefined &&
                  Number(result.balance) > 2 &&
                  Number(result.mobility) > 2 &&
                  Number(result.walking_difficulty) > 2 &&
                  Number(result.weakness) < 3 &&
                  Number(result.previous_falls || 0) === 0 && (

                    <ListItem
                      sx={{
                        px: 0,
                        py: 0.5
                      }}
                    >

                      <ListItemIcon
                        sx={{
                          minWidth: 32
                        }}
                      >

                        <CheckCircle
                          sx={{
                            color: "#16a34a",
                            fontSize: 20
                          }}
                        />

                      </ListItemIcon>


                      <ListItemText
                        primary={
                          "Continue maintaining functional mobility, balance and safe physical activity"
                        }

                        primaryTypographyProps={{
                          fontWeight: 600
                        }}
                      />

                    </ListItem>

                  )}

              </List>


              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: "block",
                  mt: 2,
                  lineHeight: 1.6
                }}
              >
                These insights are screening-oriented
                and are intended to help identify areas
                that may benefit from further assessment
                by a qualified physiotherapist. They do
                not constitute a physiotherapy diagnosis
                or exercise prescription.
              </Typography>

            </Box>

          </Box>


          <Divider />


          {/* =========================
              RECOMMENDATIONS
          ========================= */}

          <Box sx={{ my: 4 }}>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 0.5
              }}
            >

              <TipsAndUpdates
                sx={{
                  color: "#1976d2"
                }}
              />

              <Typography
                variant="h6"
                fontWeight={800}
              >
                Personalized Recommendations
              </Typography>

            </Box>


            <Typography
              variant="body2"
              color="text.secondary"
              mb={2}
            >
              Suggested preventive actions
              based on the screening result.
            </Typography>


            <List
              sx={{
                background: "#f8fafc",
                borderRadius: 3,
                p: 1
              }}
            >

              {result.recommendations?.map(
                (
                  recommendation: string,
                  index: number
                ) => (

                  <ListItem
                    key={index}
                    sx={{
                      alignItems: "flex-start"
                    }}
                  >

                    <ListItemIcon
                      sx={{
                        minWidth: 34,
                        mt: 0.5
                      }}
                    >

                      <CheckCircle
                        sx={{
                          color: "#16a34a",
                          fontSize: 20
                        }}
                      />

                    </ListItemIcon>


                    <ListItemText
                      primary={
                        recommendation
                      }

                      primaryTypographyProps={{
                        fontWeight: 500,
                        lineHeight: 1.6
                      }}
                    />

                  </ListItem>

                )
              )}

            </List>

          </Box>


          {/* =========================
              HIGH RISK ALERT
          ========================= */}

          {isHigh && (

            <Alert
              severity="warning"
              sx={{
                mb: 3,
                borderRadius: 2
              }}
            >

              <strong>
                Elevated fall-risk screening
                result.
              </strong>{" "}

              Consider appropriate preventive
              measures and discuss the result
              with a healthcare professional or
              caregiver where appropriate.

            </Alert>

          )}


          {/* =========================
              DISCLAIMER
          ========================= */}

          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              background: "#eff6ff",
              border:
                "1px solid #dbeafe",
              mb: 3
            }}
          >

            <Typography
              variant="body2"
              color="#1e40af"
              fontWeight={600}
            >
              Important:
            </Typography>


            <Typography
              variant="body2"
              color="#475569"
              sx={{ mt: 0.5 }}
            >
              This application provides
              fall-risk screening and
              decision support. It is not a
              medical diagnosis and should not
              replace professional medical
              advice.
            </Typography>

          </Box>


          {/* =========================
              ACTIONS
          ========================= */}

          <Box
            sx={{
              display: "flex",
              gap: 2,

              flexDirection: {
                xs: "column",
                sm: "row"
              },

              flexWrap: "wrap"
            }}
          >

            {/* PDF REPORT */}

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() =>
                generateReport(result)
              }
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontWeight: 700,
                flex: 1
              }}
            >
              📄 Download Assessment Report
            </Button>


            {/* NEW ASSESSMENT */}

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() =>
                navigate("/assessment")
              }
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontWeight: 700,
                flex: 1
              }}
            >
              New Assessment
            </Button>


            {/* HISTORY */}

            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={() =>
                navigate("/history")
              }
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontWeight: 700,
                flex: 1
              }}
            >
              View History
            </Button>

          </Box>

        </Box>

      </Card>

    </Box>

  );

}