import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryService } from '../query/query.service';
import { CDomaineCompetence } from './domaine-competence.entity';

@Injectable()
export class DomaineCompetenceService {
    constructor(
        @InjectRepository(CDomaineCompetence)
        private readonly domaineCompetenceRepository: Repository<CDomaineCompetence>,
        private queryService: QueryService
    ) { }

    async getAll(inQuery: string): Promise<CDomaineCompetence[]> {
        let query = this.domaineCompetenceRepository.createQueryBuilder('domaine-competence');

        query = this.queryService.parseQuery(query, inQuery);
        return await query.getMany();
    }

    async getAllAffectable(idGroupe: number): Promise<CDomaineCompetence[]> {
        return await this.domaineCompetenceRepository.createQueryBuilder('typeFormation')
            .leftJoinAndSelect('typeFormation.groupe', 'groupe')
            .where('affectable = :affectable AND (idGroupe = :idGroupe OR idGroupe IS NULL)', { affectable: 1, idGroupe: idGroupe })
            .getMany();
    }

    async create(competence) {
        const e = await this.domaineCompetenceRepository.create(competence);
        return await this.domaineCompetenceRepository.save(e);
    }

    async update(competence) {
        return await this.domaineCompetenceRepository.save(competence);
    }

    async get(id: number) {
        return await this.domaineCompetenceRepository.createQueryBuilder('typeFormation')
            .where('typeFormation.id = :id', {id: id})
            .getOne()
    }
    
    async supprimer(id:number){
        return await this.domaineCompetenceRepository.remove(await this.findOneById(id));
    }

    async findOneById(id: number): Promise<CDomaineCompetence> {
        // this.log.debug('trying to find one menu by id...');
          const result = await this.domaineCompetenceRepository.findOne({
            id: id
          });
          return result;
      }
}
