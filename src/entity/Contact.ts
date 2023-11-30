import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { Message } from "./Message";

@Entity({ name:"contacts" })
export class Contact {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.contacts, { nullable: false, onDelete: 'CASCADE', eager: true })
    @JoinColumn({ name: 'user_id' })
    user:User

    @ManyToOne(() => User, { eager: true, nullable: false, onDelete: 'CASCADE'  })
    @JoinColumn({ name: 'user_destination_id' })
    userDestination: User;

    @OneToMany(() => Message, message => message.contact)
    messages: Message[]

    @CreateDateColumn({ name: 'created_at', type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;
    @UpdateDateColumn({ name: 'updated_at', type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date;

    atr:any
}
