import crypto from 'crypto';
export const GenerateToken = () => {
    const token = crypto.randomBytes(32).toString('hex');
    return token;
}