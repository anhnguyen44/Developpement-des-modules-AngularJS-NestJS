import {Injectable, Inject} from '@nestjs/common';
import {FindManyOptions, Repository, UpdateResult} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {DeepPartial} from 'typeorm/common/DeepPartial';
import {Log} from '../logger/logger';
import { TypeObjectif } from './type-objectif.entity';
import { ITypeObjectif } from '@aleaac/shared';
import {CUtilisateur} from '../utilisateur/utilisateur.entity';

@Injectable()
export class TypeObjectifService {
  constructor(
    @InjectRepository(TypeObjectif) private readonly typeObjectifRepository: Repository<TypeObjectif>,
    // private readonly log: Log,
  ) {}

  // Create
  // Precondition: the typeObjectif needs to have a unique nom
  async create(typeObjectifDto: ITypeObjectif): Promise<TypeObjectif> {
    // this.log.debug('trying to create user...');

    const existingTypeObjectif = await this.typeObjectifExists(typeObjectifDto.nom);
    if (existingTypeObjectif) {
      throw new Error('TypeObjectif already exists');
    }

    const typeObjectif = this.typeObjectifRepository.create(typeObjectifDto);

    const savedTypeObjectif = await this.typeObjectifRepository.save(typeObjectif);
    // this.log.debug(JSON.stringify(savedTypeObjectif));
    return savedTypeObjectif;
  }

  typeObjectifExists(nom: string): Promise<boolean> {
    // this.log.debug('checking if typeObjectif exists...');
    return this.findOneByName(nom).then(user => {
      return !!user;
    });
  }

  // Read
  async find(findOptions?: FindManyOptions<TypeObjectif>): Promise<TypeObjectif[]> {
    const options = {
      take: 100,
      skip: 0,
      ...findOptions // overwrite default ones
    };
    // this.log.debug(`searching for max ${options.take} typeObjectifs with an offset of ${options.skip} ...`);
    return await this.typeObjectifRepository.find(options);
  }

  async findOneById(id: number): Promise<TypeObjectif> {
    // this.log.debug('trying to find one typeObjectif by id...');
    return await this.typeObjectifRepository.findOne({
        id: id
    });
  }

  findOneByName(nom: string): Promise<TypeObjectif> {
    // this.log.debug('trying to find one typeObjectif by nom...');
    return this.typeObjectifRepository.findOne({
      nom: nom
    });
  }

  // Update
  async update(id: number, partialEntry: DeepPartial<TypeObjectif>): Promise<UpdateResult> {
    // this.log.debug('trying to update typeObjectif...');
    return await this.typeObjectifRepository.update(id, partialEntry);
  }

  // Delete
  async remove(id: number): Promise<TypeObjectif> {
    // this.log.debug('trying to remove typeObjectif...');
    return await this.typeObjectifRepository.remove(await this.findOneById(id));
  }
}
