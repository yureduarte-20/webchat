import { Response } from "express-serve-static-core";
import { inject, injectionTarget } from "../core/DI";
import { RequestUserProfile } from "../middlewares/auth.middleware";
import ContactRepository from "../repositories/ContactsRepository";
import DefaultRepository from "../repositories/DefaultRepository";
import { Contact } from "../entity/Contact";
import { UserNotFoundError, UserRepository } from "../repositories";
import { FindOneOptions, In } from "typeorm";
import { User } from "../entity";
import { json } from "body-parser";
import { Request } from "express";

@injectionTarget()
export class ContactController {
    constructor(
        @inject("ContactRepository")
        private contactRepository?: ContactRepository,
        @inject("UserRepository")
        private userRepository?: UserRepository
    ) {

    }

    async create(request: RequestUserProfile, response: Response) {
        const { contactEmail } = request.body;
        try {
            const contactToUser = await this.userRepository.findOneOrFail({ where: { email: contactEmail } })
            const searchContatc: FindOneOptions<Contact> = { where: { user: { id: request.user.id }, userDestination: { email: contactEmail } } };
            const contactExists = await this.contactRepository.findOne(searchContatc)
            console.log(contactExists)
            if (contactExists) return response.status(422).json({ message: 'Você já tem esse contato cadastrado' })
            let contact = new Contact()
            contact.user = await this.userRepository.findById(request.user.id);
            contact.userDestination = contactToUser
            contact = await this.contactRepository.save(contact);
            return response.status(201).json(contact)
        } catch (e) {
            if (e instanceof UserNotFoundError) {
                return response.status(404).json({ message: e.message })
            }
            console.log(e)
            return response.status(500).json({ message: 'Erro no servidor' })
        }
    }

    async find(request: RequestUserProfile, response: Response) {
        this.userRepository.find({})
        const contacts = await this.contactRepository.findOneByUserOrDestinationUser(request.user.id, request.user.id)
        return response.json(contacts)
    }
}