import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MateriauZone } from './materiau-zone.entity';
import { QueryService } from '../query/query.service';


@Injectable()
export class MateriauZoneService {
    constructor(
        @InjectRepository(MateriauZone)
        private readonly materiauZoneRepository: Repository<MateriauZone>,
        private queryService: QueryService
    ) { }

    async getAll(idZone, inQuery) {
        let query = this.materiauZoneRepository
            .createQueryBuilder('materiauZone')
            .leftJoinAndSelect('materiauZone.materiau', 'materiau')
            .where('materiauZone.idZoneIntervention = :idZoneIntervention', { idZoneIntervention: idZone });
        query = this.queryService.parseQuery(query, inQuery);

        return await query.getMany();
    }

    async countAll(idZone, inQuery: string) {
        let query = this.materiauZoneRepository
            .createQueryBuilder('materiauZone')
            .where('materiauZone.idZoneIntervention = :idZoneIntervention', { idZoneIntervention: idZone });
        query = this.queryService.parseQuery(query, inQuery);

        return await query.getCount();
    }

    async get(idMateriauZone: number): Promise<MateriauZone> {

        return await this.materiauZoneRepository.createQueryBuilder('materiauZone')
            .leftJoinAndSelect('materiauZone.materiau', 'materiau')
            .where('materiauZone.id = :idMateriauZone', { idMateriauZone: idMateriauZone }).getOne();
    }

    async create(materiauZone: MateriauZone): Promise<MateriauZone> {

        const newMateriauZone = await this.materiauZoneRepository.create(materiauZone);
        return await this.materiauZoneRepository.save(newMateriauZone);
    }

    async update(materiauZone: MateriauZone): Promise<MateriauZone> {
        return await this.materiauZoneRepository.save(materiauZone);
    }

    async delete(id: number) {
        return await this.materiauZoneRepository.delete(id);
    }
}
