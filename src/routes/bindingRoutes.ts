import { Router } from "express"
import { Container } from "../core/DI"
import { UserController } from "../controllers/user.controller"
import ChatController from "../controllers/webchat.controller"
import { EXPRESS_ROUTER_BINDING_KEY } from "../core/binding-keys"

export function bindRoutes() {
    const router = Container.get<Router>(EXPRESS_ROUTER_BINDING_KEY);
    const userController = Container.get<UserController>('controllers.UserController')
    bindUserController(router, userController)
}
function bindUserController(router: Router, c: UserController) {
    router.post("/users", (req, res) => c.create(req, res))
    router.get("/users/:id", (req, res) => c.findById(req, res))
    router.post("/login", (req,res) => c.login(req, res))
}
