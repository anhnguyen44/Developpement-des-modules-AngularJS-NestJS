import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Consommable} from './consommable.entity';
import {QueryService} from '../query/query.service';
import {Filtre} from '../filtre/filtre.entity';

@Injectable()
export class ConsommableService {
    constructor(
        @InjectRepository(Consommable)
        private readonly consommableRepository: Repository<Consommable>,
        private queryService: QueryService
    ) {}

    async getAll(idFranchise: number, inQuery): Promise<Consommable[]>  {
        let query = this.consommableRepository
            .createQueryBuilder('consommable')
            .leftJoinAndSelect('consommable.bureau', 'bureau')
            .where('consommable.idFranchise = :idFranchise', {idFranchise: idFranchise});
        query = this.queryService.parseQuery(query, inQuery);

        return await query.getMany()
    }

    async countAll(idFranchise: number, inQuery: string): Promise<number>  {
        let query = this.consommableRepository
            .createQueryBuilder('consommable')
            .leftJoinAndSelect('consommable.bureau', 'bureau')
            .where('consommable.idFranchise = :idFranchise', {idFranchise: idFranchise});
        query = this.queryService.parseQuery(query, inQuery);

        return await query.getCount()
    }

    async get(idConsommable: number): Promise<Consommable> {

        return await this.consommableRepository.createQueryBuilder('consommable')
            .leftJoinAndSelect('consommable.bureau', 'bureau')
            .where('consommable.id = :idConsommable', {idConsommable: idConsommable}).getOne()
    }

    async create(consommable: Consommable): Promise<Consommable> {

        const newConsommable =  await this.consommableRepository.create(consommable);
        return await this.consommableRepository.save(newConsommable);
    }

    async update(consommable: Consommable): Promise<Consommable> {
        return await this.consommableRepository.save(consommable)
    }
}
