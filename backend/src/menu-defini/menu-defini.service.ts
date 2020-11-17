import { Injectable, NotFoundException } from '@nestjs/common';
import { CMenuDefini } from './menu-defini.entity';
import { Log } from '../logger/logger';
import { FindManyOptions, Repository, DeepPartial, UpdateResult, FindOperator, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CUtilisateurProfil, Utilisateur, Profil, MenuDefini } from '@aleaac/shared';
import { QueryService } from '../query/query.service';

@Injectable()
export class MenuDefiniService {
  constructor(
    @InjectRepository(CMenuDefini)
    private readonly menuDefiniRepository: Repository<CMenuDefini>,
    private queryService: QueryService
    // private readonly log: Log
  ) { }

  async findOneById(id: number): Promise<CMenuDefini> {
    // this.log.debug('trying to find one menu by id...');
    const result = await this.menuDefiniRepository.findOne({
      id: id
    });
    return result;
  }

  // async findMenuById(id: number): Promise<CMenuDefini> {
  //   let query = this.menuDefiniRepository.createQueryBuilder('menu-defini')
  //   .leftJoinAndSelect('menu-defini.type','type_menu')
  //   .leftJoinAndSelect('menu-defini.menuParent','menu_defini')
  //   .leftJoinAndSelect('menu-defini.profils','menuProfils')
  //   .leftJoinAndSelect('menuProfils.profil','profil')
  //   .where('menu-defini.id =:number',{number: id});
  //   return await query.getOne();
  // }

  async findMenuById(id: number): Promise<CMenuDefini> {
    let query = this.menuDefiniRepository.createQueryBuilder('menu-defini')
      .leftJoinAndSelect('menu-defini.type', 'type_menu')
      .leftJoinAndSelect('menu-defini.menuParent', 'menu_defini')
      .leftJoinAndSelect('menu-defini.droitsForMenu', 'droit')
      .where('menu-defini.id =:number', { number: id });
    return await query.getOne();
  }

  async createMenu(MenuDto: MenuDefini): Promise<CMenuDefini> {
    const savedMenu = await this.menuDefiniRepository.save(MenuDto);
    return savedMenu;
  }

  async getAllMenus(inQuery: string): Promise<CMenuDefini[]> {
    // console.log('TEST 2');
    let query = this.menuDefiniRepository.createQueryBuilder('menu-defini')
      .leftJoinAndSelect('menu-defini.menuParent', 'menu_defini')
      .leftJoinAndSelect('menu-defini.droitsForMenu', 'droit');

    query = this.queryService.parseQuery(query, inQuery)

    return await query.getMany();
  }

  async getAllMenusNonRecher(): Promise<CMenuDefini[]> {
    return await this.menuDefiniRepository.createQueryBuilder('menu-defini')
    .where('menu-defini.recherche =:boolean', { boolean: 0 }).getMany();
  }

  async getMenusPricipal(): Promise<CMenuDefini[]> {
    return await this.menuDefiniRepository.createQueryBuilder('menu-defini')
      .leftJoinAndSelect('menu-defini.menuParent', 'menu_defini')
      .leftJoinAndSelect('menu-defini.droitsForMenu', 'droit')
      .where('menu-defini.recherche =:boolean', { boolean: 0 })
      .andWhere('menu-defini.visible =:boolean2', { boolean2: 1 })
      .andWhere('menu-defini.menuParent IS NULL')
      .andWhere('menu-defini.droitsForMenu IS NULL')
      .orderBy('menu-defini.ordreMenu', 'ASC')
      .getMany();
  }

  async getMenusPricipalAll(): Promise<CMenuDefini[]> {
    return await this.menuDefiniRepository.createQueryBuilder('menu-defini')
      .leftJoinAndSelect('menu-defini.menuParent', 'menu_defini')
      .leftJoinAndSelect('menu-defini.droitsForMenu', 'droit')
      .where('menu-defini.recherche =:boolean', { boolean: 0 })
      .andWhere('menu-defini.visible =:boolean2', { boolean2: 1 })
      .andWhere('menu-defini.menuParent IS NULL')
      .orderBy('menu-defini.ordreMenu', 'ASC')
      .getMany();
  }



  async getMenuPricipalPermis(): Promise<CMenuDefini[]> {
    return await this.menuDefiniRepository.createQueryBuilder('menu-defini')
      .leftJoinAndSelect('menu-defini.menuParent', 'menu_defini')
      .leftJoinAndSelect('menu-defini.droitsForMenu', 'droit')
      .where('menu-defini.recherche =:boolean', { boolean: 0 })
      .andWhere('menu-defini.visible =:boolean2', { boolean2: 1 })
      .andWhere('menu-defini.menuParent IS NULL')
      .andWhere('menu-defini.droitsForMenu IS NOT NULL')
      .orderBy('menu-defini.ordreMenu', 'ASC')
      .getMany();
  }

  async getAllVisible(): Promise<CMenuDefini[]> {
    return await this.menuDefiniRepository.createQueryBuilder('menu-defini')
      .leftJoinAndSelect('menu-defini.menuParent', 'menu_defini')
      .leftJoinAndSelect('menu-defini.droitsForMenu', 'droit')
      .andWhere('menu-defini.visible =:boolean2', { boolean2: 1 })
      .andWhere('menu-defini.menuParent IS NOT NULL')
      .orderBy('menu-defini.ordreMenu', 'ASC')
      .getMany();
  }

  async getAllVisiblePermis(): Promise<CMenuDefini[]> {
    return await this.menuDefiniRepository.createQueryBuilder('menu-defini')
      .leftJoinAndSelect('menu-defini.menuParent', 'menu_defini')
      .leftJoinAndSelect('menu-defini.droitsForMenu', 'droit')
      .andWhere('menu-defini.visible =:boolean2', { boolean2: 1 })
      .andWhere('menu-defini.menuParent IS NOT NULL')
      .andWhere('menu-defini.droitsForMenu IS NOT NULL')
      .orderBy('menu-defini.ordreMenu', 'ASC')
      .getMany();
  }

  async getAllVisibleSansPermis(): Promise<CMenuDefini[]> {
    return await this.menuDefiniRepository.createQueryBuilder('menu-defini')
      .leftJoinAndSelect('menu-defini.menuParent', 'menu_defini')
      .leftJoinAndSelect('menu-defini.droitsForMenu', 'droit')
      .andWhere('menu-defini.visible =:boolean2', { boolean2: 1 })
      .andWhere('menu-defini.menuParent IS NOT NULL')
      .andWhere('menu-defini.droitsForMenu IS NULL')
      .orderBy('menu-defini.ordreMenu', 'ASC')
      .getMany();
  }

  async getAllMenuParMenuId(id: number): Promise<CMenuDefini[]> {
    let query = this.menuDefiniRepository.createQueryBuilder('menu-defini')
      .leftJoinAndSelect('menu-defini.menuParent', 'menu_defini')
      .where('menu_defini.id =:number', { number: id });
    return await query.getMany();
  }


  async update(id: number, partialEntry: DeepPartial<CMenuDefini>) {
    return await this.menuDefiniRepository.update(id, partialEntry);
  }

  async removeMenu(id: number): Promise<CMenuDefini> {
    // this.log.debug('trying to remove menu...');
    return await this.menuDefiniRepository.remove(await this.findOneById(id));
  }
}
