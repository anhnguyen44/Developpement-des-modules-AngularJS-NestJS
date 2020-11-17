import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {QueryService} from '../query/query.service';
import {StationMeteo} from './station-meteo.entity';

@Injectable()
export class StationMeteoService {
    constructor(
        @InjectRepository(StationMeteo)
        private readonly stationMeteoRepository: Repository<StationMeteo>,
        private queryService: QueryService
    ) {}

    async getAll(idFranchise: number, inQuery): Promise<StationMeteo[]>  {
        let query = this.stationMeteoRepository
            .createQueryBuilder('stationMeteo')
            .leftJoinAndSelect('stationMeteo.bureau', 'bureau')
            .where('stationMeteo.idFranchise = :idFranchise', {idFranchise: idFranchise});
        query = this.queryService.parseQuery(query, inQuery);

        return await query.getMany()
    }

    async countAll(idFranchise: number, inQuery: string): Promise<number>  {
        let query = this.stationMeteoRepository
            .createQueryBuilder('stationMeteo')
            .leftJoinAndSelect('stationMeteo.bureau', 'bureau')
            .where('stationMeteo.idFranchise = :idFranchise', {idFranchise: idFranchise});
        query = this.queryService.parseQuery(query, inQuery);

        return await query.getCount()
    }

    async get(idStationMeteo: number): Promise<StationMeteo> {

        return await this.stationMeteoRepository.createQueryBuilder('stationMeteo')
            .leftJoinAndSelect('stationMeteo.bureau', 'bureau')
            .where('stationMeteo.id = :idStationMeteo', {idStationMeteo: idStationMeteo}).getOne()
    }

    async create(stationMeteo: StationMeteo): Promise<StationMeteo> {

        const newStationMeteo =  await this.stationMeteoRepository.create(stationMeteo);
        return await this.stationMeteoRepository.save(newStationMeteo);
    }

    async update(consommable: StationMeteo): Promise<StationMeteo> {
        return await this.stationMeteoRepository.save(consommable)
    }
}
