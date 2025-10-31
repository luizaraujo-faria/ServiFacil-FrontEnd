import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loggin from './pages/Loggin';
import CreateAccount from './pages/CreateAccount';
import ProfessionalForm from './pages/ProfessionalForm';
import Terms from './pages/Terms';
import Recuperation from './pages/Recuperation';
import Home from './pages/Home';
import ServiceDetail from './pages/ServiceDetail';
import MyAppointments from './pages/MyAppointments';
import CreateAssessment from './pages/CreateAssessment';
import Profile from './pages/Profile';
import ProfessionalDashboard from './pages/ProfessionalDashboard';
import CreateService from './pages/CreateService';
import EditService from './pages/EditService';
import MyReviews from './pages/MyReviews';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <Routes>
                {/* Rotas públicas */}
                <Route path="/" element={<Loggin />} />
                <Route path="/cadastro" element={<CreateAccount />} />
                <Route path="/cadastroProfissional" element={<ProfessionalForm />} />
                <Route path="/Terms" element={<Terms />} />
                <Route path="/Recuperation" element={<Recuperation />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />

                {/* Rotas protegidas - Cliente */}
                <Route
                    path="/home"
                    element={
                        <ProtectedRoute allowedTypes={['Cliente']}>
                            <Home />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/servico/:serviceId"
                    element={
                        <ProtectedRoute allowedTypes={['Cliente']}>
                            <ServiceDetail />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/meus-agendamentos"
                    element={
                        <ProtectedRoute allowedTypes={['Cliente']}>
                            <MyAppointments />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/avaliar/:serviceId"
                    element={
                        <ProtectedRoute allowedTypes={['Cliente']}>
                            <CreateAssessment />
                        </ProtectedRoute>
                    }
                />

                {/* Rotas protegidas - Profissional */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute allowedTypes={['Profissional']}>
                            <ProfessionalDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/criar-servico"
                    element={
                        <ProtectedRoute allowedTypes={['Profissional']}>
                            <CreateService />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/editar-servico/:serviceId"
                    element={
                        <ProtectedRoute allowedTypes={['Profissional']}>
                            <EditService />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/minhas-avaliacoes"
                    element={
                        <ProtectedRoute allowedTypes={['Profissional']}>
                            <MyReviews />
                        </ProtectedRoute>
                    }
                />

                {/* Rotas protegidas - Ambos */}
                <Route
                    path="/perfil"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
