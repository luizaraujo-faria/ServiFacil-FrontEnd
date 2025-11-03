import { Navigate } from 'react-router-dom';

/**
 * Componente para proteger rotas que requerem autenticação
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente filho a ser renderizado
 * @param {string[]} props.allowedTypes - Tipos de usuário permitidos (opcional)
 */
function ProtectedRoute({ children, allowedTypes = [] }) {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');

    // Se não estiver autenticado, redireciona para login
    if (!token) {
        return <Navigate to="/" replace />;
    }

    // Se houver restrição de tipo de usuário, verifica
    if (allowedTypes.length > 0 && !allowedTypes.includes(userType)) {
        // Redireciona para a página apropriada baseado no tipo
        if (userType === 'Profissional') {
            return <Navigate to="/dashboard" replace />;
        } else {
            return <Navigate to="/home" replace />;
        }
    }

    return children;
}

export default ProtectedRoute;
