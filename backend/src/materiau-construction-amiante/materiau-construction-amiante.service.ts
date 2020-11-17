import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {MateriauConstructionAmiante} from './materiau-construction-amiante.entity';
import {QueryService} from '../query/query.service';


@Injectable()
export class MateriauConstructionAmianteService {
    constructor(
        @InjectRepository(MateriauConstructionAmiante)
        private readonly materiauConstructionAmianteRepository: Repository<MateriauConstructionAmiante>,
        private queryService: QueryService
    ) {}

    async getAll(inQuery) {
        let query = this.materiauConstructionAmianteRepository
            .createQueryBuilder('materiauConstructionAmiante')
            //.where('materiauConstructionAmiante.idFranchise = :idFranchise', {idFranchise: idFranchise});
        query = this.queryService.parseQuery(query, inQuery);

        return await query.getMany()
    }

    async countAll(inQuery: string) {
        let query = this.materiauConstructionAmianteRepository
            .createQueryBuilder('materiauConstructionAmiante')
            //.where('materiauConstructionAmiante.idFranchise = :idFranchise', {idFranchise: idFranchise});
        query = this.queryService.parseQuery(query, inQuery);

        return await query.getCount()
    }

    async get(idMateriauConstructionAmiante: number): Promise<MateriauConstructionAmiante> {

        return await this.materiauConstructionAmianteRepository.createQueryBuilder('materiauConstructionAmiante')
            .where('materiauConstructionAmiante.id = :idMateriauConstructionAmiante', {idMateriauConstructionAmiante: idMateriauConstructionAmiante}).getOne()
    }

    async create(materiauConstructionAmiante: MateriauConstructionAmiante): Promise<MateriauConstructionAmiante> {

        const newMateriauConstructionAmiante =  await this.materiauConstructionAmianteRepository.create(materiauConstructionAmiante);
        return await this.materiauConstructionAmianteRepository.save(newMateriauConstructionAmiante);
    }

    async update(materiauConstructionAmiante: MateriauConstructionAmiante): Promise<MateriauConstructionAmiante> {
        return await this.materiauConstructionAmianteRepository.save(materiauConstructionAmiante);
    }

    async truncate() {
        return await this.materiauConstructionAmianteRepository.delete({});
    }
}
