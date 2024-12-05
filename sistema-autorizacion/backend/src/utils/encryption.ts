import crypto from 'crypto';

// Clave secreta para el cifrado
const secretKey = process.env.SECRET_KEY || 'default_secret_key';  // Usar la clave secreta desde el archivo .env

// Cifrado de datos (AES-256-CBC)
export const encryptData = async (data: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const iv = crypto.randomBytes(16); // Generar un vector de inicialización aleatorio
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey, 'utf-8'), iv);
    let encryptedData = cipher.update(data, 'utf8', 'hex');
    encryptedData += cipher.final('hex');
    const ivString = iv.toString('hex'); // Convertir el IV a string para almacenarlo junto al dato cifrado
    resolve(`${ivString}:${encryptedData}`);
  });
};

// Descifrado de datos
export const decryptData = async (encryptedData: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const [ivString, data] = encryptedData.split(':'); // Separar IV y datos cifrados
    const iv = Buffer.from(ivString, 'hex'); // Convertir el IV de string a Buffer
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey, 'utf-8'), iv);
    let decryptedData = decipher.update(data, 'hex', 'utf8');
    decryptedData += decipher.final('utf8');
    resolve(decryptedData);
  });
};
