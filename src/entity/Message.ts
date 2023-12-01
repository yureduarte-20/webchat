import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Contact } from "./Contact";
import { User } from "./User";

@Entity("messages")
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Contact, contact => contact.messages, { eager: true, onDelete: 'CASCADE', nullable:false })
    @JoinColumn({ name: 'contact_id' })
    contact: Contact;

    @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false, eager: true  })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'text', nullable: false })
    content: string;
    @CreateDateColumn({ name: 'created_at', type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;
    @UpdateDateColumn({ name: 'updated_at', type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date;
}