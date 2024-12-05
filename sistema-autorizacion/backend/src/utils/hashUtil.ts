import bcrypt from 'bcryptjs';

// Generar un hash para contraseñas
export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 12);
};

// Comparar contraseñas con su hash
export const comparePassword = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash);
};