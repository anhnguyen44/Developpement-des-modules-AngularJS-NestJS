import {Injectable, Inject} from '@nestjs/common';
import {FindManyOptions, Repository, UpdateResult} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {DeepPartial} from 'typeorm/common/DeepPartial';
import {Log} from '../logger/logger';
import { Objectif } from './objectif.entity';
import { IObjectif } from '@aleaac/shared';
import {CUtilisateur} from '../utilisateur/utilisateur.entity';

@Injectable()
export class ObjectifService {
  constructor(
    @InjectRepository(Objectif) private readonly objectifRepository: Repository<Objectif>,
    // private readonly log: Log,
  ) {}

  // Create
  // Precondition: the objectif needs to have a unique nom
  async create(objectifDto: IObjectif): Promise<Objectif> {
    // this.log.debug('trying to create user...');

    const existingObjectif = await this.objectifExists(objectifDto.nom);
    if (existingObjectif) {
      throw new Error('Objectif already exists');
    }

    const objectif = this.objectifRepository.create(objectifDto);

    const savedObjectif = await this.objectifRepository.save(objectif);
    // this.log.debug(JSON.stringify(savedObjectif));
    return savedObjectif;
  }

  objectifExists(nom: string): Promise<boolean> {
    // this.log.debug('checking if objectif exists...');
    return this.findOneByName(nom).then(user => {
      return !!user;
    });
  }

  // Read
  async find(findOptions?: FindManyOptions<Objectif>): Promise<Objectif[]> {
    const options = {
      take: 100,
      skip: 0,
      ...findOptions // overwrite default ones
    };
    // this.log.debug(`searching for max ${options.take} objectifs with an offset of ${options.skip} ...`);
    return await this.objectifRepository.find(options);
  }

  async findOneById(id: number): Promise<Objectif> {
    // this.log.debug('trying to find one objectif by id...');
    return await this.objectifRepository.findOne({
        id: id
    });
  }

  findOneByName(nom: string): Promise<Objectif> {
    // this.log.debug('trying to find one objectif by nom...');
    return this.objectifRepository.findOne({
      nom: nom
    });
  }

  // Update
  async update(id: number, partialEntry: DeepPartial<Objectif>): Promise<UpdateResult> {
    // this.log.debug('trying to update objectif...');
    return await this.objectifRepository.update(id, partialEntry);
  }

  // Delete
  async remove(id: number): Promise<Objectif> {
    // this.log.debug('trying to remove objectif...');
    return await this.objectifRepository.remove(await this.findOneById(id));
  }
}
