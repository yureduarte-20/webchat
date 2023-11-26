import DefaultRepository from './DefaultRepository';
import { UserRepository } from './UserRepository';

export * from './UserRepository';
export const repositories  = [
    UserRepository
];