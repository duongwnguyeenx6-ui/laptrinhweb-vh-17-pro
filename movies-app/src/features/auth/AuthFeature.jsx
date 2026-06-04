import React from 'react';
import AuthScreen from './AuthScreen';

// movies-app-done
function AuthFeature(props) {
  if (props.currentScreen !== 'auth') return null;

  return <AuthScreen {...props} />;
}

export default AuthFeature;
