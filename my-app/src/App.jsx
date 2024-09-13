import Todo from "./components/Todo";
import React, { createContext, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import TodoAdd from './components/TodoAdd';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style/style.css';
export const DarkModeContext = createContext({});

function App() {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <DarkModeContext.Provider value={{darkMode, setDarkMode}}>
      <Routes>
        <Route path="/" element={<Todo />} />
        <Route path="/todoAdd" element={<TodoAdd />} />
      </Routes>
    </DarkModeContext.Provider>
  );
}

export default App;
