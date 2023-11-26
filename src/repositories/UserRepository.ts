import { EntityManager, FindOperator, FindOneOptions, MongoRepository, MongoEntityManager,  } from "typeorm";
import { User } from "../entity";
import DefaultRepository from "./DefaultRepository";
import { Container, inject, injectionTarget } from "../core/DI";

import { AppDataSource } from "../data-source";
import { ENTITY_MANAGER_BINDING_KEY } from "../core/binding-keys";
import { ObjectId } from "mongodb";



@injectionTarget()
export class UserRepository extends DefaultRepository<User, number>{
    static repositoryName: "UserRepository"
    constructor(
        @inject(ENTITY_MANAGER_BINDING_KEY)
        private entityManager?: MongoEntityManager
    ){
        super();
    }
    async exists(operator:FindOneOptions<User>): Promise<boolean> {
        const user =  await this.entityManager.findOne(User, operator)
        return user !== null;
    }
    findById(id: number): Promise<User> {
        return this.entityManager.getRepository(User).findOneOrFail({
            where:{
                id: id
            }
        })
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