import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import authConfig from '../config/auth';

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Token não fornecido ou mal formatado" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, authConfig.secret as string) as { id: number };
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error("Token inválido:", err);
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
};

export default authMiddleware;