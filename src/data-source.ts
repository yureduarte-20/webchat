import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { entitiesArray } from "./entity"

export const AppDataSource = new DataSource({
    type: "mongodb",
    url:"mongodb://user:12345678@localhost:27017/?authMechanism=DEFAULT" ,
    synchronize: true,
    logging: false,
    entities: entitiesArray,
    migrations: [],
    subscribers: [],
})
