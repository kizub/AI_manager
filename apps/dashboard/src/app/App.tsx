import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LeadsPage from './pages/LeadsPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/leads" element={<LeadsPage />} />
        <Route path="/" element={<Navigate to={`/leads${window.location.search}`} replace />} />
        <Route path="*" element={<Navigate to={`/leads${window.location.search}`} replace />} />
      </Routes>
    </Router>
  );
}
