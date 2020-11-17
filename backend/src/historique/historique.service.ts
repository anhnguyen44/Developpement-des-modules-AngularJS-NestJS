import {Injectable} from '@nestjs/common';
import {Historique} from './historique.entity';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {QueryService} from '../query/query.service';

@Injectable()
export class HistoriqueService {
    constructor(
        @InjectRepository(Historique)
        private readonly historiqueRepository: Repository<Historique>,
        private queryService: QueryService
    ) {}

    async getByApplication(
        application: string,
        idParent: number,
        inQuery: string
    ): Promise<Historique[]> {
        let query = this.historiqueRepository.createQueryBuilder('historique')
            .leftJoinAndSelect('historique.utilisateur', 'utilisateur')
            .where('historique.application = :application && historique.idParent = :idParent',
                {application: application, idParent: idParent});
        query = this.queryService.parseQuery(query, inQuery);
        return await query.getMany();
    }


    async countByApplication(application: string, idParent: number): Promise<number> {
        return await this.historiqueRepository.count({
            application: application,
            idParent: idParent
        })
    }

    async add (idUser, application, idParent, description) {
        const historique = new Historique();
        historique.idUser = idUser;
        historique.application = application;
        historique.idParent = idParent;
        historique.date = new Date()
        historique.description = description;
        const newHistorique = await this.historiqueRepository.create(historique);
        await  this.historiqueRepository.save(newHistorique);
    }

    async create(historique: Historique): Promise<Historique> {
        const newHistorique = await this.historiqueRepository.create(historique);
        return await  this.historiqueRepository.save(newHistorique);
    }
}
