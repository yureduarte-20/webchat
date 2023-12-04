import { Request, Response, Router } from "express";
import DefaultRepository from "../repositories/DefaultRepository";

import { User } from "../entity";
import { inject, injectionTarget } from "../core/DI";
import { UserRepository } from "../repositories";
import { EXPRESS_ROUTER_BINDING_KEY, HASH_SERVICE_BINDING_KEY, JWT_SERVICE_BINDING_KEY } from "../core/binding-keys";
import { HashService } from "../services/HasherService";
import { ObjectId } from "mongodb";
import { AppDataSource } from "../data-source";
import { randomBytes } from "crypto";
import { JWTService } from "../services/JWTService";
import { RequestUserProfile } from "../middlewares/auth.middleware";

@injectionTarget()
export class UserController {
    constructor(
        @inject('UserRepository')
        private userRepository?: UserRepository,
        @inject(HASH_SERVICE_BINDING_KEY)
        private hashService?: HashService,
        @inject(JWT_SERVICE_BINDING_KEY)
        private jwtService?: JWTService
    ) {

    }
    async create(request: Request, response: Response) {
        console.log(request.body)
        const { body } = request;
        const user = new User()
        user.email = body.email;
        user.name = body.name;
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
            return response.status(404).json({ message: 'usuário não encontrado' })
        }
    }

    async profile(request: RequestUserProfile, response: Response) {
        const profile = await this.userRepository.findById(request.user.id);
        return response.json(profile)
    }
    async login(req: Request, response: Response) {
        const { email, password } = req.body
        if ((!email) || (!password)) return response.status(400).json({ message: 'Email e senhas precisam está preenchidos' })
        try {
            const user: User = await AppDataSource.manager.getRepository(User).createQueryBuilder()
                .addSelect('password')
                .addSelect('email')
                .addSelect('id')
                .where("email = :email")
                .setParameters({ email })
                .getRawOne()
            if (!user) throw new Error()

            if ((await this.hashService.compare(user.password, password))) {
                const token = await this.jwtService.genereteToken({ email: user.email, id: user.id })
                return response.json({ access_token: token })
            }
            return response.status(401).json({ message: 'Senha incorreta' })
        } catch (e) {
            console.log(e)
            return response.status(404).json({ message: 'usuário não encontrado' })
        }
    }
    async find(request: Request, response: Response) {
        const { name, email } = request.query;
        const contacts = await this.userRepository.findByEmailOrName(email as string, name as string);
        return response.json(contacts)
    }

    async update(request: RequestUserProfile, response: Response) {
        const { name } = request.body;
        console
        if (!name) return response.status(400).json({ message: 'O nome não pode ser nulo' })
        if (typeof name !== 'string') return response.status(400).json({ message: 'O nome precisa ser um texto' })
        if (name == '') return response.status(422).json({ message: 'O nome não pode vazio' })

        const savedUser = await this.userRepository.findById(request.user.id)
        savedUser.name = name;
        await this.userRepository.updateById(savedUser.id, savedUser)
        return response.status(204).send()
    }
    async changePassword(request: RequestUserProfile, response: Response) {
        const { password, confirmPassword } = request.body;
        if (!password || !confirmPassword) return response.status(400).json({ message: 'Senhas não podem estar vazias' })
        if (typeof password !== 'string') return response.status(400).json({ message: 'Senha precisa ser um texto' })
        if (password !== confirmPassword) return response.status(422).json({ message: 'Senhas não coincidem' })
        const user = await this.userRepository.findByIdWithPassword(request.user.id);
        user.password = await this.hashService.generateHash(password)
        await this.userRepository.updateById(user.id, user)
        return response.status(204).send()
    }
}