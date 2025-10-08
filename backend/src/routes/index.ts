import helloRoutes from "./hello.routes";
import authRoutes from "./auth.routes";

export const routes = [
    { path: "/api/v1/hello", router: helloRoutes },
    { path: "/api/v1/auth", router:  authRoutes },
];