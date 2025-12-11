import { Outlet } from 'react-router-dom';
import PageNav from '../components/PageNav';
import Topbar from '../components/Topbar'; // <--- 1. IMPORTAR

const MainLayout = () => {
    return (
        <div className="d-flex">
            {/* Menú Lateral Fijo */}
            <PageNav />

            {/* Contenido Derecha */}
            <div className="flex-grow-1 d-flex flex-column" style={{ marginLeft: '250px', minHeight: '100vh' }}>

                {/* 2. AGREGAR TOPBAR AQUÍ */}
                <Topbar />

                {/* Contenido de las páginas */}
                <div className="p-4 pt-0"> {/* pt-0 para que no quede muy separado de la barra */}
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default MainLayout;