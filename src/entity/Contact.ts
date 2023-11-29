import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";

@Entity({ name:"contacts" })
export class Contact {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User)
    @JoinColumn({ name:'user_id', foreignKeyConstraintName:'FK_OWNER_CONTACT_USER_CONSTRAINT' })
    userId: number;
    
    @ManyToOne(type => User)
    @JoinColumn({ name:'destination_user_id', foreignKeyConstraintName:'FK_USER_CONTACT_OWNER_CONSTRAINT' })
    destinationUserId: number;

    @CreateDateColumn({ name: 'created_at', type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;
    @UpdateDateColumn({ name: 'updated_at', type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date;
}
