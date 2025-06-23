import React, { useEffect } from 'react';
import { AppContent, AppSidebar, AppHeader } from '../components/index';

const DefaultLayout = () => {
  return (
    <div>
      <AppSidebar forceUnfoldable={false} />
      <AppHeader removeMargins={false} />
      <div className="wrapper d-flex flex-column min-vh-100">
        <div className="body flex-grow-1">
          {<AppContent />}
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
