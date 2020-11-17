import {Injectable, Inject} from '@nestjs/common';
import {FindManyOptions, Repository, UpdateResult} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {DeepPartial} from 'typeorm/common/DeepPartial';
import {Log} from '../logger/logger';
import { TypeBatiment } from './type-batiment.entity';
import { ITypeBatiment } from '@aleaac/shared';
import {CUtilisateur} from '../utilisateur/utilisateur.entity';

@Injectable()
export class TypeBatimentService {
  constructor(
    @InjectRepository(TypeBatiment) private readonly typeBatimentRepository: Repository<TypeBatiment>,
    // private readonly log: Log,
  ) {}

  // Create
  // Precondition: the typeBatiment needs to have a unique nom
  async create(typeBatimentDto: ITypeBatiment): Promise<TypeBatiment> {
    // this.log.debug('trying to create user...');

    const existingTypeBatiment = await this.typeBatimentExists(typeBatimentDto.nom);
    if (existingTypeBatiment) {
      throw new Error('TypeBatiment already exists');
    }

    const typeBatiment = this.typeBatimentRepository.create(typeBatimentDto);

    const savedTypeBatiment = await this.typeBatimentRepository.save(typeBatiment);
    // this.log.debug(JSON.stringify(savedTypeBatiment));
    return savedTypeBatiment;
  }

  typeBatimentExists(nom: string): Promise<boolean> {
    // this.log.debug('checking if typeBatiment exists...');
    return this.findOneByName(nom).then(user => {
      return !!user;
    });
  }

  // Read
  async find(findOptions?: FindManyOptions<TypeBatiment>): Promise<TypeBatiment[]> {
    const options = {
      take: 100,
      skip: 0,
      ...findOptions // overwrite default ones
    };
    // this.log.debug(`searching for max ${options.take} typeBatiments with an offset of ${options.skip} ...`);
    return await this.typeBatimentRepository.find(options);
  }

  async findOneById(id: number): Promise<TypeBatiment> {
    // this.log.debug('trying to find one typeBatiment by id...');
    return await this.typeBatimentRepository.findOne({
        id: id
    });
  }

  findOneByName(nom: string): Promise<TypeBatiment> {
    // this.log.debug('trying to find one typeBatiment by nom...');
    return this.typeBatimentRepository.findOne({
      nom: nom
    });
  }

  // Update
  async update(id: number, partialEntry: DeepPartial<TypeBatiment>): Promise<UpdateResult> {
    // this.log.debug('trying to update typeBatiment...');
    return await this.typeBatimentRepository.update(id, partialEntry);
  }

  // Delete
  async remove(id: number): Promise<TypeBatiment> {
    // this.log.debug('trying to remove typeBatiment...');
    return await this.typeBatimentRepository.remove(await this.findOneById(id));
  }
}
