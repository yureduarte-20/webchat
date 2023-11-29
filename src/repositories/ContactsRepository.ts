import { EntityManager, EntityNotFoundError, FindManyOptions, FindOneOptions } from "typeorm";
import { inject, injectionTarget } from "../core/DI";
import { Contact } from "../entity/Contact";
import DefaultRepository from "./DefaultRepository";
import { ENTITY_MANAGER_BINDING_KEY } from "../core/binding-keys";
export class ContactNotFoundError extends Error {
    constructor(msg?: string) {
        super(msg ?? "Contato não encontrado")
    }
}
@injectionTarget()
export default class ContactRepository implements DefaultRepository<Contact, typeof Contact.prototype.id>{
    constructor(
        @inject(ENTITY_MANAGER_BINDING_KEY)
        private entityManager?: EntityManager
    ) {

    }
    findOneOrFail(criteria:any): Promise<Contact> {
        try {
            return this.entityManager.getRepository(Contact).findOneOrFail(criteria)
        } catch (e) {
            if (e instanceof EntityNotFoundError) {
                throw new ContactNotFoundError()
            }
            throw e
        }
    }
    save(data: Contact): Promise<Contact> {
        return this.entityManager.getRepository(Contact).save(data)
    }
    findById(id: number): Promise<Contact> {
        try {
            return this.entityManager.getRepository(Contact).findOneByOrFail({ id })
        } catch (e) {
            if (e instanceof EntityNotFoundError) {
                throw new ContactNotFoundError()
            }
            throw e
        }
    }
    find(criteria: FindManyOptions<Contact>): Promise<Contact[]> {
        return this.entityManager.getRepository(Contact).find(criteria)
    }
    findOne(criteria: FindOneOptions<Contact>): Promise<Contact> {
        return this.entityManager.getRepository(Contact).findOne(criteria)
    }
    updateById(id: number, data: Partial<Contact>): Promise<void> {
        this.entityManager.getRepository(Contact).update({ id }, data)
        return
    }
    deleteById(id: number): Promise<void> {
        this.entityManager.getRepository(Contact).delete({ id })
        return
    }
    exists(criteria: FindManyOptions<Contact>): Promise<boolean> {
        return this.entityManager.getRepository(Contact).exist(criteria)
    }

}