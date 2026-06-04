import React from 'react';
import AdminPanel from './AdminPanel';
import MovieManagement from './MovieManagement';

// movies-app-done
function AdminFeature({ currentScreen, currentUser, adminView, ...props }) {
  if (currentScreen !== 'admin' || !currentUser || currentUser.role !== 'admin') return null;

  if (adminView === 'panel') {
    return <AdminPanel {...props} />;
  }

  return <MovieManagement {...props} />;
}

export default AdminFeature;
