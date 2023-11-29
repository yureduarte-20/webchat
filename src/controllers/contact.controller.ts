import { Response } from "express-serve-static-core";
import { inject, injectionTarget } from "../core/DI";
import { RequestUserProfile } from "../middlewares/auth.middleware";
import ContactRepository from "../repositories/ContactsRepository";
import DefaultRepository from "../repositories/DefaultRepository";
import { Contact } from "../entity/Contact";
import { UserNotFoundError, UserRepository } from "../repositories";
import { FindOneOptions } from "typeorm";
import { User } from "../entity";
import { json } from "body-parser";

@injectionTarget()
export class ContactController {
    constructor(
        @inject("ContactRepository")
        private contactRepository?: DefaultRepository<Contact, typeof Contact.prototype.id>,
        @inject("UserRepository")
        private userRepository?: UserRepository
    ){

    }

    async create(request : RequestUserProfile, response: Response){
        const { contactEmail } = request.body;
        const search : FindOneOptions<User> = { where:{ email: contactEmail }, relationLoadStrategy: 'join', relations:[] }
        try{
            const userContact = await this.userRepository.findOne(search)
            const searchContatc: FindOneOptions<Contact> = { where: { destinationUserId: userContact.id, userId: request.user.id } }
            const contactExists = await this.contactRepository.findOne(searchContatc)
            if(contactExists) return response.status(422).json({ message: 'Você já tem esse contato cadastrado' })
            let contact = new Contact()
            contact.destinationUserId = userContact.id
            contact.userId = request.user.id
            contact = await this.contactRepository.save(contact);
            return response.status(201).json(contact)
        } catch(e){
            if(e instanceof UserNotFoundError){
                return response.status(404).json({ message: e.message })
            }
            return response.status(500).json({ message: 'Erro no servidor' })
        }
    }
}