import jsPDF from "jspdf";

export interface ReportData {
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

  risk_score: number;
  risk_level: string;

  risk_factors: string[];
  recommendations: string[];

  created_at?: string;
}

function getConcernLevel(value: number) {
  if (value <= 2) return "Needs Attention";
  if (value === 3) return "Moderate";
  return "Good";
}

function getSymptomLevel(value: number) {
  if (value >= 4) return "High";
  if (value >= 3) return "Moderate";
  return "Low";
}

export function generateReport(data: ReportData) {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  let y = 20;

  // --------------------------------------------------
  // Helper: page break
  // --------------------------------------------------

  const checkPageBreak = (requiredSpace = 15) => {
    if (y + requiredSpace > pageHeight - 20) {
      doc.addPage();
      y = 20;
    }
  };

  // --------------------------------------------------
  // HEADER
  // --------------------------------------------------

  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");

  doc.text(
    "ElderCare AI",
    pageWidth / 2,
    y,
    { align: "center" }
  );

  y += 9;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  doc.text(
    "Elderly Fall-Risk Screening & Health Monitoring",
    pageWidth / 2,
    y,
    { align: "center" }
  );

  y += 15;

  doc.line(
    15,
    y,
    pageWidth - 15,
    y
  );

  y += 12;

  // --------------------------------------------------
  // PATIENT INFORMATION
  // --------------------------------------------------

  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");

  doc.text(
    "Patient Information",
    15,
    y
  );

  y += 9;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  const patientInfo = [
    `Name: ${data.elderly_name}`,
    `Age: ${data.age}`,
    `Gender: ${data.gender}`,
    `Height: ${data.height} cm`,
    `Weight: ${data.weight} kg`,
    `Daily Steps: ${data.daily_steps}`,
    `Exercise Days / Week: ${data.exercise_days}`
  ];

  patientInfo.forEach((item) => {
    checkPageBreak();

    doc.text(
      item,
      20,
      y
    );

    y += 7;
  });

  // --------------------------------------------------
  // FALL RISK ASSESSMENT
  // --------------------------------------------------

  y += 5;

  checkPageBreak(40);

  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");

  doc.text(
    "Fall-Risk Assessment",
    15,
    y
  );

  y += 10;

  doc.setFontSize(18);

  doc.text(
    `Risk Score: ${data.risk_score} / 100`,
    20,
    y
  );

  y += 9;

  doc.setFontSize(14);

  doc.text(
    `Risk Level: ${data.risk_level}`,
    20,
    y
  );

  y += 15;

  // --------------------------------------------------
  // CONTRIBUTING RISK FACTORS
  // --------------------------------------------------

  checkPageBreak(35);

  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");

  doc.text(
    "Contributing Risk Factors",
    15,
    y
  );

  y += 9;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  if (
    data.risk_factors &&
    data.risk_factors.length > 0
  ) {
    data.risk_factors.forEach((factor) => {
      checkPageBreak();

      doc.text(
        `• ${factor}`,
        20,
        y
      );

      y += 7;
    });
  } else {
    doc.text(
      "No major contributing factors identified.",
      20,
      y
    );

    y += 7;
  }

  // --------------------------------------------------
  // PHYSIOTHERAPY FUNCTIONAL PROFILE
  // --------------------------------------------------

  y += 8;

  checkPageBreak(80);

  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");

  doc.text(
    "Physiotherapy Functional Profile",
    15,
    y
  );

  y += 10;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  const functionalProfile = [
    `Balance: ${getConcernLevel(data.balance)}`,
    `Mobility: ${getConcernLevel(data.mobility)}`,
    `Gait / Walking: ${getConcernLevel(data.walking_difficulty)}`,
    `Lower-Limb Strength: ${getSymptomLevel(data.weakness)}`,
    `Physical Activity: ${
      data.daily_steps < 3000
        ? "Low"
        : data.daily_steps < 6000
        ? "Moderate"
        : "Good"
    }`,
    `Previous Falls: ${
      data.previous_falls > 0
        ? `${data.previous_falls} recorded`
        : "None reported"
    }`,
    `Near-Falls: ${
      data.near_falls > 0
        ? `${data.near_falls} reported`
        : "None reported"
    }`,
    `Dizziness: ${getSymptomLevel(data.dizziness)}`,
    `Weakness / Fatigue: ${getSymptomLevel(data.weakness)}`
  ];

  functionalProfile.forEach((item) => {
    checkPageBreak();

    doc.text(
      `• ${item}`,
      20,
      y
    );

    y += 7;
  });

  // --------------------------------------------------
  // SUGGESTED PHYSIOTHERAPY FOCUS
  // --------------------------------------------------

  y += 8;

  checkPageBreak(60);

  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");

  doc.text(
    "Suggested Physiotherapy Focus",
    15,
    y
  );

  y += 9;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  const physiotherapyFocus: string[] = [];

  if (data.balance <= 2) {
    physiotherapyFocus.push(
      "Balance and stability assessment / training."
    );
  }

  if (data.mobility <= 2) {
    physiotherapyFocus.push(
      "Functional mobility assessment and mobility-focused rehabilitation."
    );
  }

  if (data.walking_difficulty <= 2) {
    physiotherapyFocus.push(
      "Gait and walking assessment with appropriate fall-prevention strategies."
    );
  }

  if (data.weakness >= 3) {
    physiotherapyFocus.push(
      "Lower-limb strengthening and functional movement assessment."
    );
  }

  if (data.previous_falls > 0) {
    physiotherapyFocus.push(
      "Fall-prevention and functional safety assessment."
    );
  }

  if (data.daily_steps < 3000) {
    physiotherapyFocus.push(
      "Gradual progression of safe functional physical activity."
    );
  }

  if (data.dizziness >= 3) {
    physiotherapyFocus.push(
      "Assessment of dizziness-related functional safety and movement tolerance."
    );
  }

  if (physiotherapyFocus.length === 0) {
    physiotherapyFocus.push(
      "Continue maintaining functional mobility, balance, strength, and safe physical activity."
    );
  }

  physiotherapyFocus.forEach((item) => {
    const lines = doc.splitTextToSize(
      `• ${item}`,
      pageWidth - 35
    );

    lines.forEach((line: string) => {
      checkPageBreak();

      doc.text(
        line,
        20,
        y
      );

      y += 6;
    });

    y += 2;
  });

  // --------------------------------------------------
  // PERSONALIZED RECOMMENDATIONS
  // --------------------------------------------------

  y += 7;

  checkPageBreak(50);

  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");

  doc.text(
    "Personalized Recommendations",
    15,
    y
  );

  y += 9;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  if (
    data.recommendations &&
    data.recommendations.length > 0
  ) {
    data.recommendations.forEach(
      (recommendation) => {

        const lines = doc.splitTextToSize(
          `• ${recommendation}`,
          pageWidth - 35
        );

        lines.forEach((line: string) => {
          checkPageBreak();

          doc.text(
            line,
            20,
            y
          );

          y += 6;
        });

        y += 2;
      }
    );
  }

  // --------------------------------------------------
  // ASSESSMENT DATE
  // --------------------------------------------------

  y += 5;

  checkPageBreak(25);

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");

  doc.text(
    "Assessment Date:",
    15,
    y
  );

  doc.setFont("helvetica", "normal");

  const date = data.created_at
    ? new Date(data.created_at).toLocaleString()
    : new Date().toLocaleString();

  doc.text(
    date,
    58,
    y
  );

  y += 15;

  // --------------------------------------------------
  // DISCLAIMER
  // --------------------------------------------------

  checkPageBreak(40);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");

  doc.text(
    "Disclaimer",
    15,
    y
  );

  y += 6;

  doc.setFont("helvetica", "normal");

  const disclaimer =
    "This system provides fall-risk screening and decision support only. " +
    "It is not a medical diagnosis or a substitute for professional " +
    "healthcare assessment. Physiotherapy focus areas are screening-oriented " +
    "and should be interpreted by a qualified healthcare professional.";

  const disclaimerLines =
    doc.splitTextToSize(
      disclaimer,
      pageWidth - 30
    );

  disclaimerLines.forEach(
    (line: string) => {
      checkPageBreak();

      doc.text(
        line,
        15,
        y
      );

      y += 5;
    }
  );

  // --------------------------------------------------
  // FOOTER
  // --------------------------------------------------

  doc.setFontSize(9);

  doc.text(
    "ElderCare AI • Fall-Risk Screening & Health Monitoring",
    pageWidth / 2,
    pageHeight - 10,
    {
      align: "center"
    }
  );

  // --------------------------------------------------
  // SAVE PDF
  // --------------------------------------------------

  const safeName =
    data.elderly_name.replace(
      /[^a-z0-9]/gi,
      "_"
    );

  doc.save(
    `ElderCare_AI_Report_${safeName}.pdf`
  );
}