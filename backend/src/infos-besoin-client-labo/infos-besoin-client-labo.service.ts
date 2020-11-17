import {Injectable, Inject} from '@nestjs/common';
import {FindManyOptions, Repository, UpdateResult} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {DeepPartial} from 'typeorm/common/DeepPartial';
import {Log} from '../logger/logger';
import { InfosBesoinClientLabo } from './infos-besoin-client-labo.entity';
import { IInfosBesoinClientLabo } from '@aleaac/shared';
import {CUtilisateur} from '../utilisateur/utilisateur.entity';

@Injectable()
export class InfosBesoinClientLaboService {
  constructor(
    @InjectRepository(InfosBesoinClientLabo) private readonly besoinClientLaboRepository: Repository<InfosBesoinClientLabo>,
    // private readonly log: Log,
  ) {}

  // Create
  // Precondition: the besoinClientLabo needs to have a unique nom
  async create(besoinClientLaboDto: IInfosBesoinClientLabo): Promise<InfosBesoinClientLabo> {
    // this.log.debug('trying to create user...');

    const besoinClientLabo = this.besoinClientLaboRepository.create(besoinClientLaboDto);

    const savedInfosBesoinClientLabo = await this.besoinClientLaboRepository.save(besoinClientLabo);
    // this.log.debug(JSON.stringify(savedInfosBesoinClientLabo));
    return savedInfosBesoinClientLabo;
  }

  // Read
  async find(findOptions?: FindManyOptions<InfosBesoinClientLabo>): Promise<InfosBesoinClientLabo[]> {
    const options = {
      take: 100,
      skip: 0,
      ...findOptions // overwrite default ones
    };
    // this.log.debug(`searching for max ${options.take} besoinClientLabos with an offset of ${options.skip} ...`);
    return await this.besoinClientLaboRepository.find(options);
  }

  async findOneById(id: number): Promise<InfosBesoinClientLabo> {
    // this.log.debug('trying to find one besoinClientLabo by id...');
    return await this.besoinClientLaboRepository.findOne({
        id: id
    });
  }

  // Update
  async update(id: number, partialEntry: DeepPartial<InfosBesoinClientLabo>): Promise<UpdateResult> {
    // this.log.debug('trying to update besoinClientLabo...');
    return await this.besoinClientLaboRepository.update(id, partialEntry);
  }

  // Delete
  async remove(id: number): Promise<InfosBesoinClientLabo> {
    // this.log.debug('trying to remove besoinClientLabo...');
    return await this.besoinClientLaboRepository.remove(await this.findOneById(id));
  }
}
