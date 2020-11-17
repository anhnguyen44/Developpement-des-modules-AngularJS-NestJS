import {
    Body, Controller, Delete, ForbiddenException, Get, InternalServerErrorException, NotFoundException,
    Param, ParseIntPipe, Patch, Post, Put, Query, UseInterceptors, Req
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { FindManyOptions, Repository, DeepPartial } from 'typeorm';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { MenuDefiniService } from './menu-defini.service';

import { CMenuDefini } from './menu-defini.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Rights } from '../common/decorators/rights.decorator';
import { HistoriqueService } from '../historique/historique.service';


@ApiUseTags('menu-defini')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'menu-defini'))
export class MenuDefiniController {
    constructor(
        private readonly menuDefiniService: MenuDefiniService,
        private historiqueService: HistoriqueService
    ) { }

    @ApiOperation({ title: 'Nouveau menu' })
    @ApiResponse({
        status: 200,
        description: 'Retourne le nouveau menu',
        type: CMenuDefini
    })
    @ApiResponse({ status: 400, description: 'Le menu existe déjà.' })
    @Post()
    @Authorized()
    @Rights(['MENUS_CREATE'])
    async createMenu(@Body() requestBody: CMenuDefini, @Req() request) {
        try {
            const menu = await this.menuDefiniService.createMenu(requestBody);
            // console.log(menu.id);
            await this.historiqueService.add(request.user.id, 'menu-defini', menu.id, 'Création du menu');
            return menu;
        } catch (err) {
            if (err.message === 'Le produit existe déjà.') {
                throw new ForbiddenException(err.message);
            } else {
                throw new InternalServerErrorException(err.message);
            }
        }
    }

    // @ApiOperation({ title: 'Nouveau menu' })
    // @Get()
    // @Authorized()
    // async getAllMenus(@Req() req): Promise<CMenuDefini[]> {
    //     try {
    //     //console.log('TEST 1');
    //     //console.log(req.query);
    //     return this.menuDefiniService.getAllMenus(req.query);
    //     } catch (e) {
    //         console.error(e);
    //     }
    // }

    @ApiOperation({ title: 'Nouveau menu' })
    @Get()
    @Authorized()
    async getAllMenus(@Req() req): Promise<CMenuDefini[]> {
        try {
            //console.log('TEST 1');
            //console.log(req.query);
            return this.menuDefiniService.getAllMenus(req.query);
        } catch (e) {
            console.error(e);
        }
    }

    @Get('non-recherche')
    @Authorized()
    async getAllMenusNonRecher(): Promise<CMenuDefini[]> {
        return this.menuDefiniService.getAllMenusNonRecher();
    }

    @Get('principal')
    @Authorized()
    async getMenusPricipal(): Promise<CMenuDefini[]> {
        return this.menuDefiniService.getMenusPricipal();
    }

    @Get('principalAll')
    @Authorized()
    async getMenusPricipalAll(): Promise<CMenuDefini[]> {
        return this.menuDefiniService.getMenusPricipalAll();
    }

    @Get('principalPermis')
    @Authorized()
    async getMenuPricipalPermis(): Promise<CMenuDefini[]> {
        return this.menuDefiniService.getMenuPricipalPermis();
    }

    @Get('visible')
    @Authorized()
    async getAllVisible(): Promise<CMenuDefini[]> {
        return this.menuDefiniService.getAllVisible();
    }

    @Get('visiblePermis')
    @Authorized()
    async getAllVisiblePermis(): Promise<CMenuDefini[]> {
        return this.menuDefiniService.getAllVisiblePermis();
    }

    @Get('visibleSansPermis')
    @Authorized()
    async getAllVisibleSansPermis(): Promise<CMenuDefini[]> {
        return this.menuDefiniService.getAllVisibleSansPermis();
    }

    @Get(':id')
    @Authorized()
    async findOne(@Param('id') id): Promise<CMenuDefini> {
        const foundMenu = await this.menuDefiniService.findMenuById(parseInt(id, 10));

        if (!foundMenu) {
            throw new NotFoundException(`Menu '${id}' introuvable`);
        }
        return foundMenu;
    }

    @Get('menuByMenuId/:id')
    @Authorized()
    async getAllMenuParMenuId(@Param('id') id): Promise<CMenuDefini[]> {
        const foundCate = await this.menuDefiniService.getAllMenuParMenuId(parseInt(id, 10));

        if (!foundCate) {
            throw new NotFoundException(`Des categories '${id}' introuvable`);
        }
        return foundCate;
    }

    @ApiOperation({ title: 'MàJ menu' })
    @Patch(':id')
    @Authorized()
    @Rights(['MENUS_CREATE'])
    async partialUpdate(
        @Param('id', new ParseIntPipe())
        menuId: number,
        @Body() partialEntry: DeepPartial<CMenuDefini>
    ) {
        const prd = this.menuDefiniService.update(menuId, partialEntry);
        return prd;
    }


    @Delete(':id')
    @Authorized()
    @Rights(['MENUS_CREATE'])
    async removeMenu(
        @Param('id', new ParseIntPipe())
        menuId: number,
        @Req() request
    ) {
        const oldMenu = await this.menuDefiniService.findOneById(menuId);
        try {
            await this.historiqueService.add(request.user.id, 'menu', menuId,
                'Menu supprimé : ' + JSON.stringify(oldMenu));
        } catch (err) {
            console.error(err);
        }
        return this.menuDefiniService.removeMenu(menuId);
    }


}