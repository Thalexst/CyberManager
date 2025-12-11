import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- 1. IMPORTAR LAYOUTS (PLANTILLAS) ---
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// --- 2. IMPORTAR PÁGINAS (PÚBLICAS) ---
import PageLogin from './pages/auth/PageLogin';

// --- 3. IMPORTAR PÁGINAS (SISTEMA) ---
import PageDashboard from './pages/dashboard/PageDashboard';
import PageClientList from './pages/client/PageClientList';
import PageEquipmentList from './pages/equipment/PageEquipmentList';
import PageSessionNew from './pages/session/PageSessionNew';
// Módulos nuevos ordenados
import PageGameList from './pages/games/PageGameList';
import PageProductList from './pages/products/PageProductList';
import PageMembershipList from './pages/memberships/PageMembershipList';
import PageReports from './pages/reports/PageReports';
import PageRent from "./pages/PageRent";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* GRUPO 1: RUTAS PÚBLICAS (Login / Registro) */}
        {/* Usamos AuthLayout para centrar el formulario en pantalla negra */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<PageLogin />} />
        </Route>

        {/* GRUPO 2: RUTAS PRIVADAS (Sistema Principal) */}
        {/* Usamos MainLayout que tiene el Menú Lateral (PageNav) */}
        <Route element={<MainLayout />}>

          {/* Dashboard Principal */}
          <Route path="/dashboard" element={<PageDashboard />} />

          {/* Módulo de Clientes y Usuarios */}
          <Route path="/clientes" element={<PageClientList />} />
          <Route path="/membresias" element={<PageMembershipList />} />

          {/* Módulo de Inventario */}
          <Route path="/equipos" element={<PageEquipmentList />} />
          <Route path="/juegos" element={<PageGameList />} />
          <Route path="/productos" element={<PageProductList />} />

          {/* Módulo de Operaciones */}
          <Route path="/nueva-sesion" element={<PageSessionNew />} />

          {/* Ruta Comodín: Si escriben una url rara, los manda al dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />

          {/* Módulo de Reportes */}
          <Route path="/reportes" element={<PageReports />} />

          {/* Módulo de Alquiler */}
          <Route path="nueva-sesion" element={<PageRent />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;