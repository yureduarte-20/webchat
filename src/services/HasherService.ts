export interface HashService{
    generateHash(text:string): Promise<string>;
    compare(hash:string, text:string):Promise<Boolean>
}