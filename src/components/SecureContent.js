import React, { useState, useEffect } from 'react';

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const SecureContent = ({ fallback, children }) => {
  const [userSession, setUserSession] = useState(getCookie('UserSession'));
  const [activeUser, setActiveUser] = useState(localStorage.getItem('activeUser'));

  const checkForUpdates = () => {
    const currentUserSession = getCookie('UserSession');
    const currentActiveUser = localStorage.getItem('activeUser');

    if (currentUserSession !== userSession) {
      setUserSession(currentUserSession);
    }

    if (currentActiveUser !== activeUser) {
      setActiveUser(currentActiveUser);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(checkForUpdates, 200);

    return () => clearInterval(intervalId);
  }, [userSession, activeUser]);

  if (userSession && activeUser) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

export default SecureContent;
