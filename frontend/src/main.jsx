import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Outlet } from 'react-router-dom';


const MainLayout = () => {
  return (
    <>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Donezo</a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li><button className="btn btn-link">Logout</button></li>
          </ul>
        </div>
      </div>
      <Outlet />
    </>
  );
};


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
  