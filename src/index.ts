import { AppDataSource } from "./data-source"
import { User } from "./entity/User"
import { startServer } from "./server"
import "../src/core/dependencies";
import { run } from "../src/core/dependencies";
import "reflect-metadata";
const port = 3000;
AppDataSource.initialize().then(async () => {
    startServer(port, run)
}).catch(error => console.log(error))