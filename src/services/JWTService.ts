import { sign, decode, verify, JwtPayload } from 'jsonwebtoken'
import { User } from '../entity'
const JWT_SECRET = process.env.JWT_SECRET || 'segredo secreto'
export type IUserProfile = Pick<User, 'email' | 'id'>
export class InvalidTokenError extends Error {
    ERROR_CODE:string = "TOKEN_EXPIRED"
    constructor(msg?: string) {
        super(msg ?? 'Token inválido')
    }
}
export class JWTService {
    constructor() {

    }
    async genereteToken(user: IUserProfile): Promise<string> {
        return new Promise((res, rej) => {
            sign(user, JWT_SECRET, {
                expiresIn: 3600
            }, (e, encoded) => {
                if (e) return rej(e)
                return res(encoded)
            })
        })
    }

    async verifyToken(token: string): Promise<IUserProfile> {
        return new Promise((res, rej) => {
            verify(token, JWT_SECRET, function (err, decoded:any) {
                if (err) return rej(new InvalidTokenError(err.message))
                res({ id: decoded.id, email: decoded.email })
            });
        })
    }
}