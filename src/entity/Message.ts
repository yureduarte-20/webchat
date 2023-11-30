import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Contact } from "./Contact";

@Entity("messages")
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Contact, contact => contact.messages, { eager: true, onDelete:'CASCADE' })
    contact: Contact;

    @Column({ type: 'text', nullable: false })
    content: string;
    @CreateDateColumn({ name: 'created_at', type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;
    @UpdateDateColumn({ name: 'updated_at', type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date;
}