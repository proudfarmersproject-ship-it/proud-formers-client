import { useState } from "react";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router-dom";
import { userRoutes } from "./routes/user.routes";
import { adminRoutes } from "./routes/admin.routes";

const router = createBrowserRouter([
  userRoutes, // default route
  adminRoutes, // admin routes
]);
function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
