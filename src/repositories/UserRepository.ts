import { ObjectId, EntityManager, FindOperator, FindOneOptions, MongoRepository, MongoEntityManager,  } from "typeorm";
import { User } from "../entity";
import DefaultRepository from "./DefaultRepository";
import { Container, inject, injectionTarget } from "../core/DI";

import { AppDataSource } from "../data-source";
import { ENTITY_MANAGER_BINDING_KEY } from "../core/binding-keys";



@injectionTarget()
export class UserRepository implements DefaultRepository<User, ObjectId>{
    static repositoryName: "UserRepository"
    constructor(
        @inject(ENTITY_MANAGER_BINDING_KEY)
        private entityManager?: MongoEntityManager
    ){

    }
    async exists(operator:FindOneOptions<User>): Promise<boolean> {
        const user =  await this.entityManager.findOne(User, operator)
        return user !== null;
    }
    findById(id: ObjectId): Promise<User> {
        return this.entityManager.findOneByOrFail<User>(User, { id: id })
    }
    find(filter: any): Promise<User[]> {
        return this.entityManager.find(User, filter)
    }
    updateById(id: ObjectId, data: Partial<User>): Promise<void> {
        this.entityManager.update<User>(User, { id: id }, data)
        return;
    }
    deleteById(id: ObjectId): Promise<void> {
        this.entityManager.delete(User, id)
        return;
    }

    async save(data: User): Promise<User> {
        return this.entityManager.save<User>(data)
    }
    
    
}