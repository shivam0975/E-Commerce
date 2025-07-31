import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Store } from '../context/Store';

export default function ProtectedRoute() {
  const { state } = useContext(Store);
  const {userInfo} = state;
  return userInfo ? <Outlet /> : <Navigate to="/login" />;
}