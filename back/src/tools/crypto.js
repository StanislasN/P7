const { CRYPTO_ALGO, CRYPTO_KEY } = process.env;
const crypto = require("crypto");
module.exports = class Crypto {
    constructor() {
        this.algorithm = CRYPTO_ALGO;
        this.key = CRYPTO_KEY; // 16 char
        this.iv = Buffer.from(CRYPTO_KEY)// 16 char
    }

    encrypt(text) {
        let cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return encrypted.toString("hex");
    }

    decrypt(text) {
        let encryptedText = Buffer.from(text, "hex");
        let decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
}