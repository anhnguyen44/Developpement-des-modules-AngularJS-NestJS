import {Injectable, Inject} from '@nestjs/common';
import {FindManyOptions, Repository, UpdateResult} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {DeepPartial} from 'typeorm/common/DeepPartial';

import {Log} from '../logger/logger';
import { Droit } from './droit.entity';
import { IDroit } from '@aleaac/shared';
import {QueryService} from '../query/query.service';

@Injectable()
export class DroitService {
  constructor(
    @InjectRepository(Droit)
    private readonly droitRepository: Repository<Droit>,
    private queryService: QueryService
    // private readonly log: Log,
  ) {}

  // Create
  // Precondition: the droit needs to have a unique nom
  async create(droitDto: IDroit): Promise<Droit> {
    // this.log.debug('trying to create user...');

    const existingDroit = await this.droitExists(droitDto.nom);
    if (existingDroit) {
      throw new Error('Droit already exists');
    }

    const droit = this.droitRepository.create(droitDto);

    const savedDroit = await this.droitRepository.save(droit);
    // this.log.debug(JSON.stringify(savedDroit));
    return savedDroit;
  }

  droitExists(nom: string): Promise<boolean> {
    // this.log.debug('checking if droit exists...');
    return this.findOneByName(nom).then(user => {
      return !!user;
    });
  }

  // Read
  async find(inQuery?: string): Promise<Droit[]> {

    let query = this.droitRepository.createQueryBuilder('droit');

    if (inQuery) {
        query = this.queryService.parseQuery(query, inQuery);
    }

    return await query.getMany()
  }

  async count(inQuery?: string): Promise<number> {
      let query = this.droitRepository.createQueryBuilder('droit');

      if (inQuery) {
          query = this.queryService.parseQuery(query, inQuery);
      }

      return await query.getCount()
  }

  async findOneById(id: number): Promise<Droit> {
    // this.log.debug('trying to find one droit by id...');
    return await this.droitRepository.findOne({
        id: id
    });
  }

  findOneByName(nom: string): Promise<Droit> {
    // this.log.debug('trying to find one droit by nom...');
    return this.droitRepository.findOne({
      nom: nom
    });
  }

  async getDroitForMenu(): Promise<Droit[]>{
    return await this.droitRepository.createQueryBuilder('droit').where('droit.code like :name', {name: '%MENUS_SEE%'}).getMany();
  }

  // Update
  async update(id: number, partialEntry: DeepPartial<Droit>): Promise<UpdateResult> {
    // this.log.debug('trying to update droit...');
    return await this.droitRepository.update(id, partialEntry);
  }

  // Delete
  async remove(id: number): Promise<Droit> {
    // this.log.debug('trying to remove droit...');
    return await this.droitRepository.remove(await this.findOneById(id));
  }
}
