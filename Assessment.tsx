import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  TextField,
  Typography
} from "@mui/material";

import {
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  predictRisk
} from "../services/api";


const initialForm = {

  elderly_name: "",

  age: 70,

  gender: "Female",

  height: 160,

  weight: 65,

  daily_steps: 4000,

  exercise_days: 3,

  mobility: 4,

  balance: 4,

  walking_difficulty: 2,

  previous_falls: 0,

  near_falls: 0,

  dizziness: 1,

  weakness: 2,

  medication_risk: false

};


export default function Assessment() {

  const navigate = useNavigate();

  const [
    form,
    setForm
  ] = useState(initialForm);


  const updateField = (
    field: string,
    value: any
  ) => {

    setForm(
      prev => ({
        ...prev,
        [field]: value
      })
    );

  };


  const submit = async () => {

    try {

      const result =
        await predictRisk(form);

      localStorage.setItem(
        "latestPrediction",
        JSON.stringify(result)
      );

      navigate(
        "/prediction"
      );

    } catch (error) {

      console.error(error);

      alert(
        "Prediction failed. Make sure backend is running."
      );

    }

  };


  return (

    <Box
      sx={{
        p: {
          xs: 2,
          md: 4
        },
        background: "#f5f7fa",
        minHeight: "calc(100vh - 64px)"
      }}
    >

      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ mb: 1 }}
      >
        Fall Risk Assessment
      </Typography>

      <Typography
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        Enter the elderly person's health and
        activity information.
      </Typography>


      <Card
        sx={{
          borderRadius: 4
        }}
      >

        <CardContent
          sx={{ p: 4 }}
        >

          <Grid
            container
            spacing={3}
          >

            {/* Elderly Name */}

            <Grid
              size={{
                xs: 12
              }}
            >

              <TextField
                fullWidth
                label="Elderly Person Name"
                value={
                  form.elderly_name
                }
                onChange={e =>
                  updateField(
                    "elderly_name",
                    e.target.value
                  )
                }
              />

            </Grid>


            {/* Age */}

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4
              }}
            >

              <TextField
                fullWidth
                type="number"
                label="Age"
                value={form.age}
                onChange={e =>
                  updateField(
                    "age",
                    Number(e.target.value)
                  )
                }
              />

            </Grid>


            {/* Gender */}

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4
              }}
            >

              <TextField
                fullWidth
                select
                label="Gender"
                value={form.gender}
                onChange={e =>
                  updateField(
                    "gender",
                    e.target.value
                  )
                }
              >

                <MenuItem value="Female">
                  Female
                </MenuItem>

                <MenuItem value="Male">
                  Male
                </MenuItem>

              </TextField>

            </Grid>


            {/* Height */}

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4
              }}
            >

              <TextField
                fullWidth
                type="number"
                label="Height (cm)"
                value={form.height}
                onChange={e =>
                  updateField(
                    "height",
                    Number(e.target.value)
                  )
                }
              />

            </Grid>


            {/* Weight */}

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4
              }}
            >

              <TextField
                fullWidth
                type="number"
                label="Weight (kg)"
                value={form.weight}
                onChange={e =>
                  updateField(
                    "weight",
                    Number(e.target.value)
                  )
                }
              />

            </Grid>


            {/* Daily Steps */}

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4
              }}
            >

              <TextField
                fullWidth
                type="number"
                label="Daily Steps"
                value={
                  form.daily_steps
                }
                onChange={e =>
                  updateField(
                    "daily_steps",
                    Number(e.target.value)
                  )
                }
              />

            </Grid>


            {/* Exercise Days */}

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4
              }}
            >

              <TextField
                fullWidth
                type="number"
                label="Exercise Days / Week"
                value={
                  form.exercise_days
                }
                onChange={e =>
                  updateField(
                    "exercise_days",
                    Number(e.target.value)
                  )
                }
              />

            </Grid>


            {/* Mobility */}

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4
              }}
            >

              <TextField
                fullWidth
                select
                label="Mobility Level"
                value={form.mobility}
                onChange={e =>
                  updateField(
                    "mobility",
                    Number(e.target.value)
                  )
                }
              >

                {[1,2,3,4,5].map(
                  value => (

                    <MenuItem
                      key={value}
                      value={value}
                    >
                      {value}
                      {" - "}
                      {value <= 2
                        ? "Poor"
                        : value === 3
                        ? "Average"
                        : "Good"}
                    </MenuItem>

                  )
                )}

              </TextField>

            </Grid>


            {/* Balance */}

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4
              }}
            >

              <TextField
                fullWidth
                select
                label="Balance Level"
                value={form.balance}
                onChange={e =>
                  updateField(
                    "balance",
                    Number(e.target.value)
                  )
                }
              >

                {[1,2,3,4,5].map(
                  value => (

                    <MenuItem
                      key={value}
                      value={value}
                    >
                      {value}
                    </MenuItem>

                  )
                )}

              </TextField>

            </Grid>


            {/* Walking Difficulty */}

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4
              }}
            >

              <TextField
                fullWidth
                select
                label="Walking Difficulty"
                value={
                  form.walking_difficulty
                }
                onChange={e =>
                  updateField(
                    "walking_difficulty",
                    Number(e.target.value)
                  )
                }
              >

                {[1,2,3,4,5].map(
                  value => (

                    <MenuItem
                      key={value}
                      value={value}
                    >
                      {value}
                    </MenuItem>

                  )
                )}

              </TextField>

            </Grid>


            {/* Previous Falls */}

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4
              }}
            >

              <TextField
                fullWidth
                type="number"
                label="Previous Falls"
                value={
                  form.previous_falls
                }
                onChange={e =>
                  updateField(
                    "previous_falls",
                    Number(e.target.value)
                  )
                }
              />

            </Grid>


            {/* Near Falls */}

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4
              }}
            >

              <TextField
                fullWidth
                type="number"
                label="Near Falls"
                value={
                  form.near_falls
                }
                onChange={e =>
                  updateField(
                    "near_falls",
                    Number(e.target.value)
                  )
                }
                inputProps={{
                  min: 0
                }}
              />

            </Grid>


            {/* Dizziness */}

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4
              }}
            >

              <TextField
                fullWidth
                select
                label="Dizziness Level"
                value={
                  form.dizziness
                }
                onChange={e =>
                  updateField(
                    "dizziness",
                    Number(e.target.value)
                  )
                }
              >

                {[1,2,3,4,5].map(
                  value => (

                    <MenuItem
                      key={value}
                      value={value}
                    >
                      {value}
                    </MenuItem>

                  )
                )}

              </TextField>

            </Grid>


            {/* Weakness */}

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4
              }}
            >

              <TextField
                fullWidth
                select
                label="Weakness / Fatigue"
                value={
                  form.weakness
                }
                onChange={e =>
                  updateField(
                    "weakness",
                    Number(e.target.value)
                  )
                }
              >

                {[1,2,3,4,5].map(
                  value => (

                    <MenuItem
                      key={value}
                      value={value}
                    >
                      {value}
                    </MenuItem>

                  )
                )}

              </TextField>

            </Grid>


            {/* Medication Risk */}

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4
              }}
            >

              <TextField
                fullWidth
                select
                label="Medication-related Risk"
                value={
                  form.medication_risk
                }
                onChange={e =>
                  updateField(
                    "medication_risk",
                    e.target.value === "true"
                  )
                }
              >

                <MenuItem value="false">
                  No
                </MenuItem>

                <MenuItem value="true">
                  Yes
                </MenuItem>

              </TextField>

            </Grid>


            {/* Analyze Button */}

            <Grid
              size={{
                xs: 12
              }}
            >

              <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 2,
                  py: 1.5,
                  borderRadius: 2
                }}
                onClick={submit}
              >
                Analyze Fall Risk
              </Button>

            </Grid>

          </Grid>

        </CardContent>

      </Card>

    </Box>
  );
}