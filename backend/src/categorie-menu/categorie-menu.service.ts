import {Injectable} from '@nestjs/common';
import {CCategorieMenu} from './categorie-menu.entity';
import {Log} from '../logger/logger';
import {FindManyOptions, Repository, DeepPartial, UpdateResult} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import { QueryService } from '../query/query.service';

@Injectable()
export class CategorieMenuService {
    constructor(
        @InjectRepository(CCategorieMenu)
        private readonly categoriemenuRepository: Repository<CCategorieMenu>,
        private queryService: QueryService
        
        // private readonly log: Log
    ) {}

    async findOneById(id: number): Promise<CCategorieMenu> {
      // this.log.debug('trying to find one menu by id...');
        const result = await this.categoriemenuRepository.findOne({
          id: id
        });
        return result;
    }

    async find(findOptions?: FindManyOptions<CCategorieMenu>): Promise<CCategorieMenu[]> {
        const options = {
          take: 100,
          skip: 0,
          ...findOptions // overwrite default ones
        };
        // this.log.debug(`searching for max ${options.take} civilites with an offset of ${options.skip} ...`);
        return await this.categoriemenuRepository.find(options);
    }

    async createCategorieMenu(CateDto: CCategorieMenu): Promise<CCategorieMenu> {
      const savedMenu = await this.categoriemenuRepository.save(CateDto);
      return savedMenu;
    }

    async getAllCates(inQuery: string): Promise<CCategorieMenu[]>{
      let query =  this.categoriemenuRepository.createQueryBuilder('categorie-menu')
      .leftJoinAndSelect('categorie-menu.menu','menu_defini');
  
      query = this.queryService.parseQuery(query, inQuery)
  
      return await query.getMany();
    }

    async getCateParMenuId(id: number): Promise<CCategorieMenu[]> {
      let query = this.categoriemenuRepository.createQueryBuilder('categorie-menu')
      .leftJoinAndSelect('categorie-menu.menu','menu_defini')
      .where('menu_defini.id =:number',{number: id});
      return await query.getMany();
    }

    async findCateById(id: number): Promise<CCategorieMenu> {
      let query = this.categoriemenuRepository.createQueryBuilder('categorie-menu')
      .leftJoinAndSelect('categorie-menu.menu','menu_defini')
      .where('categorie-menu.id =:number',{number: id});
      return await query.getOne();
    }

    async update(id: number, partialEntry: DeepPartial<CCategorieMenu>){
      return await this.categoriemenuRepository.update(id, partialEntry);
    }

    async removeCate(id: number): Promise<CCategorieMenu> {
      // this.log.debug('trying to remove menu...');
      return await this.categoriemenuRepository.remove(await this.findOneById(id));
    }
    
}
