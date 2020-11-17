import {Injectable} from '@nestjs/common';
import {TypeGrille} from './type-grille.entity';
import {Log} from '../logger/logger';
import {FindManyOptions, Repository, DeepPartial, UpdateResult} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';

@Injectable()
export class TypeGrilleService {
    constructor(
        @InjectRepository(TypeGrille)
        private readonly TypeGrilleRepository: Repository<TypeGrille>,
        // private readonly log: Log
    ) {}

    // Create
  async create(TypeGrilleDto: TypeGrille): Promise<TypeGrille> {
    const savedTypeGrille = await this.TypeGrilleRepository.save(TypeGrilleDto);
    return savedTypeGrille;
  }

  // Read
  async find(findOptions?: FindManyOptions<TypeGrille>): Promise<TypeGrille[]> {
    const options: FindManyOptions<TypeGrille> = {
      take: 100,
      skip: 0,
      order: {
        nom: 'ASC'
      },
      ...findOptions // overwrite default ones
    };
    // this.log.debug(`searching for max ${options.take} users with an offset of ${options.skip} ...`);
    const result = await this.TypeGrilleRepository.find(options);

    return result;
  }

  async findOneById(id: number): Promise<TypeGrille> {
    // this.log.debug('trying to find one user by id...');
      const result = await this.TypeGrilleRepository.findOne({
        id: id
      });
      return result;
  }

  // Update
  async update(id: number, partialEntry: DeepPartial<TypeGrille>): Promise<UpdateResult> {
    // this.log.debug('trying to update user...');
    return await this.TypeGrilleRepository.update(id, partialEntry);
  }

  // Delete
  async remove(id: number): Promise<TypeGrille> {
    // this.log.debug('trying to remove user...');
    return await this.TypeGrilleRepository.remove(await this.findOneById(id));
  }
}
