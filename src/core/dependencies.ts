import { Socket } from "socket.io";
import ChatController from "../controllers/websocket.controller";
import { app, io } from "../server";
import { EventManager } from "../services/EventManager";
import { AppDataSource } from "../data-source";
import { UsersController } from "../controllers/user.controller";
import UserRepository from "../repositories/UserRepository";
import { Router, json } from "express";

const run = async () =>{
    const router = Router()
    const eventManager = EventManager.getInstance()

    // repository
    const entityManager = AppDataSource.manager;
    const userRepository = new UserRepository(entityManager);
    const websockerController = new ChatController(io, eventManager );
    const userController = new UsersController(router, userRepository)
    eventManager.subscribe({ listener: websockerController, eventNameListener: 'connection' })
    // Rotas
    app.use(json())
    app.use(router)

    // eventos 
    io.on("connection", (socket: any) =>{
        eventManager.notify("connection", socket)    
    })

    const getControllers = () => ({ userController  })
    return {
        getControllers
    }
}

export {
    run
}