import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../database/data-source";
import { User } from "../entities/User";

const userRepository = AppDataSource.getRepository(User);

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await userRepository.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "Email já cadastrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const user = userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await userRepository.save(user);

    res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao cadastrar usuário" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Email ou senha inválidos" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email ou senha inválidos" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao fazer login" });
  }
};