import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CodificadorService {
    private readonly clave: Buffer;
    private readonly ivLength: number = 16; // Longitud fija del IV

    constructor(private configuraciones: ConfigService) {
        const claveSecreta = process.env.CLAVE_ENCRIPTACION ?? '987654321';
        this.clave = crypto.createHash('sha256').update(claveSecreta).digest().slice(0, 16); // Genera y almacena la clave
    }

    cifrar(texto: string): string {
        const iv = crypto.randomBytes(this.ivLength);
        const cipher = crypto.createCipheriv('aes-128-cbc', this.clave, iv);
        let encrypted = cipher.update(texto, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return `${iv.toString('hex')}:${encrypted}`; // Retorna el texto cifrado con el IV concatenado
    }

    descifrar(textoCifrado: string): string {
        const [ivString, encryptedText] = textoCifrado.split(':');
        const iv = Buffer.from(ivString, 'hex');
        const decipher = crypto.createDecipheriv('aes-128-cbc', this.clave, iv);
        let decrypted: Buffer = decipher.update(Buffer.from(encryptedText, 'hex'));
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString('utf8');
    }
}
