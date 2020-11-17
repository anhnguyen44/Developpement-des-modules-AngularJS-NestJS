import { Injectable } from '@nestjs/common';
import { CContenuMenu } from './contenu-menu.entity';
import { Log } from '../logger/logger';
import { FindManyOptions, Repository, DeepPartial, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryService } from '../query/query.service';

@Injectable()
export class ContenuMenuService {
  constructor(
    @InjectRepository(CContenuMenu)
    private readonly contenumenuRepository: Repository<CContenuMenu>,
    private queryService: QueryService

    // private readonly log: Log
  ) { }

  async findOneById(id: number): Promise<CContenuMenu> {
    // this.log.debug('trying to find one menu by id...');
    const result = await this.contenumenuRepository.findOne({
      id: id
    });
    return result;
  }

  async createContenuMenu(ContenuDto: CContenuMenu): Promise<CContenuMenu> {
    console.log('Test test');
    console.log(ContenuDto);
    const savedContenu = await this.contenumenuRepository.save(ContenuDto);
    return savedContenu;
  }

  async getAllContenus(inQuery: string): Promise<CContenuMenu[]> {
    let query = this.contenumenuRepository.createQueryBuilder('contenu-menu')
      .leftJoinAndSelect('contenu-menu.menu', 'menu_defini')
      .leftJoinAndSelect('contenu-menu.categorie', 'categorie-menu')
      .leftJoinAndSelect('contenu-menu.permission', 'droit')
      .leftJoinAndSelect('contenu-menu.miniature', 'fichier');

    query = this.queryService.parseQuery(query, inQuery)

    return await query.getMany();
  }

  async getAllContenuSearchable() {
    return this.contenumenuRepository.createQueryBuilder('contenu-menu')
      .leftJoinAndSelect('contenu-menu.menu', 'menu_defini')
      .leftJoinAndSelect('contenu-menu.categorie', 'categorie-menu')
      .where('menu_defini.recherche = 1')
      .andWhere('contenu-menu.visible = 1')
      .getMany()
  }

  async getAllContenusVisible(inQuery: string): Promise<CContenuMenu[]> {
    let query = this.contenumenuRepository.createQueryBuilder('contenu-menu')
      .leftJoinAndSelect('contenu-menu.menu', 'menu_defini')
      .leftJoinAndSelect('contenu-menu.categorie', 'categorie-menu')
      .leftJoinAndSelect('contenu-menu.permission', 'droit')
      .leftJoinAndSelect('contenu-menu.miniature', 'fichier')
      .where('contenu-menu.visible =:boolean2', { boolean2: 1 })

    query = this.queryService.parseQuery(query, inQuery)

    return await query.getMany();
  }

  async findContenuById(id: number): Promise<CContenuMenu> {
    console.log(id);
    const query = this.contenumenuRepository.createQueryBuilder('contenu-menu')
      .leftJoinAndSelect('contenu-menu.menu', 'menu_defini')
      .leftJoinAndSelect('contenu-menu.categorie', 'categorie_menu')
      .leftJoinAndSelect('contenu-menu.permission', 'droit')
      .leftJoinAndSelect('contenu-menu.miniature', 'fichier')
      .where('contenu-menu.id =:number', { number: id });
    return await query.getOne();
  }

  async getContenuByExpressName(express: String): Promise<CContenuMenu> {
    const query = this.contenumenuRepository.createQueryBuilder('contenu-menu')
      .leftJoinAndSelect('contenu-menu.menu', 'menu_defini')
      .leftJoinAndSelect('contenu-menu.categorie', 'categorie-menu')
      .leftJoinAndSelect('contenu-menu.permission', 'droit')
      .leftJoinAndSelect('contenu-menu.miniature', 'fichier')
      .where('contenu-menu.expression =:string', { string: express });
    return await query.getOne();
  }

  async getContenusByMenuId(id: number): Promise<CContenuMenu[]> {
    const query = this.contenumenuRepository.createQueryBuilder('contenu-menu')
      .leftJoinAndSelect('contenu-menu.menu', 'menu_defini')
      .leftJoinAndSelect('contenu-menu.categorie', 'categorie-menu')
      .leftJoinAndSelect('contenu-menu.miniature', 'fichier')
      .where('menu_defini.id =:number', { number: id });
    return await query.getMany();
  }

  async getContenusByExpress(express: number, inQuery: string): Promise<CContenuMenu[]> {
    let query = this.contenumenuRepository.createQueryBuilder('contenu-menu')
      .leftJoinAndSelect('contenu-menu.menu', 'menu_defini')
      .leftJoinAndSelect('contenu-menu.categorie', 'categorie-menu')
      .leftJoinAndSelect('contenu-menu.miniature', 'fichier')
      .where('menu_defini.url =:str', { str: express });
    query = this.queryService.parseQuery(query, inQuery);
    return await query.getMany();
  }

  async getContenusByMenuId2(idMenu: number, inQuery: string): Promise<CContenuMenu[]> {
    let query = this.contenumenuRepository.createQueryBuilder('contenu-menu')
      .leftJoinAndSelect('contenu-menu.menu', 'menu_defini')
      .leftJoinAndSelect('contenu-menu.categorie', 'categorie-menu')
      .leftJoinAndSelect('contenu-menu.miniature', 'fichier')
      .where('menu_defini.id =:number', { number: idMenu });
    query = this.queryService.parseQuery(query, inQuery);
    return await query.getMany();
  }

  async getContenusByUrl(url: string, inQuery: string): Promise<CContenuMenu[]> {
    let query = this.contenumenuRepository.createQueryBuilder('contenu-menu')
      .leftJoinAndSelect('contenu-menu.menu', 'menu_defini')
      .leftJoinAndSelect('contenu-menu.categorie', 'categorie-menu')
      .leftJoinAndSelect('contenu-menu.miniature', 'fichier')
      .where('menu_defini.url =:str', { number: '/' + url });
    query = this.queryService.parseQuery(query, inQuery);
    return await query.getMany();
  }

  async getContenuParentRecher(): Promise<CContenuMenu[]> {
    let query = this.contenumenuRepository.createQueryBuilder('contenu-menu')
      .leftJoinAndSelect('contenu-menu.menu', 'menu_defini')
      .leftJoinAndSelect('contenu-menu.categorie', 'categorie-menu')
      .leftJoinAndSelect('contenu-menu.permission', 'droit')
      .leftJoinAndSelect('contenu-menu.miniature', 'fichier')
      .where('menu_defini.recherche =:boolean', { boolean: 1 });

    return await query.getMany();
  }

  async countAll(idMenu: number, inQuery: string): Promise<number> {
    let query = this.contenumenuRepository.createQueryBuilder('contenu-menu')
      .leftJoinAndSelect('contenu-menu.menu', 'menu_defini')
      .leftJoinAndSelect('contenu-menu.categorie', 'categorie-menu')
      .leftJoinAndSelect('contenu-menu.miniature', 'fichier')
      .where('menu_defini.id =:number', { number: idMenu });
    query = this.queryService.parseQuery(query, inQuery);
    return await query.getCount();
  }

  async countAllUrl(url: string, inQuery: string): Promise<number> {
    let query = this.contenumenuRepository.createQueryBuilder('contenu-menu')
      .leftJoinAndSelect('contenu-menu.menu', 'menu_defini')
      .leftJoinAndSelect('contenu-menu.categorie', 'categorie-menu')
      .leftJoinAndSelect('contenu-menu.miniature', 'fichier')
      .where('menu_defini.url =:number', { number: '/' + url });
    query = this.queryService.parseQuery(query, inQuery);
    return await query.getCount();
  }

  async removeContenu(id: number): Promise<CContenuMenu> {
    // this.log.debug('trying to remove menu...');
    return await this.contenumenuRepository.remove(await this.findOneById(id));
  }

  async update(id: number, partialEntry: DeepPartial<CContenuMenu>) {
    console.log(id);
    console.log('update contenu hjhuhuhudhzaiuhduiz');
    console.log(partialEntry);
    return await this.contenumenuRepository.update(id, partialEntry);
  }

}
