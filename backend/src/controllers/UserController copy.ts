// src/controllers/UserController.ts
import { Request, Response } from "express";
import { userRepository } from "../repositories/UserRepository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authConfig from "../config/auth";

export class UserController {

    async register(req: Request, res: Response) {
        const { name, email, password } = req.body;

        try {
            const userExists = await userRepository.findOneBy({ email });
            if (userExists) return res.status(400).json({ message: "Email já cadastrado" });

            const hashedPassword = await bcrypt.hash(password, 8);

            const user = userRepository.create({ name, email, password: hashedPassword });
            await userRepository.save(user);

            return res.status(201).json({ message: "Usuário criado com sucesso" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao criar usuário" });
        }
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        try {
            const user = await userRepository.findOne({
                where: { email },
                select: ["id", "name", "email", "password"]
            });

            if (!user) return res.status(401).json({ message: "Email ou senha inválidos" });

            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) return res.status(401).json({ message: "Email ou senha inválidos" });

            const token = jwt.sign(
                { id: user.id, email: user.email, name: user.name },
                authConfig.secret as string,
                { expiresIn: authConfig.expiresIn }
            );

            return res.json({
                user: { id: user.id, name: user.name, email: user.email },
                token
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao fazer login" });
        }
    }

    // ====================== MÉTODOS CRUD (mantidos, mas limpos) ======================
    async createUser(req: Request, res: Response) {
        const { name, email, password } = req.body;
        try {
            const userExists = await userRepository.findOneBy({ email });
            if (userExists) {
                return res.status(400).json({ message: "Email already in use" });
            }

            const hashedPassword = await bcrypt.hash(password, 8);

            const user = userRepository.create({ name, email, password: hashedPassword });
            await userRepository.save(user);

            return res.status(201).json({ message: "User created successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Failed to create user" });
        }
    }

    async listUsers(req: Request, res: Response) {
        try {
            const users = await userRepository.find();
            return res.json(users);
        } catch (error) {
            return res.status(500).json({ message: "Failed to list users" });
        }
    }

    async listUserById(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const user = await userRepository.findOneBy({ id: Number(id) });
            if (!user) return res.status(404).json({ message: "User not found" });
            return res.json(user);
        } catch (error) {
            return res.status(500).json({ message: "Failed to list user" });
        }
    }

    async updateUser(req: Request, res: Response) {
        const { name, email, password } = req.body;
        const { id } = req.params;

        try {
            const user = await userRepository.findOneBy({ id: Number(id) });
            if (!user) return res.status(404).json({ message: "User not found" });

            if (email && email !== user.email) {
                const emailExists = await userRepository.findOneBy({ email });
                if (emailExists) return res.status(400).json({ message: "Email already in use" });
            }

            user.name = name || user.name;
            user.email = email || user.email;
            if (password) user.password = await bcrypt.hash(password, 8);

            await userRepository.save(user);
            return res.status(200).json({ message: "User updated successfully" });
        } catch (error) {
            return res.status(500).json({ message: "Failed to update user" });
        }
    }

    async deleteUser(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const user = await userRepository.findOneBy({ id: Number(id) });
            if (!user) return res.status(404).json({ message: "User not found" });

            await userRepository.softDelete(id);
            return res.status(200).json({ message: "User deleted successfully" });
        } catch (error) {
            return res.status(500).json({ message: "Failed to delete user" });
        }
    }
}