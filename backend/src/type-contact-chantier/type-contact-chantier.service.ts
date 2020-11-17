import {Injectable, Inject} from '@nestjs/common';
import {FindManyOptions, Repository, UpdateResult} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {DeepPartial} from 'typeorm/common/DeepPartial';
import {Log} from '../logger/logger';
import { TypeContactChantier } from './type-contact-chantier.entity';
import { ITypeContactChantier } from '@aleaac/shared';
import {CUtilisateur} from '../utilisateur/utilisateur.entity';

@Injectable()
export class TypeContactChantierService {
  constructor(
    @InjectRepository(TypeContactChantier) private readonly typeContactChantierRepository: Repository<TypeContactChantier>,
    // private readonly log: Log,
  ) {}

  // Create
  // Precondition: the typeContactChantier needs to have a unique nom
  async create(typeContactChantierDto: ITypeContactChantier): Promise<TypeContactChantier> {
    // this.log.debug('trying to create user...');

    const existingTypeContactChantier = await this.typeContactChantierExists(typeContactChantierDto.nom);
    if (existingTypeContactChantier) {
      throw new Error('TypeContactChantier already exists');
    }

    const typeContactChantier = this.typeContactChantierRepository.create(typeContactChantierDto);

    const savedTypeContactChantier = await this.typeContactChantierRepository.save(typeContactChantier);
    // this.log.debug(JSON.stringify(savedTypeContactChantier));
    return savedTypeContactChantier;
  }

  typeContactChantierExists(nom: string): Promise<boolean> {
    // this.log.debug('checking if typeContactChantier exists...');
    return this.findOneByName(nom).then(user => {
      return !!user;
    });
  }

  // Read
  async find(findOptions?: FindManyOptions<TypeContactChantier>): Promise<TypeContactChantier[]> {
    const options = {
      take: 100,
      skip: 0,
      ...findOptions // overwrite default ones
    };
    // this.log.debug(`searching for max ${options.take} typeContactChantiers with an offset of ${options.skip} ...`);
    return await this.typeContactChantierRepository.find(options);
  }

  async findOneById(id: number): Promise<TypeContactChantier> {
    // this.log.debug('trying to find one typeContactChantier by id...');
    return await this.typeContactChantierRepository.findOne({
        id: id
    });
  }

  findOneByName(nom: string): Promise<TypeContactChantier> {
    // this.log.debug('trying to find one typeContactChantier by nom...');
    return this.typeContactChantierRepository.findOne({
      nom: nom
    });
  }

  // Update
  async update(id: number, partialEntry: DeepPartial<TypeContactChantier>): Promise<UpdateResult> {
    // this.log.debug('trying to update typeContactChantier...');
    return await this.typeContactChantierRepository.update(id, partialEntry);
  }

  // Delete
  async remove(id: number): Promise<TypeContactChantier> {
    // this.log.debug('trying to remove typeContactChantier...');
    return await this.typeContactChantierRepository.remove(await this.findOneById(id));
  }
}
