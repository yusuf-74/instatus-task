import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthMiddleware from './middleware/AuthMiddleware';
import { PROTECTED_ROUTES, UNPROTECTED_ROUTES } from './routes';
import Navbar from './components/Navbar';
function App() {
  return (

    <div>
      <Routes>
        {UNPROTECTED_ROUTES.map((route, idx) => (
          <Route
            path={route.path}
            element={route.element}
            key={idx}
            exact={true}
          />
        ))}
        {PROTECTED_ROUTES.map((route, idx) => (
          <Route
            path={route.path}
            element={
              <AuthMiddleware>
                <Navbar />
                <div className='page-content'>
                  <Suspense fallback={<div>
                    Loading...
                  </div>}>
                    {route.element}
                  </Suspense>
                </div>

              </AuthMiddleware>}
            key={idx}
            exact={true}
          />
        ))}
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
