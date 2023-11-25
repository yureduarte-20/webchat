export default interface DefaultRepository<T, I> {
    save(data: T):Promise<T>
    findById(id: I): Promise<T>;
    find(filter: any): Promise<T[]>;
    updateById(id: I, data: Partial<T>): Promise<void>;
    deleteById(id: I):Promise<void>;
    exists(id:any):Promise<boolean>;
}