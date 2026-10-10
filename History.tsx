import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from "@mui/material";

import {
  Person,
  Visibility,
  Close,
  WarningAmber,
  CheckCircleOutline,
  ErrorOutline
} from "@mui/icons-material";

import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  getHistory
} from "../services/api";

import {
  generateReport
} from "../utils/generateReport";


interface HistoryRecord {

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


export default function History() {

  const navigate = useNavigate();

  const [
    history,
    setHistory
  ] = useState<HistoryRecord[]>([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    selectedRecord,
    setSelectedRecord
  ] = useState<HistoryRecord | null>(null);


  useEffect(() => {

    loadHistory();

  }, []);


  const loadHistory = async () => {

    try {

      setLoading(true);

      const records =
        await getHistory();

      setHistory(records);

    } catch (error) {

      console.error(
        "History loading error:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  const getRiskColor = (
    level: string
  ) => {

    if (level === "High") {
      return "error";
    }

    if (level === "Moderate") {
      return "warning";
    }

    return "success";
  };


  const getRiskIcon = (
    level: string
  ) => {

    if (level === "High") {
      return <ErrorOutline />;
    }

    if (level === "Moderate") {
      return <WarningAmber />;
    }

    return <CheckCircleOutline />;
  };


  return (

    <Box
      sx={{
        minHeight:
          "calc(100vh - 64px)",

        background:
          "linear-gradient(135deg,#f5f9ff,#f8fafc)",

        p: {
          xs: 2,
          sm: 3,
          md: 4
        }
      }}
    >

      {/* HEADER */}

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

          gap: 2,
          mb: 4
        }}
      >

        <Box>

          <Typography
            variant="h4"
            fontWeight={800}
            sx={{
              color: "#172033",
              mb: 0.5
            }}
          >
            Assessment History
          </Typography>

          <Typography
            color="text.secondary"
          >
            Review previous fall-risk
            screening results
          </Typography>

        </Box>


        <Button
          variant="contained"
          onClick={() =>
            navigate("/assessment")
          }
          sx={{
            borderRadius: 2.5,
            px: 3,
            py: 1.2,
            textTransform: "none",
            fontWeight: 700
          }}
        >
          + New Assessment
        </Button>

      </Box>


      {/* SUMMARY */}

      <Stack
        direction={{
          xs: "column",
          sm: "row"
        }}
        spacing={2}
        sx={{ mb: 3 }}
      >

        <Paper
          elevation={0}
          sx={{
            p: 2,
            px: 3,
            borderRadius: 3,
            border:
              "1px solid #e2e8f0",
            flex: 1
          }}
        >

          <Typography
            variant="caption"
            color="text.secondary"
          >
            Total Assessments
          </Typography>

          <Typography
            variant="h5"
            fontWeight={800}
          >
            {history.length}
          </Typography>

        </Paper>


        <Paper
          elevation={0}
          sx={{
            p: 2,
            px: 3,
            borderRadius: 3,
            border:
              "1px solid #e2e8f0",
            flex: 1
          }}
        >

          <Typography
            variant="caption"
            color="text.secondary"
          >
            High Risk
          </Typography>

          <Typography
            variant="h5"
            fontWeight={800}
            color="error.main"
          >
            {
              history.filter(
                item =>
                  item.risk_level ===
                  "High"
              ).length
            }
          </Typography>

        </Paper>


        <Paper
          elevation={0}
          sx={{
            p: 2,
            px: 3,
            borderRadius: 3,
            border:
              "1px solid #e2e8f0",
            flex: 1
          }}
        >

          <Typography
            variant="caption"
            color="text.secondary"
          >
            Moderate Risk
          </Typography>

          <Typography
            variant="h5"
            fontWeight={800}
            color="warning.main"
          >
            {
              history.filter(
                item =>
                  item.risk_level ===
                  "Moderate"
              ).length
            }
          </Typography>

        </Paper>


        <Paper
          elevation={0}
          sx={{
            p: 2,
            px: 3,
            borderRadius: 3,
            border:
              "1px solid #e2e8f0",
            flex: 1
          }}
        >

          <Typography
            variant="caption"
            color="text.secondary"
          >
            Low Risk
          </Typography>

          <Typography
            variant="h5"
            fontWeight={800}
            color="success.main"
          >
            {
              history.filter(
                item =>
                  item.risk_level ===
                  "Low"
              ).length
            }
          </Typography>

        </Paper>

      </Stack>


      {/* TABLE */}

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: 4,
          border:
            "1px solid #e2e8f0",
          overflow: "auto"
        }}
      >

        <Table
          sx={{
            minWidth: 1050
          }}
        >

          <TableHead>

            <TableRow
              sx={{
                backgroundColor:
                  "#f8fafc"
              }}
            >

              <TableCell
                sx={{
                  fontWeight: 800
                }}
              >
                #
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 800
                }}
              >
                Patient
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 800
                }}
              >
                Age
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 800
                }}
              >
                Gender
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 800
                }}
              >
                Risk Score
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 800
                }}
              >
                Risk Level
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 800
                }}
              >
                Activity
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 800
                }}
              >
                Date & Time
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 800
                }}
              >
                Actions
              </TableCell>

            </TableRow>

          </TableHead>


          <TableBody>

            {loading ? (

              <TableRow>

                <TableCell
                  colSpan={9}
                  align="center"
                  sx={{
                    py: 6
                  }}
                >

                  <Typography
                    color="text.secondary"
                  >
                    Loading assessment
                    history...
                  </Typography>

                </TableCell>

              </TableRow>

            ) : history.length === 0 ? (

              <TableRow>

                <TableCell
                  colSpan={9}
                  align="center"
                  sx={{
                    py: 6
                  }}
                >

                  <Typography
                    fontWeight={700}
                    sx={{ mb: 1 }}
                  >
                    No assessments yet
                  </Typography>

                  <Typography
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Complete your first
                    assessment to see
                    results here.
                  </Typography>

                  <Button
                    variant="contained"
                    onClick={() =>
                      navigate(
                        "/assessment"
                      )
                    }
                  >
                    Start Assessment
                  </Button>

                </TableCell>

              </TableRow>

            ) : (

              history.map(
                (
                  record,
                  index
                ) => (

                  <TableRow
                    key={record.id}
                    hover
                  >

                    {/* NUMBER */}

                    <TableCell>
                      {index + 1}
                    </TableCell>


                    {/* PATIENT */}

                    <TableCell>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems:
                            "center",
                          gap: 1
                        }}
                      >

                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 2,
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

                          <Person
                            fontSize="small"
                          />

                        </Box>


                        <Typography
                          fontWeight={700}
                        >
                          {
                            record.elderly_name
                          }
                        </Typography>

                      </Box>

                    </TableCell>


                    {/* AGE */}

                    <TableCell>
                      {record.age} years
                    </TableCell>


                    {/* GENDER */}

                    <TableCell>
                      {record.gender}
                    </TableCell>


                    {/* SCORE */}

                    <TableCell>

                      <Typography
                        fontWeight={800}
                      >
                        {
                          record.risk_score
                        }%
                      </Typography>

                    </TableCell>


                    {/* RISK */}

                    <TableCell>

                      <Chip
                        icon={
                          getRiskIcon(
                            record.risk_level
                          )
                        }

                        label={
                          `${record.risk_level} Risk`
                        }

                        color={
                          getRiskColor(
                            record.risk_level
                          ) as
                            | "error"
                            | "warning"
                            | "success"
                        }

                        size="small"

                        sx={{
                          fontWeight: 700
                        }}
                      />

                    </TableCell>


                    {/* ACTIVITY */}

                    <TableCell>

                      <Typography
                        sx={{
                          textTransform:
                            "capitalize"
                        }}
                      >
                        {
                          record.activity_level
                        }
                      </Typography>

                    </TableCell>


                    {/* DATE */}

                    <TableCell>

                      <Typography
                        variant="body2"
                      >
                        {new Date(
                          record.created_at
                        ).toLocaleDateString(
                          "en-IN"
                        )}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {new Date(
                          record.created_at
                        ).toLocaleTimeString(
                          "en-IN",
                          {
                            hour:
                              "2-digit",
                            minute:
                              "2-digit"
                          }
                        )}
                      </Typography>

                    </TableCell>


                    {/* ACTIONS */}

                    <TableCell>

                      <Stack
                        direction={{
                          xs: "column",
                          sm: "row"
                        }}
                        spacing={1}
                      >

                        {/* VIEW */}

                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={
                            <Visibility />
                          }
                          onClick={() =>
                            setSelectedRecord(
                              record
                            )
                          }
                          sx={{
                            borderRadius: 2,
                            textTransform:
                              "none",
                            fontWeight: 700
                          }}
                        >
                          View
                        </Button>


                        {/* PDF REPORT */}

                        <Button
                          size="small"
                          variant="contained"
                          onClick={() =>
                            generateReport(
                              record
                            )
                          }
                          sx={{
                            borderRadius: 2,
                            textTransform:
                              "none",
                            fontWeight: 700,
                            whiteSpace:
                              "nowrap"
                          }}
                        >
                          📄 Report
                        </Button>

                      </Stack>

                    </TableCell>

                  </TableRow>

                )
              )

            )}

          </TableBody>

        </Table>

      </TableContainer>


      {/* DISCLAIMER */}

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          display: "block",
          textAlign: "center",
          mt: 3
        }}
      >
        Assessment history is provided for
        fall-risk screening and decision
        support purposes.
      </Typography>


      {/* DETAILS DIALOG */}

      <Dialog
        open={
          selectedRecord !== null
        }
        onClose={() =>
          setSelectedRecord(null)
        }
        maxWidth="md"
        fullWidth
      >

        {selectedRecord && (

          <>

            <DialogTitle
              sx={{
                fontWeight: 800,
                pb: 1
              }}
            >

              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center"
                }}
              >

                <Box>

                  <Typography
                    variant="h6"
                    fontWeight={800}
                  >
                    Assessment Details
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {
                      selectedRecord
                        .elderly_name
                    }
                  </Typography>

                </Box>


                <Button
                  onClick={() =>
                    setSelectedRecord(
                      null
                    )
                  }
                  sx={{
                    minWidth: 40,
                    width: 40,
                    height: 40,
                    borderRadius: 2
                  }}
                >
                  <Close />
                </Button>

              </Box>

            </DialogTitle>


            <DialogContent dividers>

              {/* RISK RESULT */}

              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  mb: 3,
                  borderRadius: 3,
                  background:
                    selectedRecord.risk_level ===
                    "High"
                      ? "#ffebee"
                      : selectedRecord.risk_level ===
                        "Moderate"
                        ? "#fff3e0"
                        : "#e8f5e9"
                }}
              >

                <Stack
                  direction={{
                    xs: "column",
                    sm: "row"
                  }}
                  spacing={2}
                  alignItems={{
                    xs: "flex-start",
                    sm: "center"
                  }}
                  justifyContent="space-between"
                >

                  <Box>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Fall-Risk Screening
                    </Typography>

                    <Typography
                      variant="h4"
                      fontWeight={800}
                    >
                      {
                        selectedRecord
                          .risk_score
                      }%
                    </Typography>

                  </Box>


                  <Chip
                    icon={
                      getRiskIcon(
                        selectedRecord
                          .risk_level
                      )
                    }

                    label={
                      `${selectedRecord.risk_level} Risk`
                    }

                    color={
                      getRiskColor(
                        selectedRecord
                          .risk_level
                      ) as
                        | "error"
                        | "warning"
                        | "success"
                    }

                    sx={{
                      fontWeight: 800
                    }}
                  />

                </Stack>

              </Paper>


              {/* PATIENT INFORMATION */}

              <Typography
                variant="h6"
                fontWeight={800}
                sx={{ mb: 2 }}
              >
                Patient Information
              </Typography>


              <Stack
                direction={{
                  xs: "column",
                  sm: "row"
                }}
                flexWrap="wrap"
                spacing={2}
                sx={{ mb: 3 }}
              >

                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    flex: "1 1 180px",
                    borderRadius: 2,
                    backgroundColor:
                      "#f8fafc"
                  }}
                >

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Name
                  </Typography>

                  <Typography
                    fontWeight={700}
                  >
                    {
                      selectedRecord
                        .elderly_name
                    }
                  </Typography>

                </Paper>


                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    flex: "1 1 120px",
                    borderRadius: 2,
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
                  >
                    {
                      selectedRecord.age
                    } years
                  </Typography>

                </Paper>


                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    flex: "1 1 120px",
                    borderRadius: 2,
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
                  >
                    {
                      selectedRecord
                        .gender
                    }
                  </Typography>

                </Paper>


                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    flex: "1 1 120px",
                    borderRadius: 2,
                    backgroundColor:
                      "#f8fafc"
                  }}
                >

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Height
                  </Typography>

                  <Typography
                    fontWeight={700}
                  >
                    {
                      selectedRecord.height
                    } cm
                  </Typography>

                </Paper>


                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    flex: "1 1 120px",
                    borderRadius: 2,
                    backgroundColor:
                      "#f8fafc"
                  }}
                >

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Weight
                  </Typography>

                  <Typography
                    fontWeight={700}
                  >
                    {
                      selectedRecord.weight
                    } kg
                  </Typography>

                </Paper>

              </Stack>


              <Divider sx={{ mb: 3 }} />


              {/* ACTIVITY */}

              <Typography
                variant="h6"
                fontWeight={800}
                sx={{ mb: 2 }}
              >
                Activity & Mobility
              </Typography>


              <Stack
                direction={{
                  xs: "column",
                  sm: "row"
                }}
                flexWrap="wrap"
                spacing={2}
                sx={{ mb: 3 }}
              >

                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    flex: "1 1 180px",
                    borderRadius: 2,
                    backgroundColor:
                      "#f8fafc"
                  }}
                >

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Daily Steps
                  </Typography>

                  <Typography
                    fontWeight={700}
                  >
                    {
                      selectedRecord
                        .daily_steps
                    }
                  </Typography>

                </Paper>


                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    flex: "1 1 180px",
                    borderRadius: 2,
                    backgroundColor:
                      "#f8fafc"
                  }}
                >

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Exercise Days
                  </Typography>

                  <Typography
                    fontWeight={700}
                  >
                    {
                      selectedRecord
                        .exercise_days
                    } / week
                  </Typography>

                </Paper>


                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    flex: "1 1 180px",
                    borderRadius: 2,
                    backgroundColor:
                      "#f8fafc"
                  }}
                >

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Activity Level
                  </Typography>

                  <Typography
                    fontWeight={700}
                    sx={{
                      textTransform:
                        "capitalize"
                    }}
                  >
                    {
                      selectedRecord
                        .activity_level
                    }
                  </Typography>

                </Paper>


                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    flex: "1 1 180px",
                    borderRadius: 2,
                    backgroundColor:
                      "#f8fafc"
                  }}
                >

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Mobility
                  </Typography>

                  <Typography
                    fontWeight={700}
                  >
                    {
                      selectedRecord
                        .mobility
                    } / 5
                  </Typography>

                </Paper>


                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    flex: "1 1 180px",
                    borderRadius: 2,
                    backgroundColor:
                      "#f8fafc"
                  }}
                >

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Balance
                  </Typography>

                  <Typography
                    fontWeight={700}
                  >
                    {
                      selectedRecord
                        .balance
                    } / 5
                  </Typography>

                </Paper>


                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    flex: "1 1 180px",
                    borderRadius: 2,
                    backgroundColor:
                      "#f8fafc"
                  }}
                >

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Walking Difficulty
                  </Typography>

                  <Typography
                    fontWeight={700}
                  >
                    {
                      selectedRecord
                        .walking_difficulty
                    } / 5
                  </Typography>

                </Paper>

              </Stack>


              <Divider sx={{ mb: 3 }} />


              {/* FALL HISTORY */}

              <Typography
                variant="h6"
                fontWeight={800}
                sx={{ mb: 2 }}
              >
                Fall History & Symptoms
              </Typography>


              <Stack
                direction={{
                  xs: "column",
                  sm: "row"
                }}
                flexWrap="wrap"
                spacing={2}
                sx={{ mb: 3 }}
              >

                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    flex: "1 1 180px",
                    borderRadius: 2,
                    backgroundColor:
                      "#f8fafc"
                  }}
                >

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Previous Falls
                  </Typography>

                  <Typography
                    fontWeight={700}
                  >
                    {
                      selectedRecord
                        .previous_falls
                    }
                  </Typography>

                </Paper>


                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    flex: "1 1 180px",
                    borderRadius: 2,
                    backgroundColor:
                      "#f8fafc"
                  }}
                >

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Near Falls
                  </Typography>

                  <Typography
                    fontWeight={700}
                  >
                    {
                      selectedRecord
                        .near_falls
                    }
                  </Typography>

                </Paper>


                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    flex: "1 1 180px",
                    borderRadius: 2,
                    backgroundColor:
                      "#f8fafc"
                  }}
                >

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Dizziness
                  </Typography>

                  <Typography
                    fontWeight={700}
                  >
                    {
                      selectedRecord
                        .dizziness
                    } / 5
                  </Typography>

                </Paper>


                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    flex: "1 1 180px",
                    borderRadius: 2,
                    backgroundColor:
                      "#f8fafc"
                  }}
                >

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Weakness / Fatigue
                  </Typography>

                  <Typography
                    fontWeight={700}
                  >
                    {
                      selectedRecord
                        .weakness
                    } / 5
                  </Typography>

                </Paper>


                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    flex: "1 1 180px",
                    borderRadius: 2,
                    backgroundColor:
                      "#f8fafc"
                  }}
                >

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Medication Risk
                  </Typography>

                  <Typography
                    fontWeight={700}
                  >
                    {
                      selectedRecord
                        .medication_risk
                        ? "Yes"
                        : "No"
                    }
                  </Typography>

                </Paper>

              </Stack>


              <Divider sx={{ mb: 3 }} />


              {/* RISK FACTORS */}

              <Typography
                variant="h6"
                fontWeight={800}
                sx={{ mb: 2 }}
              >
                Contributing Risk Factors
              </Typography>


              {
                selectedRecord
                  .risk_factors
                  ?.length > 0 ? (

                <Stack
                  spacing={1}
                  sx={{ mb: 3 }}
                >

                  {
                    selectedRecord
                      .risk_factors
                      .map(
                        (
                          factor,
                          index
                        ) => (

                          <Box
                            key={index}
                            sx={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: 1,
                              p: 1.5,
                              borderRadius: 2,
                              backgroundColor:
                                "#fff8f8"
                            }}
                          >

                            <WarningAmber
                              fontSize="small"
                              color="warning"
                            />

                            <Typography
                              variant="body2"
                            >
                              {factor}
                            </Typography>

                          </Box>

                        )
                      )
                  }

                </Stack>

              ) : (

                <Typography
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  No major contributing
                  risk factors identified.
                </Typography>

              )}


              {/* RECOMMENDATIONS */}

              <Typography
                variant="h6"
                fontWeight={800}
                sx={{ mb: 2 }}
              >
                Recommendations
              </Typography>


              <Stack spacing={1}>

                {
                  selectedRecord
                    .recommendations
                    ?.map(
                      (
                        recommendation,
                        index
                      ) => (

                        <Box
                          key={index}
                          sx={{
                            display:
                              "flex",
                            alignItems:
                              "flex-start",
                            gap: 1,
                            p: 1.5,
                            borderRadius: 2,
                            backgroundColor:
                              "#f5f9ff"
                          }}
                        >

                          <CheckCircleOutline
                            fontSize="small"
                            color="success"
                          />

                          <Typography
                            variant="body2"
                          >
                            {recommendation}
                          </Typography>

                        </Box>

                      )
                    )
                }

              </Stack>

            </DialogContent>


            <DialogActions
              sx={{
                px: 3,
                py: 2
              }}
            >

              {/* DOWNLOAD REPORT FROM POPUP TOO */}

              <Button
                variant="outlined"
                onClick={() =>
                  generateReport(
                    selectedRecord
                  )
                }
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700
                }}
              >
                📄 Download Report
              </Button>


              <Button
                variant="contained"
                onClick={() =>
                  setSelectedRecord(
                    null
                  )
                }
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700
                }}
              >
                Close
              </Button>

            </DialogActions>

          </>

        )}

      </Dialog>

    </Box>

  );

}