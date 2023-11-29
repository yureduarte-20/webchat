import { FindManyOptions } from "typeorm";
import { AppDataSource } from "../data-source"

export default interface DefaultRepository<T, I> {
    save(data: T):Promise<T>
    findById(id: I): Promise<T>;
    find(criteria: any): Promise<T[]>;
    findOneOrFail(criteria:any): Promise<T>
    updateById(id: I, data: Partial<T>): Promise<void>;
    deleteById(id: I):Promise<void>;
    exists(criteria:any):Promise<boolean>;
    findOne(criteria:any) : Promise<T|null>
}