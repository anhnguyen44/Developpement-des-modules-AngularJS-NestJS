import {Injectable, Inject} from '@nestjs/common';
import {FindManyOptions, Repository, UpdateResult} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {DeepPartial} from 'typeorm/common/DeepPartial';
import {Log} from '../logger/logger';
import { BesoinClientLabo } from './besoin-client-labo.entity';
import { IBesoinClientLabo } from '@aleaac/shared';
import {CUtilisateur} from '../utilisateur/utilisateur.entity';

@Injectable()
export class BesoinClientLaboService {
  constructor(
    @InjectRepository(BesoinClientLabo) private readonly besoinClientLaboRepository: Repository<BesoinClientLabo>,
    // private readonly log: Log,
  ) {}

  // Create
  // Precondition: the besoinClientLabo needs to have a unique nom
  async create(besoinClientLaboDto: IBesoinClientLabo): Promise<BesoinClientLabo> {
    // this.log.debug('trying to create user...');

    const besoinClientLabo = await this.besoinClientLaboRepository.create(besoinClientLaboDto);
    const savedBesoinClientLabo = await this.besoinClientLaboRepository.save(besoinClientLabo);

    // this.log.debug(JSON.stringify(savedBesoinClientLabo));
    return savedBesoinClientLabo;
  }

  // Read
  async find(findOptions?: FindManyOptions<BesoinClientLabo>): Promise<BesoinClientLabo[]> {
    const options = {
      take: 100,
      skip: 0,
      ...findOptions // overwrite default ones
    };
    // this.log.debug(`searching for max ${options.take} besoinClientLabos with an offset of ${options.skip} ...`);
    return await this.besoinClientLaboRepository.find(options);
  }

  async findOneById(id: number): Promise<BesoinClientLabo> {
    // this.log.debug('trying to find one besoinClientLabo by id...');
    const options: FindManyOptions<BesoinClientLabo> = {
      relations: ['chantier']
    }
    return await this.besoinClientLaboRepository.findOne({
        id: id
    }, options);
  }

  // Update
  async update(id: number, partialEntry: DeepPartial<BesoinClientLabo> | any): Promise<UpdateResult> {
    // this.log.debug('trying to update besoinClientLabo...');
    if (partialEntry.besoinClientLaboId) {
      delete partialEntry.besoinClientLaboId;
    }

    //await this.besoinClientLaboRepository.save(partialEntry);
    return await this.besoinClientLaboRepository.save(partialEntry);
  }

  // Delete
  async remove(id: number): Promise<BesoinClientLabo> {
    // this.log.debug('trying to remove besoinClientLabo...');
    return await this.besoinClientLaboRepository.remove(await this.findOneById(id));
  }
}
