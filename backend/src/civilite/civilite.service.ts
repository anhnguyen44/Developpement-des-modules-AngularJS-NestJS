import {Injectable, Inject} from '@nestjs/common';
import {FindManyOptions, Repository, UpdateResult} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {DeepPartial} from 'typeorm/common/DeepPartial';
import {Log} from '../logger/logger';
import { Civilite } from './civilite.entity';
import { ICivilite } from '@aleaac/shared';
import {CUtilisateur} from '../utilisateur/utilisateur.entity';

@Injectable()
export class CiviliteService {
  constructor(
    @InjectRepository(Civilite) private readonly civiliteRepository: Repository<Civilite>,
    // private readonly log: Log,
  ) {}

  // Create
  // Precondition: the civilite needs to have a unique nom
  async create(civiliteDto: ICivilite): Promise<Civilite> {
    // this.log.debug('trying to create user...');

    const existingCivilite = await this.civiliteExists(civiliteDto.nom);
    if (existingCivilite) {
      throw new Error('Civilite already exists');
    }

    const civilite = this.civiliteRepository.create(civiliteDto);

    const savedCivilite = await this.civiliteRepository.save(civilite);
    // this.log.debug(JSON.stringify(savedCivilite));
    return savedCivilite;
  }

  civiliteExists(nom: string): Promise<boolean> {
    // this.log.debug('checking if civilite exists...');
    return this.findOneByName(nom).then(user => {
      return !!user;
    });
  }

  // Read
  async find(findOptions?: FindManyOptions<Civilite>): Promise<Civilite[]> {
    const options = {
      take: 100,
      skip: 0,
      ...findOptions // overwrite default ones
    };
    // this.log.debug(`searching for max ${options.take} civilites with an offset of ${options.skip} ...`);
    return await this.civiliteRepository.find(options);
  }

  async findOneById(id: number): Promise<Civilite> {
    // this.log.debug('trying to find one civilite by id...');
    return await this.civiliteRepository.findOne({
        id: id
    });
  }

  findOneByName(nom: string): Promise<Civilite> {
    // this.log.debug('trying to find one civilite by nom...');
    return this.civiliteRepository.findOne({
      nom: nom
    });
  }

  // Update
  async update(id: number, partialEntry: DeepPartial<Civilite>): Promise<UpdateResult> {
    // this.log.debug('trying to update civilite...');
    return await this.civiliteRepository.update(id, partialEntry);
  }

  // Delete
  async remove(id: number): Promise<Civilite> {
    // this.log.debug('trying to remove civilite...');
    return await this.civiliteRepository.remove(await this.findOneById(id));
  }
}
