import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import {
    Body,
    Controller, Delete, FilesInterceptor,
    Get,
    Param,
    Post, Res, UploadedFiles,
    UseInterceptors,
    Patch,
    ParseIntPipe,
    NotFoundException
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { apiPath } from '../api';
import { FichierService } from './fichier.service';
import { Authorized } from '../common/decorators/authorized.decorator';
import { Fichier } from './fichier.entity';
import { readFile, readFileSync } from 'fs'
import { CurrentUtilisateur } from '../utilisateur/utilisateur.decorator';
import { DeepPartial } from 'typeorm';

import sharp = require('sharp');
import fs = require('fs');

@ApiUseTags('fichier')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'fichier'))
export class FichierController {
    constructor(private fichierService: FichierService) { }

    @ApiOperation({ title: 'Creation d\'un fichier' })
    @Post('create-force')
    @Authorized()
    @UseInterceptors(FilesInterceptor('file', 1, {
        storage: diskStorage({
            destination: './uploads'
            , filename: (req, file, cb) => {
                // Generating a 32 random chars long string
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                // Calling the callback passing the random name generated with the original extension name
                cb(null, `${randomName}${extname(file.originalname)}`)
            }
        })
    }))
    async createForceKeep(@UploadedFiles() images, @Body() requestBody: Fichier, @CurrentUtilisateur() user) {
        return await this.create(images, requestBody, user, true);
    }


    @ApiOperation({ title: 'Creation d\'un fichier avec resize (https://sharp.pixelplumbing.com/en/stable/api-resize/)' })
    @Post('create-resize/:width/:height/:fit')
    @Authorized()
    @UseInterceptors(FilesInterceptor('file', 1, {
        storage: diskStorage({
            destination: './uploads'
            , filename: (req, file, cb) => {
                // Generating a 32 random chars long string
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                // Calling the callback passing the random name generated with the original extension name
                cb(null, `${randomName}${extname(file.originalname)}`)
            }
        })
    }))
    async createResize(@UploadedFiles() images, @Body() requestBody: Fichier, @Param() params, @CurrentUtilisateur() user) {
        // Pour voir les options : https://sharp.pixelplumbing.com/en/stable/api-resize/

        // On rouvre l'image
        const uploadedImage = fs.readFileSync(images[0].path);
        try {
            await fs.unlinkSync(images[0].path);
        } catch (e) {
            console.error('Fichier impossible à supprimer ' + images[0].path);
        }

        // On applique le resize
        await sharp(uploadedImage)
            .resize(Number.parseInt(params.width), Number.parseInt(params.height), { fit: params.fit })
            .toFile(images[0].path);

        return await this.create(images, requestBody, user, true);
    }

    @ApiOperation({ title: 'Creation d\'un fichier' })
    @Post()
    @Authorized()
    @UseInterceptors(FilesInterceptor('file', 1, {
        storage: diskStorage({
            destination: './uploads'
            , filename: (req, file, cb) => {
                // Generating a 32 random chars long string
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                // Calling the callback passing the random name generated with the original extension name
                cb(null, `${randomName}${extname(file.originalname)}`)
            }
        })
    }))
    async create(@UploadedFiles() images, @Body() requestBody: Fichier, @CurrentUtilisateur() user, keepOldIfExists: boolean = false) {

        requestBody.keyDL = images[0].filename;
        requestBody.date = new Date();

        return await this.fichierService.create(requestBody, user, keepOldIfExists);
    }

    @Get('getById/:id')
    @Authorized()
    async findOne(@Param('id') id): Promise<Fichier> {
        const foundMenu = await this.fichierService.getById(parseInt(id, 10));

        if (!foundMenu) {
            throw new NotFoundException(`Fichier '${id}' introuvable`);
        }
        return foundMenu;
    }

    @Get('getAsBase64ById/:id')
    @Authorized()
    async getAsBase64ById(@Param('id') id): Promise<string> {
        const foundFile = await this.fichierService.getById(parseInt(id, 10));

        if (!foundFile) {
            throw new NotFoundException(`Fichier '${id}' introuvable`);
        }

        const res = fs.readFileSync('./uploads/' + foundFile.keyDL, 'base64');
        return res;
    }

    @ApiOperation({ title: 'Update commentaire fichier' })
    @Patch('update-comment')
    @Authorized()
    async updateComment(@Body() requestBody: DeepPartial<Fichier>) {
        // On vire tout ce qui n'est pas le commentaire
        const temp = new Fichier();
        temp.id = requestBody.id;
        temp.commentaire = requestBody.commentaire;

        return await this.fichierService.updatePartial(temp);
    }

    @ApiOperation({ title: 'MàJ' })
    @Patch(':id')
    @Authorized()
    async partialUpdate(
        @Param('id', new ParseIntPipe())
        menuId: number,
        @Body() partialEntry: DeepPartial<Fichier>
    ) {
        const prd = this.fichierService.updatePartial(partialEntry);
        return prd;
    }

    

    @ApiOperation({ title: 'récupération d\'un fichier' })
    @Get('affiche/:keyDL')
    async getAffiche(@Param() params, @Res() res) {
        // console.log('toto');
        /*const fichier = await this.fichierService.get(params.keyDL);
        const data = readFileSync('./uploads/' + params.keyDL);
        const file = {
            buffer: data,
            mimeType: fichier.type,
            nom: fichier.nom,
            extention: fichier.extention
        };*/
        return res.sendFile(params.keyDL, { root: 'uploads' });
    }

    @ApiOperation({ title: 'liste des fichiers' })
    @Get('/:application/:idParent')
    @Authorized()
    async find(@Param() params) {
        // console.log('parent type');
        return await this.fichierService.getAll(params.application, params.idParent)
    }

    @ApiOperation({ title: 'récupération d\'un fichier' })
    @Get('/:keyDL')
    @Authorized()
    async get(@Param() params, @Res() res) {
        // console.log('keydl');
        // console.log(params.keyDL);
        /*const fichier = await this.fichierService.get(params.keyDL);
        const data = readFileSync('./uploads/' + params.keyDL);
        const file = {
            buffer: data,
            mimeType: fichier.type,
            nom: fichier.nom,
            extention: fichier.extention
        };*/
        return res.sendFile(params.keyDL, { root: 'uploads' });
    }

    @ApiOperation({ title: 'Suppression fichier' })
    @Delete('/:idFichier')
    @Authorized()
    async delete(@Param() params, @CurrentUtilisateur() user) {
        return await this.fichierService.delete(params.idFichier, user);
    }
}