import * as CryptoJS from 'crypto-js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CryptoService {
    constructor() { }

    // The set method is use for encrypt the value.
    set(keys, value) {
        const key = CryptoJS.enc.Utf8.parse(keys);
        const iv = CryptoJS.enc.Utf8.parse(keys);
        const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
            {
                keySize: 128 / 8,
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });

        return encrypted.toString();
    }

    // The get method is use for decrypt the value.
    get(keys, value) {
        const key = CryptoJS.enc.Utf8.parse(keys);
        const iv = CryptoJS.enc.Utf8.parse(keys);
        const decrypted = CryptoJS.AES.decrypt(value, key, {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        return decrypted.toString(CryptoJS.enc.Utf8);
    }

    toUTF8Array(str) {
        let utf8 = [];
        for (let i = 0; i < str.length; i++) {
            let charcode = str.charCodeAt(i);
            if (charcode < 0x80) { utf8.push(charcode); }
            else if (charcode < 0x800) {
                utf8.push(0xc0 | (charcode >> 6),
                    0x80 | (charcode & 0x3f));
            } else if (charcode < 0xd800 || charcode >= 0xe000) {
                utf8.push(0xe0 | (charcode >> 12),
                    0x80 | ((charcode >> 6) & 0x3f),
                    0x80 | (charcode & 0x3f));
            } else {
                i++;
                charcode = ((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff)
                utf8.push(0xf0 | (charcode >> 18),
                    0x80 | ((charcode >> 12) & 0x3f),
                    0x80 | ((charcode >> 6) & 0x3f),
                    0x80 | (charcode & 0x3f));
            }
        }
        return utf8;
    }
}
