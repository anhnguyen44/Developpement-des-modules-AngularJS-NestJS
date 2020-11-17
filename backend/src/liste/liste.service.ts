import { Injectable } from '@nestjs/common';
import { Repository, FindManyOptions, FindConditions, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Liste } from './liste.entity';
import { QueryService } from '../query/query.service';
import { ListeVerifExistenceDto } from '@aleaac/shared';
import { FranchiseService } from '../franchise/franchise.service';

@Injectable()
export class ListeService {
    constructor(
        @InjectRepository(Liste)
        private readonly listeRepository: Repository<Liste>,
        private queryService: QueryService,
        private franchiseService: FranchiseService,
    ) { }

    async getAll(inQuery) {
        let query = this.listeRepository
            .createQueryBuilder('liste')
        query = this.queryService.parseQuery(query, inQuery && inQuery.query ? inQuery.query : null);

        return await query.getMany()
    }

    async getListe(nomListe: string, inQuery): Promise<Liste[]> {
        const franchises = await this.franchiseService.getByUtilisateur(inQuery.user.id);
        const franchisesId = franchises.map(f => f.id);

        let query = this.listeRepository
            .createQueryBuilder('liste')
            .where('liste.nomListe = :nomListe AND (idFranchise IS NULL OR idFranchise in (:idsFranchise))',
            { nomListe: nomListe, idsFranchise: franchisesId });
        query = this.queryService.parseQuery(query, inQuery.query);

        return await query.getMany()
    }

    async verifExistence(dto: ListeVerifExistenceDto, req): Promise<boolean> {
        const listeComplete = await this.getListe(dto.nomListe, req);

        return listeComplete.find(l => l.valeur === dto.valeur) !== undefined;
    }

    async countAll(nomListe: string, inQuery) {
        const franchises = await this.franchiseService.getByUtilisateur(inQuery.user.id);
        const franchisesId = franchises.map(f => f.id);

        let query = this.listeRepository
            .createQueryBuilder('liste')
            .where('liste.nomListe = :nomListe AND (idFranchise IS NULL OR idFranchise in (:idsFranchise))',
            { nomListe: nomListe, idsFranchise: franchisesId });
        query = this.queryService.parseQuery(query, inQuery.query);

        return await query.getCount()
    }

    async get(idListe: number): Promise<Liste> {

        return await this.listeRepository.createQueryBuilder('liste')
            .where('liste.id = :idListe', { idListe: idListe }).getOne()
    }

    async create(liste: Liste): Promise<Liste> {

        const newListe = await this.listeRepository.create(liste);
        return await this.listeRepository.save(newListe);
    }

    async update(liste: Liste): Promise<Liste> {
        return await this.listeRepository.save(liste)
    }

    async truncateDefault(): Promise<DeleteResult> {
        console.warn('!!! TRUNCATE PARTIEL !!!');
        const options: FindConditions<Liste> = {
            isLivreParDefaut: true
        }
        return await this.listeRepository.delete(options)
    }
}
