import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Mail, MailOptions } from './mail.entity';
import { Log } from '../logger/logger';
import { FindManyOptions, Repository, DeepPartial, UpdateResult, FindOperator, In } from 'typeorm';
import * as nodemailer from 'nodemailer';
import { AppProperties } from '../config/app-properties.model';
import * as path from 'path';
import * as fs from 'fs';
import { CryptoService } from '../crypto/crypto';

@Injectable()
export class MailService {
    constructor(private cryptoService: CryptoService) { }

    async sendMail(email: Mail) {
        let result: string;
        const templateFolder = path.resolve(process.cwd(), 'src/mail/template/' + email.template + '.html');
        // console.log(templateFolder);

        const self = this;

        if (!this.filePathExists(templateFolder)) {
            throw new NotFoundException('Le template n\'existe pas.');
        }

        await fs.readFile(templateFolder, 'utf-8', function (err, data) {
            const nodeEnv = process.env.NODE_ENV || 'development';
            const propertiesFolder = path.resolve(process.cwd(), 'properties');
            const config: AppProperties = require(`${propertiesFolder}/${nodeEnv}.properties.json`);
            if (err) {
                return console.error(err);
            }

            let html = data;

            if (email.dataList) {
                Object.keys(email.dataList).forEach(key => {
                    html = html.split('{{' + key + '}}').join(email.dataList[key]);
                });
            }

            const mailOptions: MailOptions = {
                from: email.from,
                to: email.to,
                subject: email.subject,
                html: html,
                text: html.replace(/<(?:[^><\"\']*?(?:([\"\']).*?\1)?[^><\'\"]*?)+(?:>|$)/g, ''),
                cc: email.cc,
                bcc: email.cci,
                attachments: email.attachments
            };

            let transporter;
            if (config.smtp && !config.dkim) {
                transporter = nodemailer.createTransport({
                    host: config.smtp.host,
                    port: config.smtp.port,
                    secure: config.smtp.secure,
                    auth: config.smtp.auth,
                    tls: { rejectUnauthorized: false }
                });

                // console.log('mailOptions');
                // console.log(mailOptions);
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        // console.log(error);
                        // throw new InternalServerErrorException();
                        result = error;
                    } else {
                        // console.log('E-mail envoyé.');
                        result = 'E-mail envoyé.';
                    }
                });
                return result;
            } else if (config.smtp && config.dkim) {
                transporter = nodemailer.createTransport({
                    host: config.smtp.host,
                    port: config.smtp.port,
                    secure: config.smtp.secure,
                    auth: config.smtp.auth,
                    tls: { rejectUnauthorized: false },
                    dkim: {
                        domainName: config.dkim.domainName,
                        keySelector: config.dkim.keySelector,
                        privateKey: config.dkim.privateKey
                    }
                });

                // console.log('mailOptions');
                // console.log(mailOptions);
                // console.log('transporter');
                // console.log(transporter);
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        // console.log(error);
                        throw new InternalServerErrorException();
                    } else {
                        // console.log('E-mail envoyé.');
                        result = 'E-mail envoyé.';
                    }
                });
                return result;
            } else if (config.sendmail && !config.dkim) {
                transporter = nodemailer.createTransport({
                    sendmail: true,
                    newline: config.sendmail.newline,
                    path: config.sendmail.path
                });

                // console.log('mailOptions');
                // console.log(mailOptions);
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        // console.log(error);
                        throw new InternalServerErrorException();
                    } else {
                        // console.log('E-mail envoyé.');
                        result = 'E-mail envoyé.';
                    }
                });
                return result;
            } else if (config.sendmail && config.dkim) {
                transporter = nodemailer.createTransport({
                    sendmail: true,
                    newline: config.sendmail.newline,
                    path: config.sendmail.path,
                    dkim: {
                        domainName: config.dkim.domainName,
                        keySelector: config.dkim.keySelector,
                        privateKey: config.dkim.privateKey
                    }
                });

                // console.log('mailOptions2');
                // console.log(mailOptions);
                // console.log('transporter2');
                // console.log(transporter);
                // console.log('config');
                // console.log(config);

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        // console.log(error);
                        throw new InternalServerErrorException();
                    } else {
                        // console.log('E-mail envoyé.');
                        result = 'E-mail envoyé.';
                    }
                });
                return result;
            } else {
                throw new Error('Il faut choisir entre smtp et sendmail \
                pour envoyer des mails (/backend/properties/properties.[env].json)');
            }
        });

        return await result;
    }

    filePathExists(filePath) {
        return new Promise((resolve, reject) => {
            fs.stat(filePath, (err, stats) => {
                if (err && err.code === 'ENOENT') {
                    return resolve(false);
                } else if (err) {
                    return reject(err);
                }
                if (stats.isFile() || stats.isDirectory()) {
                    return resolve(true);
                }
            });
        });
    }
}