import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Task } from "./Task"

@Entity('users')
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "text" })
    name: string

    @Column({ type: "text", unique: true })
    email: string

    @Column({ type: "text" })
    password: string

    @CreateDateColumn({ type: "timestamptz" })
    created_at: Date

    @DeleteDateColumn({ type: "timestamp", nullable: true })
    deleted_at: Date
    /*
        @Column({ type: "text", nullable: true, default: "ativo" })
        status: string
    */
    @OneToMany(() => Task, task => task.user)
    tasks: Task[]

}
