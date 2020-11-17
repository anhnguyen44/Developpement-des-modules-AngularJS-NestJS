import {Injectable} from '@nestjs/common';
import {TypeProduit} from './type-produit.entity';
import {Log} from '../logger/logger';
import {FindManyOptions, Repository, DeepPartial, UpdateResult} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';

@Injectable()
export class TypeProduitService {
    constructor(
        @InjectRepository(TypeProduit)
        private readonly TypeProduitRepository: Repository<TypeProduit>,
        // private readonly log: Log
    ) {}

    // Create
  async create(TypeProduitDto: TypeProduit): Promise<TypeProduit> {
    const savedTypeProduit = await this.TypeProduitRepository.save(TypeProduitDto);
    return savedTypeProduit;
  }

  // Read
  async find(findOptions?: FindManyOptions<TypeProduit>): Promise<TypeProduit[]> {
    const options: FindManyOptions<TypeProduit> = {
      take: 100,
      skip: 0,
      order: {
        rang: 'ASC'
      },
      ...findOptions // overwrite default ones
    };
    // this.log.debug(`searching for max ${options.take} users with an offset of ${options.skip} ...`);
    const result = await this.TypeProduitRepository.find(options);
    return result;
  }

  async findOneById(id: number): Promise<TypeProduit> {
    // this.log.debug('trying to find one user by id...');
      const result = await this.TypeProduitRepository.findOne({
        id: id
      });
      return result;
  }

  // Update
  async update(id: number, partialEntry: DeepPartial<TypeProduit>): Promise<UpdateResult> {
    // this.log.debug('trying to update user...');
    return await this.TypeProduitRepository.update(id, partialEntry);
  }

  // Delete
  async remove(id: number): Promise<TypeProduit> {
    // this.log.debug('trying to remove user...');
    return await this.TypeProduitRepository.remove(await this.findOneById(id));
  }
}
