import jwt from 'jsonwebtoken';
import { IJwtPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '15m';
const JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || '7d';

export class JwtService {
  // Générer un access token
  static generateAccessToken(payload: IJwtPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRE,
    });
  }

  // Générer un refresh token
  static generateRefreshToken(payload: IJwtPayload): string {
    return jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRE,
    });
  }

  // Générer les deux tokens
  static generateTokens(payload: IJwtPayload) {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  // Vérifier un access token
  static verifyAccessToken(token: string): IJwtPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as IJwtPayload;
    } catch (error) {
      throw new Error('Invalid or expired access token');
    }
  }

  // Vérifier un refresh token
  static verifyRefreshToken(token: string): IJwtPayload {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET) as IJwtPayload;
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  // Décoder un token sans le vérifier (pour les logs)
  static decodeToken(token: string) {
    return jwt.decode(token);
  }
}
