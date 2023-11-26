import bcrypt from 'bcrypt'
import { HashService } from './HasherService';

export class BcryptHashService implements HashService{
    generateHash(text: string): Promise<string> {
        return bcrypt.hash(text, 10)
    }
    compare(hash: string, text: string): Promise<Boolean> {
        return bcrypt.compare(text, hash);
    }
    
}