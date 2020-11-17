import {Injectable, Inject} from '@nestjs/common';
import {FindManyOptions, Repository, UpdateResult} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {DeepPartial} from 'typeorm/common/DeepPartial';
import {Log} from '../logger/logger';
import { Batiment } from './batiment.entity';
import { IBatiment } from '@aleaac/shared';
import {CUtilisateur} from '../utilisateur/utilisateur.entity';

@Injectable()
export class BatimentService {
  constructor(
    @InjectRepository(Batiment) private readonly batimentRepository: Repository<Batiment>,
    // private readonly log: Log,
  ) {}

  // Create
  // Precondition: the batiment needs to have a unique nom
  async create(batimentDto: IBatiment): Promise<Batiment> {
    // this.log.debug('trying to create user...');

    // const existingBatiment = await this.batimentExists(batimentDto.nom);
    // if (existingBatiment) {
    //   throw new Error('Batiment already exists');
    // }

    const batiment = this.batimentRepository.create(batimentDto);

    const savedBatiment = await this.batimentRepository.save(batiment);
    // this.log.debug(JSON.stringify(savedBatiment));
    return savedBatiment;
  }

  batimentExists(nom: string): Promise<boolean> {
    // this.log.debug('checking if batiment exists...');
    return this.findOneByName(nom).then(user => {
      return !!user;
    });
  }

  // Read
  async find(findOptions?: FindManyOptions<Batiment>): Promise<Batiment[]> {
    const options = {
      take: 100,
      skip: 0,
      ...findOptions // overwrite default ones
    };
    // this.log.debug(`searching for max ${options.take} batiments with an offset of ${options.skip} ...`);
    return await this.batimentRepository.find(options);
  }

  async findOneById(id: number): Promise<Batiment> {
    // this.log.debug('trying to find one batiment by id...');
    return await this.batimentRepository.findOne({
        id: id
    });
  }

  findOneByName(nom: string): Promise<Batiment> {
    // this.log.debug('trying to find one batiment by nom...');
    return this.batimentRepository.findOne({
      nom: nom
    });
  }

  // Update
  async update(id: number, partialEntry: DeepPartial<Batiment>): Promise<UpdateResult> {
    // this.log.debug('trying to update batiment...');
    return await this.batimentRepository.update(id, partialEntry);
  }

  // Delete
  async remove(id: number): Promise<Batiment> {
    // this.log.debug('trying to remove batiment...');
    return await this.batimentRepository.remove(await this.findOneById(id));
  }
}
