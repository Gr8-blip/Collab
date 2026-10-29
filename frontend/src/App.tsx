import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import { AuthProvider } from "./context/AuthContext";

// Pages
import Dashboard from "./pages/DashboardPage";
import YourRoomsPage from "./pages/YourRoomsPage";
import ExploreRoomsPage from "./pages/ExploreRoomsPage";
import CreateRoomPage from "./pages/CreateRoomPage";
import RoomWorkspaceLayout from "./components/dashboard/RoomWorkspaceLayout";
import SpotContent from "./components/dashboard/SpotContent";
import RoomDefaultRedirect from "./components/dashboard/RoomDefaultRedirect";

interface ProtectedRouteProps {
  children: React.ReactNode,
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, authInitializing } = useAuth();
  if (authInitializing) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>

      <Routes>

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/rooms" element={<ProtectedRoute><YourRoomsPage /></ProtectedRoute>} />
        <Route path="/rooms/new" element={<ProtectedRoute><CreateRoomPage /></ProtectedRoute>} />
        <Route path="/explore" element={<ProtectedRoute><ExploreRoomsPage /></ProtectedRoute>} />

        <Route path="/rooms/:room_id" element={<RoomWorkspaceLayout />}>
          <Route index element={<RoomDefaultRedirect />} />
          <Route path=":title" element={<SpotContent />} />
        </Route>
      </Routes>
    </AuthProvider>

  )
}