import { ObjectId, EntityManager, FindOperator, FindOneOptions,  } from "typeorm";
import { User } from "../entity";
import DefaultRepository from "./DefaultRepository";

export default class UserRepository implements DefaultRepository<User, ObjectId>{
    constructor(
        private entityManager: EntityManager
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
        this.entityManager.delete(User, { id })
        return;
    }

    async save(data: User): Promise<User> {
        return this.entityManager.save<User>(data)
    }
    
    
}