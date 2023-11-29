import { Response } from "express-serve-static-core";
import { inject, injectionTarget } from "../core/DI";
import { RequestUserProfile } from "../middlewares/auth.middleware";
import ContactRepository from "../repositories/ContactsRepository";
import DefaultRepository from "../repositories/DefaultRepository";
import { Contact } from "../entity/Contact";
import { UserRepository } from "../repositories";
import { EntityNotFoundError, FindManyOptions, FindOneOptions } from "typeorm";
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
        const search : FindOneOptions<User> = { where:{ email: contactEmail } }
        try{
            const userContact = await this.userRepository.findOne(search)
            const searchContatc: FindOneOptions<Contact> = { where: { destinationUserId: userContact.id, userId: request.user.id } }
            const contact = await this.contactRepository.findOne(searchContatc)
            if(contact) return response.status(422).json({ message: 'Você já tem esse contato cadastrado' })
        } catch(e){
            if(e instanceof EntityNotFoundError){
                return response.status(404).json({ message: e.message })
            }
            return response.status(500).json({ message: 'Erro no servidor' })
        }
    }
}