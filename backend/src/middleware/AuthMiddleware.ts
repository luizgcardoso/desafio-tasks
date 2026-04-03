// src/middleware/AuthMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import authConfig from '../config/auth';

// Extende o tipo Request do Express para incluir userId
declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  // Remove o "Bearer " do token
  const [, token] = authHeader.split(' ');

  if (!token) {
    return res.status(401).json({ message: "Token mal formatado" });
  }

  try {
    const decoded = jwt.verify(token, authConfig.secret) as { id: number };

    req.userId = decoded.id;   // Agora o TypeScript reconhece req.userId

    return next();
  } catch (err) {
    console.error("Erro ao verificar token:", err);
    return res.status(401).json({ message: "Token inválido" });
  }
};

export default authMiddleware;