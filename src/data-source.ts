import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { entitiesArray } from "./entity"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: 'localhost',
    port: 3306 ,
    username: 'root',
    password:'password',
    database: 'chat',
    synchronize: true,
    logging: true,
    entities: entitiesArray,
    migrations: [],
    subscribers: [],
})
