import { Request, Response, Router } from "express";
import DefaultRepository from "../repositories/DefaultRepository";

import { User } from "../entity";
import { inject, injectionTarget } from "../core/DI";
import { UserRepository } from "../repositories";
import { EXPRESS_ROUTER_BINDING_KEY, HASH_SERVICE_BINDING_KEY } from "../core/binding-keys";
import { HashService } from "../services/HasherService";
import { ObjectId } from "mongodb";

@injectionTarget()
export class UserController {
    constructor(
        @inject(UserRepository.repositoryName)
        private userRepository?: DefaultRepository<User, number>,
        @inject(HASH_SERVICE_BINDING_KEY)
        private hashService?: HashService
    ) {

    }
    async create(request: Request, response: Response) {
        console.log(request.body)
        const { body } = request;
        const user = new User()
        user.age = body.age;
        user.email = body.email;
        user.firstName = body.firstName;
        user.lastName = body.lastName
        user.password = await this.hashService.generateHash(body.password);

        if (await this.userRepository.exists({ where: { email: body.email } })) return response.status(422).json({ message: 'este email já sendo usado' })
        const saved = await this.userRepository.save(user)
        delete saved.password
        return response.status(201).json(saved)
    }
    async findById(request: Request, response: Response) {
        const { id }: { id?: string } = request.params
        if (!id) return response.status(400).send()
        try {
            const user = await this.userRepository.findById(parseInt(id))
            return response.json(user);
        } catch (e) {
            console.log(e)
            return response.status(400).json({ message: 'usuário não encontrado' })
        }
    }
}