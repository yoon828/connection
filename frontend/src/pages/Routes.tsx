import React from "react";
import {
  BrowserRouter,
  Route,
  Routes as ReactRouterRoutes
} from "react-router-dom";
import Header from "./Header";

export default function Routes() {
  return (
    <BrowserRouter>
      <Header />
      <ReactRouterRoutes>
        <Route path="/" element={<div>main</div>} />
      </ReactRouterRoutes>
    </BrowserRouter>
  );
}
