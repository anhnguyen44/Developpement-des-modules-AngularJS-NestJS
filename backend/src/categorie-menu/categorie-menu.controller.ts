import { ICategorieMenu } from '@aleaac/shared';
import {
    Body, Controller, Delete, ForbiddenException, Get, InternalServerErrorException,
    NotFoundException, Param, ParseIntPipe, Patch, Post, Put, Query, UseInterceptors, Req
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { FindManyOptions, Repository } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { CCategorieMenu } from './categorie-menu.entity';
import { CategorieMenuService } from './categorie-menu.service';

import { InjectRepository } from '@nestjs/typeorm';
import { HistoriqueService } from '../historique/historique.service';
import { Rights } from '../common/decorators/rights.decorator';


@ApiUseTags('categorie-menu')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'categorie-menu'))
export class CategorieMenuController {
    constructor(
        private readonly categoriemenuService: CategorieMenuService,
        @InjectRepository(CCategorieMenu)
        private readonly repositoryCategorieMenu: Repository<CCategorieMenu>,
        private historiqueService: HistoriqueService
    ) { }

    @ApiOperation({ title: 'Nouveau categorie' })
    @ApiResponse({
        status: 200,
        description: 'Retourne le nouveau categorie',
        type: CCategorieMenu
    })
    @ApiResponse({ status: 400, description: 'Le categorie existe déjà.' })
    @Post()
    @Authorized()
    @Rights(['CATE_MENU_CREATE'])
    async createCategorieMenu(@Body() requestBody: CCategorieMenu, @Req() request) {
        try {
            const cate = await this.categoriemenuService.createCategorieMenu(requestBody);
            // console.log(cate.id);
            await this.historiqueService.add(request.user.id, 'categorie-menu', cate.id, 'Création du categorie');
            return cate;
        } catch (err) {
            if (err.message === 'Le categorie existe déjà.') {
                throw new ForbiddenException(err.message);
            } else {
                throw new InternalServerErrorException(err.message);
            }
        }
    }

    @Get()
    @Authorized()
    async getAllCates(@Req() req): Promise<CCategorieMenu[]> {
        try {
            return this.categoriemenuService.getAllCates(req.query);
        } catch (e) {
            console.error(e);
        }
    }

    
    @Get(':id')
    @Authorized()
    async findOne(@Param('id') id): Promise<CCategorieMenu> {
        const foundCate = await this.categoriemenuService.findCateById(parseInt(id, 10));

        if (!foundCate) {
            throw new NotFoundException(`Categorie '${id}' introuvable`);
        }
        return foundCate;
    }

    @Get('cateByMenuId/:id')
    @Authorized()
    async getCateParMenuId(@Param('id') id): Promise<CCategorieMenu[]> {
        const foundCate = await this.categoriemenuService.getCateParMenuId(parseInt(id, 10));

        if (!foundCate) {
            throw new NotFoundException(`Des categories '${id}' introuvable`);
        }
        return foundCate;
    }

    @ApiOperation({ title: 'MàJ cate' })
    @Patch(':id')
    @Authorized()
    @Rights(['CATE_MENU_CREATE'])
    async partialUpdate(
        @Param('id', new ParseIntPipe())
        cateId: number,
        @Body() partialEntry: DeepPartial<CCategorieMenu>
    ) {
        const prd = this.categoriemenuService.update(cateId, partialEntry);
        return prd;
    }

    @Delete(':id')
    @Authorized()
    @Rights(['CATE_MENU_CREATE'])
    async removeMenu(
        @Param('id', new ParseIntPipe())
        cateId: number,
        @Req() request
    ) {
        const oldMenu = await this.categoriemenuService.findOneById(cateId);
        try {
            await this.historiqueService.add(request.user.id, 'cate', cateId,
                'Categorie supprimé : ' + JSON.stringify(oldMenu));
        } catch (err) {
            console.error(err);
        }
        return this.categoriemenuService.removeCate(cateId);
    }
    
}
