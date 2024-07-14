import Login from "../pages/Authentication/Login";
import Register from "../pages/Authentication/Register";
import EventsIndex from "../pages/Events/EventsIndex";
import EventsCreate from "../pages/Events/EventsCreate";
import React from "react";
import { Navigate } from "react-router";


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
    {
        path: "/",
        element: <EventsIndex />,
    },
    {
        path: "/create",
        element: <EventsCreate />,
    },
    {
        path: "*",
        element: <Navigate to="/" />,
    }
];

export { UNPROTECTED_ROUTES, PROTECTED_ROUTES };