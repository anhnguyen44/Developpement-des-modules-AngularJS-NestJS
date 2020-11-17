import { Injectable } from '@nestjs/common';
import * as childProcess from 'child_process'

import * as expressions from 'angular-expressions';
import * as JSZip from 'jszip';
import * as Docxtemplater from 'docxtemplater';

import * as fs from 'fs';
import * as path from 'path';

import { Fichier } from '../fichier/fichier.entity';
import { FichierService } from '../fichier/fichier.service';

import * as excel from 'exceljs';
import { InjectRepository } from '@nestjs/typeorm';
import { CUtilisateur } from '../utilisateur/utilisateur.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ImportService {
    constructor(private fichierService: FichierService) { }

    async readFromXlsx(idFichier: number, headers: string[], hasHeaders: boolean = true): Promise<any[]> {
        const results = new Array<any>();
        const file = await this.fichierService.getById(idFichier);
        await file;
        //then((file) => {
        let  workbook = new excel.Workbook();
        workbook = await workbook.xlsx.readFile('uploads/' + file.keyDL);
            //.then(function () {
                // use workbook
                const worksheet = workbook.getWorksheet(1);
                let ligne = 1;
                worksheet.eachRow(function (row, rowNumber) {
                    // console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
                    try {
                        if (ligne === 1 && hasHeaders) {
                            // On saute la ligne des headers, c'est pas des données
                            // console.log('On saute la ligne headers');
                        } else {
                            // console.log('On ajoute la ligne');
                            const rowEntity = {};
                            let i = 0;
                            for (const header of headers) {
                                rowEntity[header] = row.getCell(++i).toString();
                            }
                            results.push(rowEntity);
                        }
                        ligne++;
                    } catch (err) {
                        console.error('Erreur import ligne ' + rowNumber);
                        console.error(err);
                    }
                });
            //});
        //});
        // console.log('!!!!!!!!! RETURN TABLEAU DEPUIS EXCEL');
        // console.log(results);

        return results;
    }
}
