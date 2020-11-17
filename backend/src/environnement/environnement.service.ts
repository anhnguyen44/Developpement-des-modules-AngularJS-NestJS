import { Injectable, Inject } from '@nestjs/common';
import { FindManyOptions, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { Log } from '../logger/logger';
import { Environnement } from './environnement.entity';
import { IEnvironnement } from '@aleaac/shared';

@Injectable()
export class EnvironnementService {
  constructor(
    @InjectRepository(Environnement) private readonly environnementRepository: Repository<Environnement>,
    // private readonly log: Log,
  ) { }

  // Create
  // Precondition: the environnement needs to have a unique nom
  async create(environnementDto: IEnvironnement): Promise<Environnement> {
    // this.log.debug('trying to create user...');

    const existingEnvironnement = await this.environnementExists(environnementDto.nom);
    if (existingEnvironnement) {
      throw new Error('Environnement already exists');
    }

    const environnement = this.environnementRepository.create(environnementDto);

    const savedEnvironnement = await this.environnementRepository.save(environnement);
    // this.log.debug(JSON.stringify(savedEnvironnement));
    return savedEnvironnement;
  }

  environnementExists(nom: string): Promise<boolean> {
    // this.log.debug('checking if environnement exists...');
    return this.findOneByName(nom).then(user => {
      return !!user;
    });
  }

  // Read
  async find(findOptions?: FindManyOptions<Environnement>): Promise<Environnement[]> {
    const options = {
      take: 100,
      skip: 0,
      ...findOptions // overwrite default ones
    };
    // this.log.debug(`searching for max ${options.take} environnements with an offset of ${options.skip} ...`);
    return await this.environnementRepository.find(options);
  }

  async findOneById(id: number): Promise<Environnement> {
    // this.log.debug('trying to find one environnement by id...');
    return await this.environnementRepository.findOne({
      id: id
    });
  }

  findOneByName(nom: string): Promise<Environnement> {
    // this.log.debug('trying to find one environnement by nom...');
    return this.environnementRepository.findOne({
      nom: nom
    });
  }

  // Update
  async update(id: number, partialEntry: DeepPartial<Environnement>): Promise<UpdateResult> {
    // this.log.debug('trying to update environnement...');
    return await this.environnementRepository.update(id, partialEntry);
  }

  // Delete
  async remove(id: number): Promise<Environnement> {
    // this.log.debug('trying to remove environnement...');
    return await this.environnementRepository.remove(await this.findOneById(id));
  }
}
