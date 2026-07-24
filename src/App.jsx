import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Detail from "./pages/Detail";

import Admin from "./pages/Admin";

import Dashboard from "./pages/admin/Dashboard";
import Girls from "./pages/admin/Girls";
import AddGirl from "./pages/admin/AddGirl";
import EditGirl from "./pages/admin/EditGirl";
import Settings from "./pages/admin/Settings";

import Login from "./pages/admin/Login";
import ProtectedRoute from "./pages/admin/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            MINI APP
        ========================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/detail/:id"
          element={<Detail />}
        />


        {/* =========================
            ADMIN LOGIN
        ========================= */}

        <Route
          path="/admin/login"
          element={<Login />}
        />


        {/* =========================
            PROTECTED ADMIN
        ========================= */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        >

          <Route
            index
            element={<Dashboard />}
          />

          <Route
            path="girls"
            element={<Girls />}
          />

          <Route
            path="girls/add"
            element={<AddGirl />}
          />

          <Route
            path="girls/edit/:id"
            element={<EditGirl />}
          />

          <Route
            path="settings"
            element={<Settings />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;