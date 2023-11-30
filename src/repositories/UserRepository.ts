import { EntityManager, FindOperator, FindOneOptions, MongoRepository, MongoEntityManager, EntityNotFoundError, } from "typeorm";
import { User } from "../entity";
import DefaultRepository from "./DefaultRepository";
import { Container, inject, injectionTarget } from "../core/DI";

import { AppDataSource } from "../data-source";
import { ENTITY_MANAGER_BINDING_KEY } from "../core/binding-keys";
import { ObjectId } from "mongodb";

export class UserNotFoundError extends Error {
    constructor(msg?: string) {
        super(msg ?? "Usuário não encontrado")
    }
}

@injectionTarget()
export class UserRepository implements DefaultRepository<User, typeof User.prototype.id>{
    static repositoryName: "UserRepository"
    constructor(
        @inject(ENTITY_MANAGER_BINDING_KEY)
        private entityManager?: MongoEntityManager
    ) {

    }
    findOneOrFail(criteria: FindOneOptions<User>): Promise<User> {
        try {
            return this.entityManager.getRepository(User).findOneOrFail(criteria)
        } catch (e) {
            if (e instanceof EntityNotFoundError) {
                throw new UserNotFoundError()
            }
            throw e;
        }
    }
    findOne(criteria: any): Promise<User> {
        return this.entityManager.getRepository(User).findOne(criteria)
    }
    async exists(operator: FindOneOptions<User>): Promise<boolean> {
        return this.entityManager.getRepository(User).exist(operator)
    }
    findById(id: number): Promise<User> {
        try {

            return this.entityManager.getRepository(User).findOneOrFail({
                where: {
                    id: id
                }
            })
        } catch (e) {
            if (e instanceof EntityNotFoundError) {
                throw new UserNotFoundError()
            }
            throw e
        }
    }
    find(filter: any): Promise<User[]> {
        return this.entityManager.find(User, filter)
    }
    updateById(id: number, data: Partial<User>): Promise<void> {
        this.entityManager.update<User>(User, { id }, data)
        return;
    }
    deleteById(id: number): Promise<void> {
        this.entityManager.delete(User, id)
        return;
    }

    async save(data: User): Promise<User> {
        return this.entityManager.save<User>(data)
    }



}