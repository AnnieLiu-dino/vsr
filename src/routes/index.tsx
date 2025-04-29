import React from 'react';
import { useRoutes } from 'react-router-dom';
const LivingRoom = React.lazy(() => import("../pages/livingroom"));

const Router = () => {
    const routes = useRoutes([
        { path: '/', element: <LivingRoom /> },
    ]);
    return routes;
};

export default Router;
