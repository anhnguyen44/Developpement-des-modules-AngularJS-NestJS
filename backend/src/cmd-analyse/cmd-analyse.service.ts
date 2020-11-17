import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Prelevement} from './prelevement.entity';
import {QueryService} from '../query/query.service';
import {CmdAnalyse} from './cmd-analyse.entity';


@Injectable()
export class CmdAnalyseService {
    constructor(
        @InjectRepository(CmdAnalyse)
        private readonly cmdAnalyseRepository: Repository<CmdAnalyse>,
        private queryService: QueryService
    ) {}

    async getAll(idChantier, inQuery): Promise<Prelevement[]> {
        let query = this.cmdAnalyseRepository.createQueryBuilder('cmdAnalyse')
            .where('idChantier = :idChantier', {idChantier: 'idChantier'});

        query = this.queryService.parseQuery(query, inQuery);

        return await query.getMany();
    }

    async countAll(idChantier, inQuery): Promise<number> {
        let query = this.cmdAnalyseRepository.createQueryBuilder('cmdAnalyse')
            .where('idChantier = :idChantier', {idChantier: 'idChantier'});
        query = this.queryService.parseQuery(query, inQuery);

        return await query.getCount();
    }

    async get(idCmdAnalyse: number): Promise<CmdAnalyse> {
        return await this.cmdAnalyseRepository.createQueryBuilder('cmdAnalyse')
            .where('cmdAnalyse.id = :idCmdAnalyse', {idCmdAnalyse: idCmdAnalyse})
            .getOne()
    }

    async create(cmdAnalyse: CmdAnalyse): Promise<CmdAnalyse> {

        const newCmdAnalyse = await this.cmdAnalyseRepository.create(cmdAnalyse);
        return await this.cmdAnalyseRepository.save(newCmdAnalyse)
    }

    async update(cmdAnalyse: CmdAnalyse): Promise<CmdAnalyse> {
        return await this.cmdAnalyseRepository.save(cmdAnalyse)
    }
}
