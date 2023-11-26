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
import { ENTITY_MANAGER_BINDING_KEY, EXPRESS_ROUTER_BINDING_KEY, SOCKET_IO_BINDING_KEY } from "./binding-keys";
const eventManager = EventManager.getInstance()

// repository
const run = async () =>{
    Container.register(BINDING_KEY, EventManager.getInstance());   
    Container.register(ENTITY_MANAGER_BINDING_KEY, AppDataSource.mongoManager)
    Container.register(EXPRESS_ROUTER_BINDING_KEY, router);
    Container.register(SOCKET_IO_BINDING_KEY, io);
    Container.register('UserRepository', new UserRepository())
    
    const uc = new UserController();
    const ws = new ChatController()
    Container.register('controllers.UserController', uc);
    app.use(router)
    // eventos 
    io.on("connection", (socket: any) =>{
        eventManager.notify("connection", socket)    
    })

}

export {
    run
}