import { Router } from "express"
import { Container } from "../core/DI"
import { UserController } from "../controllers/user.controller"
import ChatController from "../controllers/webchat.controller"
import { AUTH_MIDDLEWARE_BINDING_KEY, EXPRESS_ROUTER_BINDING_KEY } from "../core/binding-keys"
import { AuthMiddleware } from "../middlewares/auth.middleware"

export function bindRoutes() {
    const router = Container.get<Router>(EXPRESS_ROUTER_BINDING_KEY);
    const userController = Container.get<UserController>('controllers.UserController')
    bindUserController(router, userController)
}
function bindUserController(router: Router, c: UserController) {
    const authMiddleware = Container.get<AuthMiddleware>(AUTH_MIDDLEWARE_BINDING_KEY);
    router.post("/users", (req, res) => c.create(req, res))
    router.get("/users/:id", (req, res, next) => authMiddleware.handle(req, res, next), (req, res) => c.findById(req, res))
    router.get("/profile", (req, res, next) => authMiddleware.handle(req, res, next), (req, res) => c.profile(req as any, res))
    router.post("/login", (req, res) => c.login(req, res))
}
