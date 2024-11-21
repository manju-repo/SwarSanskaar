import {useEffect, useState, useContext} from 'react';
import { createBrowserRouter ,RouterProvider, Route, Navigate, Routes } from 'react-router-dom';
import RootLayout from './components/root';
import HomePage from './components/HomePage';
import RegistrationForm from './components/RegistrationForm';
import FeesPaymentForm from './components/FeesPaymentForm';
import Students from './pages/Students';
import Branch from './pages/Branch';
import BranchStudents from './pages/BranchStudents';
import Drawer from './components/Drawer';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
const router = createBrowserRouter([
  {
    path: '/',
    element:
     <RootLayout />,
  children: [
        { path: '/', element: <HomePage /> },
        { path: '/homepage', element: <HomePage /> },
        { path: '/student/new', element: <RegistrationForm /> },
        { path: '/branch/new', element: <Branch /> },
        { path: '/branch/edit/:branchId', element: <Branch /> },
        { path: '/branches/:branchId', element: <BranchStudents /> },
        { path: '/branches', element: <Students /> },
        { path: '/students', element: <Students /> },
        { path: '/student/edit/:studentId', element: <RegistrationForm /> },
        { path: '/feesPayment', element: <FeesPaymentForm /> },
        { path: '/feesPayment/:studentId', element: <FeesPaymentForm /> },
  ]}]);
  return (
      <RouterProvider  router={router} />
    );
}

export default App;
