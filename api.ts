import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json"
  }
});


/* =========================
   TYPES
========================= */

export type UserRole =
  | "patient"
  | "physiotherapist"
  | "admin";

export type SubscriptionPlan =
  | "free"
  | "plus"
  | "professional";

export type SubscriptionStatus =
  | "active"
  | "inactive"
  | "expired";


export interface UserData {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  subscription_plan: SubscriptionPlan;
  subscription_status: SubscriptionStatus;
  subscription_expiry: string | null;
}


export interface AssessmentData {
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
}


/* =========================
   CURRENT USER
========================= */

export function getCurrentUser(): UserData | null {

  const storedUser =
    localStorage.getItem("user");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(
      storedUser
    ) as UserData;
  } catch {
    return null;
  }
}


/* =========================
   ASSESSMENT
========================= */

export async function predictRisk(
  data: AssessmentData
) {

  const user = getCurrentUser();

  if (!user) {
    throw new Error(
      "Please log in before creating an assessment."
    );
  }

  const response = await API.post(
    "/api/assessment/",
    data,
    {
      params: {
        user_id: user.id
      }
    }
  );

  return response.data;
}


export async function getHistory() {

  const user = getCurrentUser();

  if (!user) {
    throw new Error(
      "Please log in to view history."
    );
  }

  const response = await API.get(
    "/api/assessment/history",
    {
      params: {
        user_id: user.id
      }
    }
  );

  return response.data;
}


/* =========================
   DASHBOARD
========================= */

export async function getDashboard() {

  const user = getCurrentUser();

  if (!user) {
    throw new Error(
      "Please log in."
    );
  }

  const response = await API.get(
    "/api/dashboard/summary",
    {
      params: {
        user_id: user.id
      }
    }
  );

  return response.data;
}


/* =========================
   AUTH
========================= */

export async function login(
  email: string,
  password: string
) {

  const response = await API.post(
    "/api/auth/login",
    null,
    {
      params: {
        email,
        password
      }
    }
  );

  return response.data;
}


export async function registerUser(
  name: string,
  email: string,
  password: string
) {

  const response = await API.post(
    "/api/auth/register",
    null,
    {
      params: {
        name,
        email,
        password
      }
    }
  );

  return response.data;
}


/* =========================
   PATIENT
========================= */

export async function getPatientProfile() {

  const user = getCurrentUser();

  if (!user) {
    throw new Error("Please log in.");
  }

  const response = await API.get(
    "/api/patient/profile",
    {
      params: {
        patient_id: user.id
      }
    }
  );

  return response.data;
}


export async function getPatientProgress() {

  const user = getCurrentUser();

  if (!user) {
    throw new Error("Please log in.");
  }

  const response = await API.get(
    "/api/patient/progress",
    {
      params: {
        patient_id: user.id
      }
    }
  );

  return response.data;
}


/* =========================
   SUBSCRIPTION
========================= */

export async function getSubscriptionStatus() {

  const user = getCurrentUser();

  if (!user) {
    throw new Error("Please log in.");
  }

  const response = await API.get(
    "/api/subscription/status",
    {
      params: {
        user_id: user.id
      }
    }
  );

  return response.data;
}


export async function activatePlus() {

  const user = getCurrentUser();

  if (!user) {
    throw new Error("Please log in.");
  }

  const response = await API.post(
    "/api/subscription/plus",
    null,
    {
      params: {
        user_id: user.id
      }
    }
  );

  return response.data;
}


export async function cancelSubscription() {

  const user = getCurrentUser();

  if (!user) {
    throw new Error("Please log in.");
  }

  const response = await API.post(
    "/api/subscription/cancel",
    null,
    {
      params: {
        user_id: user.id
      }
    }
  );

  return response.data;
}


/* =========================
   PHYSIOTHERAPIST
========================= */

export async function getPhysioDashboard() {

  const user = getCurrentUser();

  if (!user) {
    throw new Error("Please log in.");
  }

  const response = await API.get(
    "/api/physiotherapist/dashboard",
    {
      params: {
        physiotherapist_id: user.id
      }
    }
  );

  return response.data;
}


export async function getAssignedPatients() {

  const user = getCurrentUser();

  if (!user) {
    throw new Error("Please log in.");
  }

  const response = await API.get(
    "/api/assignment/patients",
    {
      params: {
        physiotherapist_id: user.id
      }
    }
  );

  return response.data;
}


export async function getPatientDetails(
  patientId: number
) {

  const user = getCurrentUser();

  if (!user) {
    throw new Error("Please log in.");
  }

  const response = await API.get(
    `/api/physiotherapist/patient/${patientId}`,
    {
      params: {
        physiotherapist_id: user.id
      }
    }
  );

  return response.data;
}


export async function getRiskMonitoring() {

  const user = getCurrentUser();

  if (!user) {
    throw new Error("Please log in.");
  }

  const response = await API.get(
    "/api/physiotherapist/risk-monitoring",
    {
      params: {
        physiotherapist_id: user.id
      }
    }
  );

  return response.data;
}


export async function getFollowUps() {

  const user = getCurrentUser();

  if (!user) {
    throw new Error("Please log in.");
  }

  const response = await API.get(
    "/api/physiotherapist/followups",
    {
      params: {
        physiotherapist_id: user.id
      }
    }
  );

  return response.data;
}


/* =========================
   ADMIN
========================= */

export async function getAdminDashboard() {

  const user = getCurrentUser();

  if (!user) {
    throw new Error("Please log in.");
  }

  const response = await API.get(
    "/api/admin/dashboard",
    {
      params: {
        admin_id: user.id
      }
    }
  );

  return response.data;
}


export async function getAdminUsers() {

  const user = getCurrentUser();

  if (!user) {
    throw new Error("Please log in.");
  }

  const response = await API.get(
    "/api/admin/users",
    {
      params: {
        admin_id: user.id
      }
    }
  );

  return response.data;
}


export async function getAdminPatients() {

  const user = getCurrentUser();

  if (!user) {
    throw new Error("Please log in.");
  }

  const response = await API.get(
    "/api/admin/patients",
    {
      params: {
        admin_id: user.id
      }
    }
  );

  return response.data;
}


export async function getAdminPhysiotherapists() {

  const user = getCurrentUser();

  if (!user) {
    throw new Error("Please log in.");
  }

  const response = await API.get(
    "/api/admin/physiotherapists",
    {
      params: {
        admin_id: user.id
      }
    }
  );

  return response.data;
}


/* =========================
   CREATE PHYSIOTHERAPIST
========================= */

export async function createPhysiotherapist(
  name: string,
  email: string,
  password: string
) {

  const user = getCurrentUser();

  if (!user) {
    throw new Error("Please log in.");
  }

  if (user.role !== "admin") {
    throw new Error(
      "Administrator access required."
    );
  }

  const response = await API.post(
    "/api/admin/physiotherapists/create",
    null,
    {
      params: {
        admin_id: user.id,
        name,
        email,
        password
      }
    }
  );

  return response.data;
}


export async function getAssignments() {

  const user = getCurrentUser();

  if (!user) {
    throw new Error("Please log in.");
  }

  const response = await API.get(
    "/api/assignment/all",
    {
      params: {
        admin_id: user.id
      }
    }
  );

  return response.data;
}


export async function assignPatient(
  patientId: number,
  physiotherapistId: number
) {

  const user = getCurrentUser();

  if (!user) {
    throw new Error("Please log in.");
  }

  const response = await API.post(
    "/api/assignment/assign",
    null,
    {
      params: {
        admin_id: user.id,
        patient_id: patientId,
        physiotherapist_id: physiotherapistId
      }
    }
  );

  return response.data;
}


/* =========================
   CHAT
========================= */

export async function getConversation(
  physiotherapistId: number
) {

  const user = getCurrentUser();

  if (!user) {
    throw new Error("Please log in.");
  }

  const response = await API.get(
    "/api/chat/conversation",
    {
      params: {
        patient_id: user.id,
        physiotherapist_id: physiotherapistId
      }
    }
  );

  return response.data;
}


export async function sendMessage(
  receiverId: number,
  message: string
) {

  const user = getCurrentUser();

  if (!user) {
    throw new Error("Please log in.");
  }

  const response = await API.post(
    "/api/chat/send",
    null,
    {
      params: {
        sender_id: user.id,
        receiver_id: receiverId,
        message
      }
    }
  );

  return response.data;
}


export default API;