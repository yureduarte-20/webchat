import { NextFunction, Request, Response } from "express";

export abstract class Middleware {
    abstract handle(request: Request, response: Response, next: NextFunction):void
}