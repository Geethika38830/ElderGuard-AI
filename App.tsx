import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";
import Assessment from "./pages/Assessment";
import PredictionResult from "./pages/PredictionResult";
import History from "./pages/History";

/* =========================
   PATIENT
========================= */

import PatientProfile
  from "./pages/patient/PatientProfile";

import PatientProgress
  from "./pages/patient/PatientProgress";

import PatientChat
  from "./pages/patient/PatientChat";

import PatientSubscription
  from "./pages/patient/PatientSubscription";


/* =========================
   PHYSIOTHERAPIST
========================= */

import PhysiotherapistDashboard
  from "./pages/physiotherapist/PhysiotherapistDashboard";

import MyPatients
  from "./pages/physiotherapist/MyPatients";

import PatientDetails
  from "./pages/physiotherapist/PatientDetails";

import RiskMonitoring
  from "./pages/physiotherapist/RiskMonitoring";

import PhysioMessages
  from "./pages/physiotherapist/PhysioMessages";

import FollowUps
  from "./pages/physiotherapist/FollowUps";


/* =========================
   ADMIN
========================= */

import AdminDashboard
  from "./pages/admin/AdminDashboard";

import ManageUsers
  from "./pages/admin/ManageUsers";

import ManagePhysiotherapists
  from "./pages/admin/ManagePhysiotherapists";

import AssignPatients
  from "./pages/admin/AssignPatients";

import ManageSubscriptions
  from "./pages/admin/ManageSubscriptions";


/* =====================================================
   GET CURRENT USER
===================================================== */

function getUser() {

  const storedUser =
    localStorage.getItem("user");

  if (!storedUser) {
    return null;
  }

  try {

    return JSON.parse(storedUser);

  } catch {

    localStorage.removeItem("user");

    return null;
  }
}


/* =====================================================
   ROLE HOME
===================================================== */

function RoleHome() {

  const user = getUser();

  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (user.role === "admin") {

    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }

  if (user.role === "physiotherapist") {

    return (
      <Navigate
        to="/physiotherapist"
        replace
      />
    );
  }

  return (
    <Navigate
      to="/dashboard"
      replace
    />
  );
}


/* =====================================================
   PATIENT ROUTE
===================================================== */

function PatientRoute({
  children
}: {
  children: React.ReactNode;
}) {

  const user = getUser();

  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (user.role !== "patient") {

    return (
      <RoleHome />
    );
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}


/* =====================================================
   PHYSIOTHERAPIST ROUTE
===================================================== */

function PhysiotherapistRoute({
  children
}: {
  children: React.ReactNode;
}) {

  const user = getUser();

  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (user.role !== "physiotherapist") {

    return (
      <RoleHome />
    );
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}


/* =====================================================
   ADMIN ROUTE
===================================================== */

function AdminRoute({
  children
}: {
  children: React.ReactNode;
}) {

  const user = getUser();

  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (user.role !== "admin") {

    return (
      <RoleHome />
    );
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}


/* =====================================================
   PATIENT DASHBOARD
===================================================== */

function PatientDashboard() {

  return (
    <PatientRoute>
      <Dashboard />
    </PatientRoute>
  );
}


/* =====================================================
   APP
===================================================== */

export default function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* =========================
            LOGIN
        ========================= */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* =========================
            ROOT
        ========================= */}

        <Route
          path="/"
          element={<RoleHome />}
        />


        {/* =========================
            PATIENT DASHBOARD
        ========================= */}

        <Route
          path="/dashboard"
          element={<PatientDashboard />}
        />


        {/* =========================
            PATIENT ROUTES
        ========================= */}

        <Route
          path="/assessment"
          element={
            <PatientRoute>
              <Assessment />
            </PatientRoute>
          }
        />

        <Route
          path="/prediction"
          element={
            <PatientRoute>
              <PredictionResult />
            </PatientRoute>
          }
        />

        <Route
          path="/history"
          element={
            <PatientRoute>
              <History />
            </PatientRoute>
          }
        />

        <Route
          path="/patient/profile"
          element={
            <PatientRoute>
              <PatientProfile />
            </PatientRoute>
          }
        />

        <Route
          path="/patient/progress"
          element={
            <PatientRoute>
              <PatientProgress />
            </PatientRoute>
          }
        />

        <Route
          path="/patient/chat"
          element={
            <PatientRoute>
              <PatientChat />
            </PatientRoute>
          }
        />

        <Route
          path="/patient/subscription"
          element={
            <PatientRoute>
              <PatientSubscription />
            </PatientRoute>
          }
        />


        {/* =========================
            PHYSIOTHERAPIST ROUTES
        ========================= */}

        <Route
          path="/physiotherapist"
          element={
            <PhysiotherapistRoute>
              <PhysiotherapistDashboard />
            </PhysiotherapistRoute>
          }
        />

        <Route
          path="/physiotherapist/patients"
          element={
            <PhysiotherapistRoute>
              <MyPatients />
            </PhysiotherapistRoute>
          }
        />

        <Route
          path="/physiotherapist/patient/:patientId"
          element={
            <PhysiotherapistRoute>
              <PatientDetails />
            </PhysiotherapistRoute>
          }
        />

        <Route
          path="/physiotherapist/risk-monitoring"
          element={
            <PhysiotherapistRoute>
              <RiskMonitoring />
            </PhysiotherapistRoute>
          }
        />

        <Route
          path="/physiotherapist/followups"
          element={
            <PhysiotherapistRoute>
              <FollowUps />
            </PhysiotherapistRoute>
          }
        />

        <Route
          path="/physiotherapist/messages"
          element={
            <PhysiotherapistRoute>
              <PhysioMessages />
            </PhysiotherapistRoute>
          }
        />


        {/* =========================
            ADMIN ROUTES
        ========================= */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <ManageUsers />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/physiotherapists"
          element={
            <AdminRoute>
              <ManagePhysiotherapists />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/assignments"
          element={
            <AdminRoute>
              <AssignPatients />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/subscriptions"
          element={
            <AdminRoute>
              <ManageSubscriptions />
            </AdminRoute>
          }
        />


        {/* =========================
            UNKNOWN URL
        ========================= */}

        <Route
          path="*"
          element={<RoleHome />}
        />

      </Routes>

    </BrowserRouter>
  );
}