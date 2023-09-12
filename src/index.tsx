import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import TodoListPage from './pages/TodoList';

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      {/* Dynamic route for TSX Element */}
      <Route index element={<App />} />
      <Route path="list/:id" element={<TodoListPage />} />
    </Route>
  )
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
