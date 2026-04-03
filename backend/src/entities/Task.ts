import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { User } from "./User"

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "text" })
    title: string

    @Column({ type: "text" })
    description: string

    @CreateDateColumn({ type: "timestamptz" })
    created_at: Date

    @Column({ type: "timestamptz", nullable: true })
    started_at: Date | null

    @Column({ type: "timestamptz", nullable: true })
    finished_at: Date | null

    @DeleteDateColumn({ type: "timestamptz", nullable: true })
    deleted_at: Date | null

    @Column({ type: "text", default: "pendente" })
    status: string

    @ManyToOne(() => User, user => user.tasks)
    @JoinColumn({ name: "user_id" })
    user: User
}
