import { AppDataSource } from "../data-source"

export default abstract class DefaultRepository<T, I> {
    abstract save(data: T):Promise<T>
    abstract findById(id: I): Promise<T>;
    abstract find(criteria: any): Promise<T[]>;
    abstract updateById(id: I, data: Partial<T>): Promise<void>;
    abstract deleteById(id: I):Promise<void>;
    abstract exists(criteria:any):Promise<boolean>;
}