import { Request, Response, Router } from "express";
import DefaultRepository from "../repositories/DefaultRepository";
import { ObjectId } from "typeorm";
import { User } from "../entity";

export class UsersController {
    constructor(
        private router: Router,
        private userRepository:DefaultRepository<User, ObjectId>
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