import {Injectable, Inject} from '@nestjs/common';
import {FindManyOptions, Repository, UpdateResult} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {DeepPartial} from 'typeorm/common/DeepPartial';
import {Log} from '../logger/logger';
import { MomentObjectif } from './moment-objectif.entity';
import { IMomentObjectif } from '@aleaac/shared';
import {CUtilisateur} from '../utilisateur/utilisateur.entity';

@Injectable()
export class MomentObjectifService {
  constructor(
    @InjectRepository(MomentObjectif) private readonly momentObjectifRepository: Repository<MomentObjectif>,
    // private readonly log: Log,
  ) {}

  // Create
  // Precondition: the momentObjectif needs to have a unique nom
  async create(momentObjectifDto: IMomentObjectif): Promise<MomentObjectif> {
    // this.log.debug('trying to create user...');

    const existingMomentObjectif = await this.momentObjectifExists(momentObjectifDto.nom);
    if (existingMomentObjectif) {
      throw new Error('MomentObjectif already exists');
    }

    const momentObjectif = this.momentObjectifRepository.create(momentObjectifDto);

    const savedMomentObjectif = await this.momentObjectifRepository.save(momentObjectif);
    // this.log.debug(JSON.stringify(savedMomentObjectif));
    return savedMomentObjectif;
  }

  momentObjectifExists(nom: string): Promise<boolean> {
    // this.log.debug('checking if momentObjectif exists...');
    return this.findOneByName(nom).then(user => {
      return !!user;
    });
  }

  // Read
  async find(findOptions?: FindManyOptions<MomentObjectif>): Promise<MomentObjectif[]> {
    const options = {
      take: 100,
      skip: 0,
      ...findOptions // overwrite default ones
    };
    // this.log.debug(`searching for max ${options.take} momentObjectifs with an offset of ${options.skip} ...`);
    return await this.momentObjectifRepository.find(options);
  }

  async findOneById(id: number): Promise<MomentObjectif> {
    // this.log.debug('trying to find one momentObjectif by id...');
    return await this.momentObjectifRepository.findOne({
        id: id
    });
  }

  findOneByName(nom: string): Promise<MomentObjectif> {
    // this.log.debug('trying to find one momentObjectif by nom...');
    return this.momentObjectifRepository.findOne({
      nom: nom
    });
  }

  // Update
  async update(id: number, partialEntry: DeepPartial<MomentObjectif>): Promise<UpdateResult> {
    // this.log.debug('trying to update momentObjectif...');
    return await this.momentObjectifRepository.update(id, partialEntry);
  }

  // Delete
  async remove(id: number): Promise<MomentObjectif> {
    // this.log.debug('trying to remove momentObjectif...');
    return await this.momentObjectifRepository.remove(await this.findOneById(id));
  }
}
