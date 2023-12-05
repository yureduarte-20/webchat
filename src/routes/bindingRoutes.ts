import { Router } from "express"
import { Container } from "../core/DI"
import { UserController } from "../controllers/user.controller"
import ChatController from "../controllers/webchat.controller"
import { AUTH_MIDDLEWARE_BINDING_KEY, EXPRESS_ROUTER_BINDING_KEY } from "../core/binding-keys"
import { AuthMiddleware } from "../middlewares/auth.middleware"
import { ContactController } from "../controllers/contact.controller"

export function bindRoutes() {
    const router = Container.get<Router>(EXPRESS_ROUTER_BINDING_KEY);
    const userController = Container.get<UserController>('controllers.UserController')
    bindUserController(router, userController)
    bindContactsController(router, Container.get<ContactController>('controllers.ContactController'))
}
function bindUserController(router: Router, c: UserController) {
    const authMiddleware = Container.get<AuthMiddleware>(AUTH_MIDDLEWARE_BINDING_KEY);
    router.post("/api/users", (req, res) => c.create(req, res))
    router.get("/api/users/:id", (req, res, next) => authMiddleware.handle(req, res, next), (req, res) => c.findById(req, res))
    router.patch("/api/users/password", (req, res, next) => authMiddleware.handle(req, res, next), (req, res) => c.changePassword(req as any, res))
    router.patch("/api/users/:id", (req, res, next) => authMiddleware.handle(req, res, next), (req, res) => c.update(req as any, res))
    router.get("/api/users", (req, res, next) => authMiddleware.handle(req, res, next), (req, res) => c.find(req, res))
    router.get("/api/profile", (req, res, next) => authMiddleware.handle(req, res, next), (req, res) => c.profile(req as any, res))
    router.post("/api/login", (req, res) => c.login(req, res))
}

function bindContactsController(router: Router, c: ContactController){
    const authMiddleware = Container.get<AuthMiddleware>(AUTH_MIDDLEWARE_BINDING_KEY);
    router.post('/api/contacts', (req,res,next) => authMiddleware.handle(req,res,next), (req:any,res) => c.create(req,res))
    router.get('/api/contacts', (req,res,next) => authMiddleware.handle(req,res,next), (req:any,res) => c.findMyContacts(req,res))
}
