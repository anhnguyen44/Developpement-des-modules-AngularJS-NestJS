import {ICategorieMenu, profils} from '@aleaac/shared';
import {
    Body, Controller, Delete, ForbiddenException, Get, InternalServerErrorException,
    NotFoundException, Param, ParseIntPipe, Patch, Post, Put, Query, UseInterceptors, Req
} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags} from '@nestjs/swagger';
import {FindManyOptions, Repository} from 'typeorm';
import {DeepPartial} from 'typeorm/common/DeepPartial';
import {apiPath} from '../api';
import {Authorized} from '../common/decorators/authorized.decorator';
import {LoggingInterceptor} from '../common/interceptors/logging.interceptor';
import {TransformInterceptor} from '../common/interceptors/transform.interceptor';
import {CContenuMenu} from './contenu-menu.entity';
import {ContenuMenuService} from './contenu-menu.service';

import {InjectRepository} from '@nestjs/typeorm';
import {HistoriqueService} from '../historique/historique.service';
import {Rights} from '../common/decorators/rights.decorator';
import {FichierService} from '../fichier/fichier.service';
import {ElasticSearchService} from '../elastic-search/elastic-search.service';
import {Fichier} from '../../../frontend/src/app/resource/fichier/Fichier';
import {stringify} from 'querystring';


@ApiUseTags('contenu-menu')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'contenu-menu'))
export class ContenuMenuController {
    constructor(
        private readonly contenumenuService: ContenuMenuService,
        @InjectRepository(CContenuMenu)
        private readonly repositoryCategorieMenu: Repository<CContenuMenu>,
        private historiqueService: HistoriqueService,
        private fichierService: FichierService,
        private elasticSearchService: ElasticSearchService
    ) {
    }

    @ApiOperation({title: 'Nouveau contenu'})
    @ApiResponse({
        status: 200,
        description: 'Retourne le nouveau contenu',
        type: CContenuMenu
    })
    @ApiResponse({status: 400, description: 'Le contenu existe déjà.'})
    @Post()
    @Authorized([profils.ADMIN_CONTENU])
    async createContenuMenu(@Body() requestBody: CContenuMenu, @Req() request) {
        try {
            // console.log("categorie");
            let miniatureURL = null;
            const fichier = await this.fichierService.getById(requestBody.idMiniature);
            if (requestBody.idMiniature) {
                miniatureURL = fichier.id;
            } else {
                miniatureURL = null;
            }
            let cateTitre = null;
            if (requestBody.categorie) {
                cateTitre = requestBody.categorie.titre;
            }

            const contenu = await this.contenumenuService.createContenuMenu(requestBody);
            // console.log(requestBody.categorie);

            // check si menu search
            const data = {
                id: contenu.id,
                titre: contenu.titre,
                MiniautureURL: miniatureURL,
                intro: contenu.intro,
                dateAjout: contenu.dateAjout,
                expression: contenu.expression,
                categorieTire: cateTitre,
                idMenu: contenu.menu.id
            };

            // si oui service elastic
            if (contenu.menu.recherche && contenu.visible) {
                // this.elasticSearchService.bulkInsert(contenu.menu.id, contenu.id, data);
                this.elasticSearchService.index('aleacontenu', data)
                // this.elasticSearchService.indexByUrl('aleacontenu', data)
                
            }

            await this.historiqueService.add(request.user.id, 'contenu-menu', contenu.id, 'Création du contenu');
            return contenu;
        } catch (err) {
            if (err.message === 'Le contenu existe déjà.') {
                throw new ForbiddenException(err.message);
            } else {
                throw new InternalServerErrorException(err.message);
            }
        }
    }

    @Get()
    @Authorized()
    async getAllContenus(@Req() req): Promise<CContenuMenu[]> {
        try {
            return this.contenumenuService.getAllContenus(req.query);
        } catch (e) {
            console.error(e);
        }
    }

    @Get('visible')
    @Authorized()
    async getAllContenusVisible(@Req() req): Promise<CContenuMenu[]> {
        return this.contenumenuService.getAllContenusVisible(req.query);
    }

    @Get(':id')
    @Authorized()
    async findOne(@Param('id') id): Promise<CContenuMenu> {
        const foundCate = await this.contenumenuService.findContenuById(parseInt(id, 10));

        if (!foundCate) {
            throw new NotFoundException(`Contenu '${id}' introuvable`);
        }
        return foundCate;
    }

    @Get('article/:express')
    @Authorized()
    async getContenuByExpressName(@Param('express') express): Promise<CContenuMenu> {
        const foundCate1 = await this.contenumenuService.getContenuByExpressName(String(express));

        if (!foundCate1) {
            throw new NotFoundException(`Contenu '${express}' introuvable`);
        }
        return foundCate1;
    }

    @Get('liste/:id')
    @Authorized()
    async getContenusByMenuId(@Param('id') id, @Req() req): Promise<CContenuMenu[]> {

        const foundCate = await this.contenumenuService.getContenusByMenuId(parseInt(id, 10));

        if (!foundCate) {
            throw new NotFoundException(`Contenu '${id}' introuvable`);
        }
        return foundCate;
    }

    @ApiOperation({title: 'Récupération de toute les contenus d\'une menu'})
    @Get('all/:idMenu')
    @Authorized()
    async getContenusByMenuId2(@Param() params, @Req() req) {
        // this.elasticSearchService.searchListContenu(params.idMenu, search);
        try {
            // let search = req.query.simple.split('€€')[1];
            // console.log(search);

            return await this.contenumenuService.getContenusByMenuId2(params.idMenu, req.query);
        } catch (e) {
            console.error(e);
        }
    }

    @ApiOperation({title: 'Récupération de toute les contenus d\'une menu'})
    @Get('allUrl/:url')
    @Authorized()
    async getContenusByUrl(@Param() params, @Req() req) {
        // this.elasticSearchService.searchListContenu(params.idMenu, search);
        try {
            // let search = req.query.simple.split('€€')[1];
            // console.log(search);

            return await this.contenumenuService.getContenusByUrl(params.url, req.query);
        } catch (e) {
            console.error(e);
        }
    }


    @ApiOperation({title: 'Récupération de toute les contenus d\'une menu'})
    @Get('allUrl/:url')
    @Authorized()
    async getContenusByExpress(@Param() params, @Req() req) {
        // this.elasticSearchService.searchListContenu(params.idMenu, search);
        try {
            // let search = req.query.simple.split('€€')[1];
            // console.log(search);

            return await this.contenumenuService.getContenusByExpress(params.url, req.query);
        } catch (e) {
            console.error(e);
        }
    }
    

    @Get('allParentRecher')
    @Authorized()
    async getContenuParentRecher() {
        // this.elasticSearchService.searchListContenu(params.idMenu, search);
        try {
            // let search = req.query.simple.split('€€')[1];
            // console.log(search);

            return await this.contenumenuService.getContenuParentRecher();
        } catch (e) {
            console.error(e);
        }
    }


    @ApiOperation({title: 'Récupération de toute les contenus d\'une menu'})
    @Get('elasticSearch/:idMenu')
    @Authorized()
    async getListElastic(@Param() params, @Req() req) {
        // this.elasticSearchService.searchListContenu(params.idMenu, search);
        try {
            let search = '';
            if (req.query.simple) {
                search = req.query.simple.split('€€')[1];
            }
            // return await this.elasticSearchService.getListElastic(params.idMenu, search, req.query);
            return await this.elasticSearchService.getElasticAleaContenu(params.idMenu, search, req.query);
        } catch (e) {
            console.error(e);
        }
    }

    @ApiOperation({title: 'Récupération de toute les contenus d\'une menu'})
    @Get('elasticSearchUrl/:url')
    @Authorized()
    async getListElasticUrl(@Param() params, @Req() req) {
        // this.elasticSearchService.searchListContenu(params.idMenu, search);
        try {
            let search = '';
            if (req.query.simple) {
                search = req.query.simple.split('€€')[1];
            }
            // return await this.elasticSearchService.getListElastic(params.idMenu, search, req.query);
            return await this.elasticSearchService.getElasticAleaContenuUrl(params.url, search, req.query);
        } catch (e) {
            console.error(e);
        }
    }

    @ApiOperation({ title: 'Récupération nombre contenus par menu' })
    @Get('countAll/:id')
    @Authorized()
    async countAll(@Param() params, @Req() req) {
        try {
            return await this.contenumenuService.countAll(params.id, req.query);
        } catch (e) {
            console.error(e);
        }
    }


    @ApiOperation({ title: 'Récupération nombre contenus par menu' })
    @Get('countAllUrl/:url')
    @Authorized()
    async countAllUrl(@Param() params, @Req() req) {
        try {
            return await this.contenumenuService.countAllUrl(params.url, req.query);
        } catch (e) {
            console.error(e);
        }
    }
    

    @ApiOperation({title: 'Récupération nombre contenus par menu'})
    @Get('countElasticSearch/:idMenu')
    @Authorized()
    async countElasticSearch(@Param() params, @Req() req) {
        try {
            let search = req.query.simple.split('€€')[1];
            // console.log("ici est search");
            if (search === 'undefined') {
                search = '';
            }
            // console.log(search);

            return await this.elasticSearchService.countElasticSearch(params.idMenu, search);
        } catch (e) {
            console.error(e);
        }
    }

    

    @ApiOperation({title: 'Récupération nombre contenus par menu'})
    @Get('countElasticSearchUrl/:url')
    @Authorized()
    async countElasticSearchUrl(@Param() params, @Req() req) {
        try {
            let search = req.query.simple.split('€€')[1];
            console.log("ici est search");
            if (search === 'undefined') {
                search = '';
            }
            console.log(search);

            return await this.elasticSearchService.countElasticSearchUrl(params.url, search);
        } catch (e) {
            console.error(e);
        }
    }

    /*@ApiOperation({title: 'Reindexer tous des contenus'})
    @Patch('reindex')
    @Authorized()
    @Rights(['CONTENU_MENU_CREATE'])
    async reindexerArticle(
        @Body() partialEntry: DeepPartial<CContenuMenu>
    ) {
        let miniatureURL1 = null;
        console.log('reindex');

        let cateTitre = '';
        if (partialEntry.categorie) {
            cateTitre = partialEntry.categorie.titre;
        }
        const fichier = await this.fichierService.getById(partialEntry.idMiniature);
        if (partialEntry.idMiniature) {
            miniatureURL1 = fichier.id;
        } else {
            miniatureURL1 = null;
        }

        console.log('categorie elastic titre');


        let data = {
            "id": partialEntry.id,
            "titre": partialEntry.titre,
            "MiniautureURL": miniatureURL1,
            "intro": partialEntry.intro,
            "dateAjout": partialEntry.dateAjout,
            "expression": partialEntry.expression,
            "categorieTire": cateTitre
        };
        // this.elasticSearchService.bulkDelete(partialEntry.menu.id,partialEntry.id);
        this.elasticSearchService.bulkInsert(partialEntry.menu.id, partialEntry.id, data);

        return partialEntry;
    }*/

    @ApiOperation({title: 'reIndex les contenus'})
    @Get('reindex/all')
    @Authorized([profils.ADMIN_CONTENU])
    async reIndex() {
        const contenus = await this.contenumenuService.getAllContenuSearchable();

        await this.elasticSearchService.deleteIndex('aleacontenu');
        for (const contenu of contenus) {
            const data = {
                id: contenu.id,
                titre: contenu.titre,
                MiniautureURL: contenu.idMiniature,
                intro: contenu.intro,
                dateAjout: contenu.dateAjout,
                expression: contenu.expression,
                categorieTire: (contenu.categorie ? contenu.categorie.titre : null),
                idMenu: contenu.menu.id
            };
            this.elasticSearchService.index('aleacontenu', data)
            // this.elasticSearchService.indexByUrl('aleacontenu', data)
        }

    }

    @ApiOperation({title: 'MàJ contenu'})
    @Patch(':id')
    @Authorized([profils.ADMIN_CONTENU])
    async partialUpdate(
        @Param('id', new ParseIntPipe())
            conId: number,
        @Body() partialEntry: DeepPartial<CContenuMenu>
    ) {
        /*let miniatureURL = null;

        let cateTitre = '';
        if (partialEntry.categorie) {
            cateTitre = partialEntry.categorie.titre;
        }
        const article = await this.contenumenuService.findContenuById(partialEntry.id);


        const fichier = await this.fichierService.getById(partialEntry.idMiniature);
        if (partialEntry.idMiniature) {
            miniatureURL = fichier.id;
        } else {
            miniatureURL = null;
        }*/

        //console.log('categorie elastic titre');


        /*let data = {
            "id": partialEntry.id,
            "titre": partialEntry.titre,
            "MiniautureURL": miniatureURL,
            "intro": partialEntry.intro,
            "dateAjout": partialEntry.dateAjout,
            "expression": partialEntry.expression,
            "categorieTire": cateTitre
        };*/

        const data = {
            id: partialEntry.id,
            titre: partialEntry.titre,
            MiniautureURL: partialEntry.idMiniature,
            intro: partialEntry.intro,
            dateAjout: partialEntry.dateAjout,
            expression: partialEntry.expression,
            categorieTire: (partialEntry.categorie ? partialEntry.categorie.titre : null),
            idMenu: partialEntry.menu.id
        };

        //if (article.menu.id == partialEntry.menu.id) {
            if (partialEntry.visible) {
                this.elasticSearchService.index('aleacontenu', data);
                // this.elasticSearchService.bulkInsert(partialEntry.menu.id, partialEntry.id, data);
                // this.elasticSearchService.bulkUpdate(partialEntry.menu.id, partialEntry.id, data);
            } else {
                this.elasticSearchService.delete('aleacontenu', data.id);
                // this.elasticSearchService.bulkDelete(partialEntry.menu.id, partialEntry.id);
            }

        /*} else {

            this.elasticSearchService.bulkDelete(article.menu.id, article.id);
            if (partialEntry.visible) {
                this.elasticSearchService.bulkInsert(partialEntry.menu.id, partialEntry.id, data);
            } else {
                this.elasticSearchService.bulkDelete(partialEntry.menu.id, partialEntry.id);
            }

        }*/
        // console.log(conId);
        const prd = this.contenumenuService.update(conId, partialEntry);
        return prd;
    }

    @Delete(':id')
    @Authorized([profils.ADMIN_CONTENU])
    async removeContenu(
        @Param('id', new ParseIntPipe())
            conId: number,
        @Req() request
    ) {
        const oldCon = await this.contenumenuService.findOneById(conId);

        const article = await this.contenumenuService.findContenuById(conId);

        // this.elasticSearchService.bulkDelete(article.menu.id, article.id);
        this.elasticSearchService.delete('aleacontenu', article.id);
        try {
            await this.historiqueService.add(request.user.id, 'con', conId,
                'Contenu supprimé : ' + JSON.stringify(oldCon));
        } catch (err) {
            console.error(err);
        }
        return this.contenumenuService.removeContenu(conId);
    }


}
