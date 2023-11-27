import { Socket } from "socket.io";
import ChatController from "../controllers/webchat.controller";
import { app, io } from "../server";
import { BINDING_KEY, EventManager } from "../services/EventManager";
import { AppDataSource } from "../data-source";
import { UserController } from "../controllers/user.controller";
import { UserRepository, repositories } from "../repositories";
import { Router, json } from "express";
import { router } from "../routes";
import { Container } from "./DI";
import { AUTH_MIDDLEWARE_BINDING_KEY, ENTITY_MANAGER_BINDING_KEY, EXPRESS_ROUTER_BINDING_KEY, HASH_SERVICE_BINDING_KEY, JWT_SERVICE_BINDING_KEY, SOCKET_IO_BINDING_KEY } from "./binding-keys";
import { bindRoutes } from "../routes/bindingRoutes";
import { BcryptHashService } from "../services/Bcrypt";
import { JWTService } from "../services/JWTService";
import { AuthMiddleware } from "../middlewares/auth.middleware";
const eventManager = EventManager.getInstance()

// repository
const run = async () =>{
    //Services
    Container.register(BINDING_KEY, EventManager.getInstance());   
    Container.register(ENTITY_MANAGER_BINDING_KEY, AppDataSource.manager)
    Container.register(EXPRESS_ROUTER_BINDING_KEY, router);
    Container.register(SOCKET_IO_BINDING_KEY, io);
    Container.register(HASH_SERVICE_BINDING_KEY, new BcryptHashService())
    Container.register(JWT_SERVICE_BINDING_KEY, new JWTService());
    
    //Middlewares
    Container.register(AUTH_MIDDLEWARE_BINDING_KEY, new AuthMiddleware())
    // Repositorios
    Container.register('UserRepository', new UserRepository())
    Container.register('controllers.UserController', new UserController());
    Container.register('controllers.ChatController', new ChatController());
    // Associar as rotas
    bindRoutes()
    //USar as rotas
    app.use(router)
    // eventos 
    io.on("connection", (socket: any) =>{
        eventManager.notify("connection", socket)    
    })

}

export {
    run
}