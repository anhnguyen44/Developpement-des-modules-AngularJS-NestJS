import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {QueryService} from '../query/query.service';
import {TacheProcessus} from './tache-processus.entity';

@Injectable()
export class TacheProcessusService {
    constructor(
        @InjectRepository(TacheProcessus)
        private readonly tacheProcessusRepository: Repository<TacheProcessus>,
        private queryService: QueryService
    ) {}

    async getAll(idFranchise: number): Promise<TacheProcessus[]>  {

        const query = this.tacheProcessusRepository
            .createQueryBuilder('tache-processus')
            .where('tache-processus.idFranchise = :idFranchise', {idFranchise: idFranchise});
        return await query.getMany()
    }

    async get(idTacheProcessus: number): Promise<TacheProcessus> {
        return await this.tacheProcessusRepository.createQueryBuilder('tache-processus')
            .where('tache-processus.id = :idTacheProcessus', {idTacheProcessus: idTacheProcessus}).getOne()
    }

    async create(tacheProcessus: TacheProcessus): Promise<TacheProcessus> {

        const newTacheProcessus =  await this.tacheProcessusRepository.create(tacheProcessus);
        return await this.tacheProcessusRepository.save(newTacheProcessus);
    }

    async update(tacheProcessus: TacheProcessus): Promise<TacheProcessus> {
        return await this.tacheProcessusRepository.save(tacheProcessus)
    }
}
