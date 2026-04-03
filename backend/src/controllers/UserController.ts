import { Request, Response } from "express";
import { userRepository } from "../repositories/UserRepository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authConfig from "../config/auth";

export class UserController {

    async register(req: Request, res: Response) {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Nome, email e senha são obrigatórios" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "A senha deve ter no mínimo 6 caracteres" });
        }

        try {
            const userExists = await userRepository.findOneBy({ email });
            if (userExists) {
                return res.status(409).json({ message: "Email já cadastrado" });
            }

            const hashedPassword = await bcrypt.hash(password, 8);

            const user = userRepository.create({ name, email, password: hashedPassword });
            await userRepository.save(user);

            return res.status(201).json({
                success: true,
                message: "Usuário criado com sucesso"
            });
        } catch (error) {
            console.error("Erro no register:", error);
            return res.status(500).json({
                success: false,
                message: "Erro interno ao criar usuário"
            });
        }
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email e senha são obrigatórios" });
        }

        try {
            const user = await userRepository.findOne({
                where: { email },
                select: ["id", "name", "email", "password"]
            });

            if (!user) {
                return res.status(401).json({ message: "Email ou senha inválidos" });
            }

            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                return res.status(401).json({ message: "Email ou senha inválidos" });
            }

            const token = jwt.sign(
                { id: user.id, email: user.email, name: user.name },
                authConfig.secret as string,
                { expiresIn: authConfig.expiresIn }
            );

            return res.json({
                success: true,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
                token,
            });
        } catch (error) {
            console.error("Erro no login:", error);
            return res.status(500).json({
                success: false,
                message: "Erro interno ao fazer login"
            });
        }
    }
}