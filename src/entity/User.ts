
import { Entity, ObjectIdColumn, Column,ObjectId, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string
    
    @Column({ unique: true})
    email: string
    @Column({ select: false, nullable: false })
    password:string;

}
