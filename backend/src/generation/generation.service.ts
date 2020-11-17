import { Injectable } from '@nestjs/common';
import * as childProcess from 'child_process'

import * as expressions from 'angular-expressions';
import * as JSZip from 'jszip';
import * as Docxtemplater from 'docxtemplater';
import * as ImageModule from 'docxtemplater-image-module';

import * as fs from 'fs';
import * as path from 'path';

import { Fichier } from '../fichier/fichier.entity';
import { FichierService } from '../fichier/fichier.service';

import * as excel from 'exceljs';
import { TemplateVersionService } from '../template-version/template-version.service';
import { EnumTypeTemplate } from '@aleaac/shared';

@Injectable()
export class GenerationService {
    constructor(
        private fichierService: FichierService,
        private templateVersionService: TemplateVersionService,
    ) { }

    async generateDocx(data, nomTemplate, application, idParent, idUtilisateur, nomFichier, user, writeFichier = true,
        idTypeFichier: number = null, isVersionned: boolean = false) {
        const zip = isVersionned ? await this.getTemplateFromDb(nomTemplate) : this.getTemplateFromFile(nomTemplate);

        const opts: any = {};
        opts.centered = false;
        opts.getImage = function (tagValue, tagName) {
            return fs.readFileSync(tagValue);
        }

        opts.getSize = function (img, tagValue, tagName) {
            const sizeOf = require('image-size');
            const sizeObj = sizeOf(img);
            console.log(sizeObj);
            return [sizeObj.width, sizeObj.height];
        }

        const imageModule = new ImageModule(opts);

        const doc = new Docxtemplater();
        doc.attachModule(imageModule);
        doc.loadZip(zip);

        const angularParser = function (tag) {
            return {
                get: tag === '.' ? function (s) { return s; } : expressions.compile(tag)
            };
        };

        doc.setData({
            data: data
        });

        doc.setOptions({
            parser: angularParser, nullGetter: function () {
                return '/';
            },
            linebreaks: true
        });

        try {
            doc.render()
        } catch (error) {
            const e = {
                message: error.message,
                name: error.name,
                stack: error.stack,
                properties: error.properties,
            };

            console.error(JSON.stringify({ error: e }));
            // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
            throw error;
        }

        const buf = doc.getZip().generate({
            type: 'nodebuffer',
            compression: 'DEFLATE'
        });

        if (writeFichier) {
            const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')

            fs.writeFileSync('./uploads/' + randomName + '.docx', buf);

            const fichier = new Fichier();
            fichier.keyDL = randomName + '.docx';
            fichier.date = new Date();
            fichier.extention = 'docx';
            fichier.idUtilisateur = idUtilisateur;
            fichier.nom = nomFichier;
            fichier.idParent = idParent;
            fichier.application = application;
            if (idTypeFichier) {
                fichier.idTypeFichier = idTypeFichier;
            }

            return this.fichierService.create(fichier, user);
        } else {
            return buf
        }
    }

    private getTemplateFromFile(nomTemplate: string) {
        const template = fs.readFileSync(path.resolve(__dirname, './template/' + nomTemplate));
        const zip = new JSZip(template);
        return zip;
    }

    private async getTemplateFromDb(nomTemplate: EnumTypeTemplate) {
        const fichier: Fichier = await this.templateVersionService.getFichierVersion(nomTemplate);
        const template = fs.readFileSync(path.resolve('./uploads/' + fichier.keyDL));
        const zip = new JSZip(template);
        return zip;
    }

    async docxToPdf(pathToDocx) {
        const exec = childProcess.exec;
        const keyDL = pathToDocx.split('/').pop();
        const uploadsPath = path.resolve('uploads');
        const nodeEnv = process.env.NODE_ENV || 'development';
        let cmd: string;
        if (process.env.NODE_ENV === 'development') {
            cmd = '"C:\\Program Files\\LibreOffice\\program\\soffice.exe" --headless --convert-to pdf '
                + uploadsPath + '/' + keyDL + ' --outdir ' + uploadsPath;
        } else {
            cmd = 'soffice --headless --convert-to pdf ' + uploadsPath + '/' + keyDL + ' --outdir ' + uploadsPath;
        }

        const transform = await new Promise(function (resolve, reject) {
            exec(cmd, function (err, stdout, stderr) {
                if (err) {
                    reject(err)
                }
                resolve('OK')
            })
        });

        if (transform === 'OK') {
            const fichier = await this.fichierService.get(keyDL);
            fs.unlinkSync(pathToDocx);
            fichier.extention = 'pdf';
            fichier.keyDL = fichier.keyDL.substr(0, fichier.keyDL.lastIndexOf('.')) + '.pdf';

            return await this.fichierService.update(fichier);
        }
    }


    generatePdf(data, nomTemplate, application, idParent) {

    }

    generateXlsx(headers: string[], datas: any[]) {
        const workbook = new excel.Workbook();
        const sheet = workbook.addWorksheet('Feuille');

        sheet.addRow(headers);
        datas.forEach(function (item) {
            sheet.addRow(item)
        });

        return workbook.xlsx.writeBuffer()
    }
}
