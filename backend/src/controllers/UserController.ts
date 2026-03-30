import { Request, Response } from "express"
import { userRepository } from "../repositories/UserRepository";

export class UserController {

    async createUser(req: Request, res: Response) {
        const { name, email, password } = req.body;
        try {
            const user = await userRepository.create({ name, email, password });
            const existingUserWithEmail = await userRepository.findOneBy({ email });
            if (existingUserWithEmail && existingUserWithEmail.id !== user.id) {
                return res.status(400).json({ message: "Email already in use" });
            }
            await userRepository.save(user);
            return res.status(201).json({ message: "User created successfully" }); // created
        } catch (error) {
            res.status(500).json({ message: "Failed to create user" });
        }
    }

    async listUsers(req: Request, res: Response) {
        try {
            const users = await userRepository.find();
            return res.json(users);
        } catch (error) {
            res.status(500).json({ message: "Failed to list users" });
        }
    }

    async listUserById(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const user = await userRepository.findOneBy({ id: Number(id) });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.json(user);
        } catch (error) {
            res.status(500).json({ message: "Failed to list users" });
        }
    }

    async updateUser(req: Request, res: Response) {
        const { name, email, password } = req.body;
        const { id } = req.params;

        try {
            const user = await userRepository.findOneBy({ id: Number(id) });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const existingUserWithEmail = await userRepository.findOneBy({ email });
            if (existingUserWithEmail && existingUserWithEmail.id !== user.id) {
                return res.status(400).json({ message: "Email already in use" });
            }
            user.name = String(name);
            user.email = String(email);
            user.password = String(password);
            await userRepository.update(id, user);
            return res.status(200).json({ message: "User updated successfully" });
        } catch (error) {
            res.status(500).json({ message: "Failed to update user" });
        }
    }

    async deleteUser(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const user = await userRepository.findOneBy({ id: Number(id) });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            await userRepository.update(id, { deleted_at: new Date() });
            await userRepository.softDelete(id);
            return res.status(200).json({ message: "User deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Failed to delete user" });
        }
    }
}