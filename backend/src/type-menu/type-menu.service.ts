import {Injectable} from '@nestjs/common';
import {TypeMenu} from './type-menu.entity';
import {Log} from '../logger/logger';
import {FindManyOptions, Repository, DeepPartial, UpdateResult} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';

@Injectable()
export class TypeMenuService {
    constructor(
        @InjectRepository(TypeMenu)
        private readonly typemenuRepository: Repository<TypeMenu>,
        
        // private readonly log: Log
    ) {}

    async find(findOptions?: FindManyOptions<TypeMenu>): Promise<TypeMenu[]> {
        const options = {
          take: 100,
          skip: 0,
          ...findOptions // overwrite default ones
        };
        // this.log.debug(`searching for max ${options.take} civilites with an offset of ${options.skip} ...`);
        return await this.typemenuRepository.find(options);
      }

}
