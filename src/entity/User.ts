
import { Entity, CreateDateColumn, UpdateDateColumn, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany } from "typeorm"
import { Contact } from "./Contact"

@Entity("users")
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({  nullable:false})
    name: string;

    @Column({ unique: true, nullable:false })
    email: string
    
    @OneToMany(() => Contact, contact => contact.user)
    contacts: Contact[]
    
    @Column({ select: false, nullable: false })
    password: string;

    @CreateDateColumn({ name: 'created_at', type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;
    @UpdateDateColumn({ name: 'updated_at', type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date;
}
