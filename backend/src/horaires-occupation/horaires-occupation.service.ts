import { Injectable, Inject } from '@nestjs/common';
import { FindManyOptions, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { Log } from '../logger/logger';
import { HorairesOccupationLocaux } from './horaires-occupation.entity';
import { IHorairesOccupationLocaux } from '@aleaac/shared';
import { QueryService } from '../query/query.service';

@Injectable()
export class HorairesOccupationLocauxService {
  constructor(
    @InjectRepository(HorairesOccupationLocaux) private readonly horairesOccupationLocauxRepository: Repository<HorairesOccupationLocaux>,
    private readonly queryService: QueryService,
  ) { }

  // Create
  // Precondition: the horairesOccupationLocaux needs to have a unique nom
  async create(horairesOccupationLocauxDto: IHorairesOccupationLocaux): Promise<HorairesOccupationLocaux> {
    //const horairesOccupationLocaux = this.horairesOccupationLocauxRepository.create(horairesOccupationLocauxDto);

    const savedHorairesOccupationLocaux = await this.horairesOccupationLocauxRepository.save(horairesOccupationLocauxDto);
    // this.log.debug(JSON.stringify(savedHorairesOccupationLocaux));
    return savedHorairesOccupationLocaux;
  }

  // Read
  async find(findOptions?: FindManyOptions<HorairesOccupationLocaux>): Promise<HorairesOccupationLocaux[]> {
    const options = {
      take: 100,
      skip: 0,
      ...findOptions // overwrite default ones
    };
    // this.log.debug(`searching for max ${options.take} horairesOccupationLocauxs with an offset of ${options.skip} ...`);
    return await this.horairesOccupationLocauxRepository.find(options);
  }

  async findByChantier(idZoneIntervention: number, inQuery: string): Promise<HorairesOccupationLocaux[]> {
    let query = this.horairesOccupationLocauxRepository.createQueryBuilder('horairesOccupationLocaux')
            .where('horairesOccupationLocaux.idZIHoraires = :idZoneIntervention', {idZoneIntervention: idZoneIntervention});
        query = this.queryService.parseQuery(query, inQuery);
        return await query.getMany();
  }

  async findOneById(id: number): Promise<HorairesOccupationLocaux> {
    // this.log.debug('trying to find one horairesOccupationLocaux by id...');
    return await this.horairesOccupationLocauxRepository.findOne({
      id: id
    });
  }

  // Update
  async update(id: number, partialEntry: DeepPartial<HorairesOccupationLocaux>): Promise<UpdateResult> {
    // this.log.debug('trying to update horairesOccupationLocaux...');
    return await this.horairesOccupationLocauxRepository.update(id, partialEntry);
  }

  // Delete
  async remove(id: number): Promise<HorairesOccupationLocaux> {
    // this.log.debug('trying to remove horairesOccupationLocaux...');
    return await this.horairesOccupationLocauxRepository.remove(await this.findOneById(id));
  }
}
