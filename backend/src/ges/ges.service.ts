import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GES } from './ges.entity';
import { QueryService } from '../query/query.service';
import { Filtre } from '../filtre/filtre.entity';

@Injectable()
export class GESService {
    constructor(
        @InjectRepository(GES)
        private readonly gesRepository: Repository<GES>,
        private queryService: QueryService
    ) { }

    async getAll(idZoneIntervention: number, inQuery) {
        let query = this.gesRepository
            .createQueryBuilder('ges')
            .where('ges.idZoneIntervention = :idZoneIntervention', { idZoneIntervention: idZoneIntervention });
        query = this.queryService.parseQuery(query, inQuery);

        return await query.getMany()
    }

    async countAll(idZoneIntervention: number, inQuery: string) {
        let query = this.gesRepository
            .createQueryBuilder('ges')
            .where('ges.idZoneIntervention = :idZoneIntervention', { idZoneIntervention: idZoneIntervention });
        query = this.queryService.parseQuery(query, inQuery);

        return await query.getCount()
    }

    async get(idGES: number): Promise<GES> {

        return await this.gesRepository.createQueryBuilder('ges')
            .where('ges.id = :idGES', { idGES: idGES }).getOne()
    }

    async delete(idGES: number) {
        return await this.gesRepository.delete(idGES);
    }

    async create(ges: GES): Promise<GES> {

        const newGES = await this.gesRepository.create(ges);
        return await this.gesRepository.save(newGES);
    }

    async update(ges: GES): Promise<GES> {
        return await this.gesRepository.save(ges)
    }
}
