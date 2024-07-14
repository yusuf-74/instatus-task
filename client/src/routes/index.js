import Login from "../pages/Authentication/Login";
import Register from "../pages/Authentication/Register";
import React from "react";


const UNPROTECTED_ROUTES = [
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    }    
];

const PROTECTED_ROUTES = [

];

export { UNPROTECTED_ROUTES, PROTECTED_ROUTES };