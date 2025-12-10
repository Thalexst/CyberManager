import { Outlet } from 'react-router-dom';
import PageNav from '../components/PageNav'; // Tu antiguo Sidebar

const MainLayout = () => {
    return (
        <div className="d-flex">
            {/* El menú lateral siempre visible */}
            <PageNav />

            {/* El contenido cambiante a la derecha */}
            <div className="flex-grow-1" style={{ marginLeft: '250px' }}>
                <div className="p-4">
                    <Outlet /> {/* <--- AQUÍ SE RENDERIZAN LAS PÁGINAS HIJAS */}
                </div>
            </div>
        </div>
    );
};

export default MainLayout;