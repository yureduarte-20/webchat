import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { Middleware } from "./middleware";
import { inject, injectionTarget } from "../core/DI";
import { IUserProfile, JWTService } from "../services/JWTService";
import { JWT_SERVICE_BINDING_KEY } from "../core/binding-keys";
export type RequestUserProfile = Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>> & { user: IUserProfile}
@injectionTarget()
export class AuthMiddleware extends Middleware {
    constructor(
        @inject(JWT_SERVICE_BINDING_KEY)
        private jwtService?: JWTService
    ) {
        super();
    }
    async handle(request: any, response: Response<any, Record<string, any>>, next: NextFunction) {
        const authorizarion = request.headers.authorization;
        if (!authorizarion) return response.status(401).json({ message: 'Está faltando o token na requisição ' });
        const token = this.extractToken(authorizarion)
        if (!token) return response.status(400).json({ message: 'token em formato inválido' });
        try{
            const profile = await this.jwtService.verifyToken(token);
            request.user = profile
            next()
        }catch(e){
            return response.status(401).json({ message: 'Token inválido' })    
        }
    }
    private extractToken(data: string) : string | null {
        return data.includes("Bearer ") ? data.replace("Bearer ", "") : null
    }
} 