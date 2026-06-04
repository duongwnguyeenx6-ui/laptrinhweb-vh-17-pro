import React from 'react';
import HomePage from './HomePage';

// movies-app-done
function HomeFeature(props) {
  if (props.currentScreen !== 'movie-list') return null;

  return <HomePage {...props} />;
}

export default HomeFeature;
