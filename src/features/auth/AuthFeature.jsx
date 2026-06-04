import React from 'react';
import AuthScreen from './AuthScreen';

function AuthFeature(props) {
  if (props.currentScreen !== 'auth') return null;

  return <AuthScreen {...props} />;
}

export default AuthFeature;
