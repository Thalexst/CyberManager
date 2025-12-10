import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
            {/* Aquí podrías poner un logo o footer común para login/registro */}
            <div className="w-100" style={{ maxWidth: '400px' }}>
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;