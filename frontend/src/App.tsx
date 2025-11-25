import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./auth/authStore";
import { DashboardController } from "./pages/DashboardPage";
import type { JSX } from "react/jsx-dev-runtime";
import { LoginController } from "./pages/LoginPage";
import { MetricDetailController } from "./pages/MetricDetailPage";
import { RegisterController } from "./pages/RegisterPage";

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
      <Route path="/login" element={<LoginController />} />
      <Route path="/register" element={<RegisterController />} />

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
            <MetricDetailController />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
