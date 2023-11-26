
import { Entity, ObjectIdColumn, Column,ObjectId, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    age: number
    @Column({ unique: true})
    email: string
    @Column({ select: false, nullable: false })
    password:string;

}
