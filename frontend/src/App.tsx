import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./auth/authStore";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardController } from "./pages/DashboardPage";
import { MetricDetailPage } from "./pages/MetricDetailPage/MetricDetailPage";
import type { JSX } from "react/jsx-dev-runtime";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardController />
          </PrivateRoute>
        }
      />
      <Route
        path="/metrics/:id"
        element={
          <PrivateRoute>
            <MetricDetailPage />
          </PrivateRoute>
        }
      />

      {/* catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
