import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {QueryService} from '../query/query.service';
import {Debitmetre} from './debitmetre.entity';

@Injectable()
export class DebitmetreService {
    constructor(
        @InjectRepository(Debitmetre)
        private readonly debitmetreRepository: Repository<Debitmetre>,
        private queryService: QueryService
    ) {}

    async getAll(idFranchise: number, inQuery) {
        let query = this.debitmetreRepository
            .createQueryBuilder('debitmetre')
            .leftJoinAndSelect('debitmetre.bureau', 'bureau')
            .where('debitmetre.idFranchise = :idFranchise', {idFranchise: idFranchise});
        query = this.queryService.parseQuery(query, inQuery);

        return await query.getMany()
    }

    async countAll(idFranchise: number, inQuery: string) {
        let query = this.debitmetreRepository
            .createQueryBuilder('debitmetre')
            .leftJoinAndSelect('debitmetre.bureau', 'bureau')
            .where('debitmetre.idFranchise = :idFranchise', {idFranchise: idFranchise});
        query = this.queryService.parseQuery(query, inQuery);

        return await query.getCount()
    }

    async get(idDebitmetre: number): Promise<Debitmetre> {

        return await this.debitmetreRepository.createQueryBuilder('debitmetre')
            .leftJoinAndSelect('debitmetre.bureau', 'bureau')
            .where('debitmetre.id = :idDebitmetre', {idDebitmetre: idDebitmetre}).getOne()
    }

    async create(debitmetre: Debitmetre): Promise<Debitmetre> {

        const newDebitmetre =  await this.debitmetreRepository.create(debitmetre);
        return await this.debitmetreRepository.save(newDebitmetre);
    }

    async update(debitmetre: Debitmetre): Promise<Debitmetre> {
        return await this.debitmetreRepository.save(debitmetre)
    }

}
