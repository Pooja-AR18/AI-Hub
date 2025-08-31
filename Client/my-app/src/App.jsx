import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AddEditDoc from './pages/AddEditDoc';
import Search from './pages/Search.jsx';
import TeamQA from './pages/TeamQA';
import './styles.css';


export default function App() {
  return (
    
        <>
        <Navbar/>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/new" element={<ProtectedRoute><AddEditDoc /></ProtectedRoute>} />
          <Route path="/edit/:id" element={<ProtectedRoute><AddEditDoc /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="/qa" element={<ProtectedRoute><TeamQA /></ProtectedRoute>} />
        </Routes>
      </>
  );
}
