import { Injectable } from '@nestjs/common';
import { Repository, FindManyOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeFormation } from './type-formation.entity';
import { QueryService } from '../query/query.service';

@Injectable()
export class TypeFormationService {
    constructor(
        @InjectRepository(TypeFormation)
        private readonly typeFormationRepository: Repository<TypeFormation>,
        private queryService: QueryService
    ) { }

    async getAll(inQuery: string): Promise<TypeFormation[]> {
        let query = this.typeFormationRepository.createQueryBuilder('tf')
            .leftJoinAndSelect('tf.product', 'product')
            .leftJoinAndSelect('tf.dCompetence', 'compPratique')
            .leftJoinAndSelect('compPratique.dCompetence', 'domaineCompetence');
            // .where('compPratique.typePratique = :boolean',{boolean:1});

        query = this.queryService.parseQuery(query, inQuery);
        return await query.getMany();
    }

    async getAllPratique(inQuery: string): Promise<TypeFormation[]> {

        const opt: FindManyOptions<TypeFormation> = {
            where: {
                typePratique: true
            }
        }
        let query = this.typeFormationRepository.createQueryBuilder('typeFormation')
            .leftJoinAndSelect('typeFormation.product', 'product')
            .leftJoinAndSelect('typeFormation.dCompetence', 'compPratique')
            .leftJoinAndSelect('compPratique.dCompetence', 'domaineCompetence')
            .where('typePratique = 1');

        query = this.queryService.parseQuery(query, inQuery);
        return await query.getMany();
    }

    async getAllQueryBuild(inQuery: string):Promise<TypeFormation[]> {
        let query = this.typeFormationRepository.createQueryBuilder('type-formation')
            .leftJoinAndSelect('type-formation.product', 'product')
            .leftJoinAndSelect('type-formation.dCompetence', 'compPratique')
            .leftJoinAndSelect('compPratique.dCompetence', 'domaineCompetence');
            // .where('compPratique.typePratique = :boolean',{boolean:1});

        query = this.queryService.parseQuery(query, inQuery);
        return await query.getMany();
    }

    async getAllAffectable(idGroupe: number): Promise<TypeFormation[]> {
        return await this.typeFormationRepository.createQueryBuilder('typeFormation')
            .leftJoinAndSelect('typeFormation.groupe', 'groupe')
            .where('affectable = :affectable AND (idGroupe = :idGroupe OR idGroupe IS NULL)', { affectable: 1, idGroupe: idGroupe })
            .getMany();
    }

    async create(typeFormation) {
        const newTypeFichier = await this.typeFormationRepository.create(typeFormation);
        return await this.typeFormationRepository.save(newTypeFichier);
    }

    async update(typeFormation) {
        return await this.typeFormationRepository.save(typeFormation);
    }

    async get(id: number) {
        return await this.typeFormationRepository.createQueryBuilder('typeFormation')
        .leftJoinAndSelect('typeFormation.product', 'product')
        .leftJoinAndSelect('typeFormation.dCompetence', 'compPratique')
        .leftJoinAndSelect('compPratique.dCompetence', 'domaineCompetence')
        .where('typeFormation.id = :id', { id: id })
        .getOne()
    }

    async supprimer(id: number) {
        return await this.typeFormationRepository.remove(await this.findOneById(id));
    }

    async findOneById(id: number): Promise<TypeFormation> {
        // this.log.debug('trying to find one menu by id...');
        const result = await this.typeFormationRepository.findOne({
            id: id
        });
        return result;
    }
}
