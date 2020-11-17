import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProcessusZone } from './processus-zone.entity';
import { QueryService } from '../query/query.service';


@Injectable()
export class ProcessusZoneService {
    constructor(
        @InjectRepository(ProcessusZone)
        private readonly processusRepository: Repository<ProcessusZone>,
        private queryService: QueryService
    ) { }

    async getAll(inQuery): Promise<ProcessusZone[]> {
        let query = this.processusRepository.createQueryBuilder('processus')
        query = this.queryService.parseQuery(query, inQuery);

        return await query.getMany();
    }

    async getAllByProcessus(idProcessus, inQuery): Promise<ProcessusZone[]> {
        let query = this.processusRepository.createQueryBuilder('p')
            .leftJoinAndSelect('p.prelevements', 'prelevements')
            .leftJoinAndSelect('p.listeGES', 'listeGES')
            .leftJoinAndSelect('listeGES.taches', 'taches')
            .where('p.idProcessus = :idProcessus', { idProcessus: idProcessus });

        query = this.queryService.parseQuery(query, inQuery);

        return await query.getMany();
    }

    async getAllByZone(idZoneIntervention, inQuery): Promise<ProcessusZone[]> {
        let query = this.processusRepository.createQueryBuilder('p')
            .leftJoinAndSelect('p.processus', 'processus')
            .leftJoinAndSelect('processus.tachesInstallation', 'tachesInstallation')
            .leftJoinAndSelect('processus.tachesRetrait', 'tachesRetrait')
            .leftJoinAndSelect('processus.tachesRepli', 'tachesRepli')
            .leftJoinAndSelect('p.listeGES', 'listeGES')
            .leftJoinAndSelect('listeGES.taches', 'taches')
            .where('p.idZoneIntervention = :idZoneIntervention', { idZoneIntervention: idZoneIntervention });

        query = this.queryService.parseQuery(query, inQuery);

        return await query.getMany();
    }

    async get(idProcessusZone): Promise<ProcessusZone> {
        return await this.processusRepository.createQueryBuilder('p')
            .leftJoinAndSelect('p.processus', 'processus')
            .leftJoinAndSelect('processus.tachesInstallation', 'tachesInstallation')
            .leftJoinAndSelect('processus.tachesRetrait', 'tachesRetrait')
            .leftJoinAndSelect('processus.tachesRepli', 'tachesRepli')
            .leftJoinAndSelect('p.listeGES', 'listeGES')
            .leftJoinAndSelect('listeGES.taches', 'taches')
            .where('p.id = :idProcessusZone', { idProcessusZone: idProcessusZone }).getOne()
    }

    async create(processus: ProcessusZone): Promise<ProcessusZone> {
        const newProcessusZone = this.processusRepository.create(processus);
        return this.processusRepository.save(newProcessusZone);
    }

    async update(processus: ProcessusZone): Promise<ProcessusZone> {
        // console.log(processus)
        return this.processusRepository.save(processus);
    }

    async delete(processus: ProcessusZone): Promise<DeleteResult> {
        return await this.processusRepository.delete(processus.id);
    }
}
