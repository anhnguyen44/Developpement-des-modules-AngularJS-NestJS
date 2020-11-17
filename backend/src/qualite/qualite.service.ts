import {Injectable, Inject} from '@nestjs/common';
import {FindManyOptions, Repository, UpdateResult} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {DeepPartial} from 'typeorm/common/DeepPartial';

import {Log} from '../logger/logger';
import { Qualite } from './qualite.entity';
import { IQualite } from '@aleaac/shared';

@Injectable()
export class QualiteService {
  constructor(
    @InjectRepository(Qualite)
    private readonly qualiteRepository: Repository<Qualite>,
    // private readonly log: Log,
  ) {}

  // Create
  // Precondition: the qualite needs to have a unique nom
  async create(qualiteDto: IQualite): Promise<Qualite> {
    // this.log.debug('trying to create user...');

    const existingQualite = await this.qualiteExists(qualiteDto.nom);
    if (existingQualite) {
      throw new Error('Qualite already exists');
    }

    const qualite = this.qualiteRepository.create(qualiteDto);

    const savedQualite = await this.qualiteRepository.save(qualite);
    // this.log.debug(JSON.stringify(savedQualite));
    return savedQualite;
  }

  qualiteExists(nom: string): Promise<boolean> {
    // this.log.debug('checking if qualite exists...');
    return this.findOneByName(nom).then(user => {
      return !!user;
    });
  }

  // Read
  async find(findOptions?: FindManyOptions<Qualite>): Promise<Qualite[]> {
    const options = {
      take: 100,
      skip: 0,
      ...findOptions // overwrite default ones
    };
    // this.log.debug(`searching for max ${options.take} qualites with an offset of ${options.skip} ...`);
    return await this.qualiteRepository.find(options);
  }

  async findOneById(id: number): Promise<Qualite> {
    // this.log.debug('trying to find one qualite by id...');
    return await this.qualiteRepository.findOne({
        id: id
    });
  }

  findOneByName(nom: string): Promise<Qualite> {
    // this.log.debug('trying to find one qualite by nom...');
    return this.qualiteRepository.findOne({
      nom: nom
    });
  }

  // Update
  async update(id: number, partialEntry: DeepPartial<Qualite>): Promise<UpdateResult> {
    // this.log.debug('trying to update qualite...');
    return await this.qualiteRepository.update(id, partialEntry);
  }

  // Delete
  async remove(id: number): Promise<Qualite> {
    // this.log.debug('trying to remove qualite...');
    return await this.qualiteRepository.remove(await this.findOneById(id));
  }
}
