import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./auth/Login";
import { Signup } from "./auth/Signup";
import { DashboardLayout } from "./admin/DashboardLayout";
import { Overview } from "./admin/Overview";
import { Products } from "./admin/Products";
import { Categories } from "./admin/Categories";
import { Analytics } from "./admin/Analytics";
import { Settings } from "./admin/Settings";
import KaziFlowStores from "./Pages/KaziFlowStores"; // the marketing page built earlier

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<KaziFlowStores />} /> 
          <Route path="/login" element={<Login />} />
          {/* Not linked from anywhere public — you send this URL directly
              to a seller after they reach out. It's not discoverable
              navigation, just a plain route. */}
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Overview />} />
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<Categories />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
