import { Request, Response, Router } from "express";
import DefaultRepository from "../repositories/DefaultRepository";
import { ObjectId } from "typeorm";
import { User } from "../entity";
import { inject, injectionTarget } from "../core/DI";
import { UserRepository } from "../repositories";
import { EXPRESS_ROUTER_BINDING_KEY } from "../core/binding-keys";

@injectionTarget()
export class UserController {
    constructor(
        @inject(EXPRESS_ROUTER_BINDING_KEY)
        private router?: Router,
        @inject("UserRepository")
        private userRepository?:DefaultRepository<User, ObjectId>,
    ){
        this.router.post("/users", (req,res) => this.create(req, res))
        this.router.get("/users/:id", (req, res) => this.findById(req, res))
    }
    async create(request: Request, response:Response){
        console.log(request.body)
        const {body} = request;
        const user  = new User()
        user.age = body.age;
        user.email = body.email;
        user.firstName = user.firstName;
        user.lastName = body.lastName
        if(await this.userRepository.exists({ where:{ email: body.email } })) return response.status(422).json({ message: 'este email já sendo usado' })
        const saved =  await this.userRepository.save(user)
        return response.status(201).json(saved)
    }
    async findById(request: Request, response:Response){
        const {id} =  request.params
        if(!id) return response.status(400).send()
        try{
            const user = await this.userRepository.findById(new ObjectId(id))
            return response.json(user);
        }catch(e){
            return response.status(400).json({ message:'usuário não encontrado' })
        }
    }
}