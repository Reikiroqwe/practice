import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Проверьте эту строку, чтобы она указывала на правильный путь к файлу App.js

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);