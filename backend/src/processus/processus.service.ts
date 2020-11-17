import {Injectable} from '@nestjs/common';
import {DeleteResult, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Processus} from './processus.entity';
import {QueryService} from '../query/query.service';


@Injectable()
export class ProcessusService {
    constructor(
        @InjectRepository(Processus)
        private readonly processusRepository: Repository<Processus>,
        private queryService: QueryService
    ) {}

    async getAll(idCompte, inQuery): Promise<Processus[]> {
        let query =  this.processusRepository.createQueryBuilder('processus')
            .leftJoinAndSelect('processus.prelevements', 'prelevements')
            .leftJoinAndSelect('processus.tachesInstallation', 'tachesInstallation')
            .leftJoinAndSelect('processus.tachesRetrait', 'tachesRetrait')
            .leftJoinAndSelect('processus.tachesRepli', 'tachesRepli')
            .where('idCompte = :idCompte', {idCompte: idCompte});

        query = this.queryService.parseQuery(query, inQuery);

        return await query.getMany();
    }

    async get(idProcessus): Promise<Processus> {
        return await this.processusRepository.createQueryBuilder('processus')
            .leftJoinAndSelect('processus.tachesInstallation', 'tachesInstallation')
            .leftJoinAndSelect('processus.tachesRetrait', 'tachesRetrait')
            .leftJoinAndSelect('processus.tachesRepli', 'tachesRepli')
            .where('processus.id = :idProcessus', {idProcessus: idProcessus}).getOne()
    }

    async create(processus: Processus): Promise<Processus> {
        const newProcessus = this.processusRepository.create(processus);
        return this.processusRepository.save(newProcessus);
    }

    async update(processus: Processus): Promise<Processus> {
        return this.processusRepository.save(processus);
    }

    async delete(processus: Processus): Promise<DeleteResult> {
        return await this.processusRepository.delete(processus.id);
    }
}
