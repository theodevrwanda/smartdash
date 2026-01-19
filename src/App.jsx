
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AccountsPage from './pages/AccountsPage';
import TransactionsPage from './pages/TransactionsPage';
import BranchesPage from './pages/BranchesPage';
import EmployeesPage from './pages/EmployeesPage';
import LogsPage from './pages/LogsPage';
import BusinessDetailsPage from './pages/BusinessDetailsPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import PaymentDetailsPage from './pages/PaymentDetailsPage';
import BranchDetailsPage from './pages/BranchDetailsPage';
import UserDetailsPage from './pages/UserDetailsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />

      <Route path="/" element={<Layout />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="accounts" element={<AccountsPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="transactions/:id" element={<PaymentDetailsPage />} />
        <Route path="branches" element={<BranchesPage />} />
        <Route path="branch/:id" element={<BranchDetailsPage />} />
        <Route path="employees" element={<EmployeesPage />} />
        <Route path="user/:id" element={<UserDetailsPage />} />
        <Route path="business/:id" element={<BusinessDetailsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="logs" element={<LogsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
