import React from 'react';
import BasePage from './containers/BasePage';
import Global from './Global';

export default function App() {
    Global.__USER_ID__ = "1234"; //TODO
  return (
    <BasePage />
  );
}


