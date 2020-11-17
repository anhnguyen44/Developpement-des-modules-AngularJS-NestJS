import { Injectable } from '@nestjs/common';
import { CFormation } from './formation.entity';
import { Repository, FindManyOptions, DeepPartial } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryService } from '../query/query.service';
import { HistoriqueService } from '../historique/historique.service';
import { CurrentUtilisateur } from '../utilisateur/utilisateur.decorator';
import { Compte } from '../compte/compte.entity';

@Injectable()
export class FormationService {

    constructor(
        @InjectRepository(CFormation)
        private readonly formationRepository: Repository<CFormation>,
        private queryService: QueryService,
        private historiqueService: HistoriqueService,
    ) { }

    async create(formationDto: CFormation):Promise<CFormation>{
        const saveFormation = await this.formationRepository.save(formationDto);
        return saveFormation;
    }

    async getAll(inQuery: string):Promise<CFormation[]>{
        let query = this.formationRepository.createQueryBuilder('formation')
        .leftJoinAndSelect('formation.salle','salle')
        .leftJoinAndSelect('formation.bureau','bureau')
        .leftJoinAndSelect('bureau.adresse','adresseBureau')
        .leftJoinAndSelect('formation.formateur','formateur-formation')
        .leftJoinAndSelect('formateur-formation.formateur','rh')
        .leftJoinAndSelect('rh.utilisateur','utilisateur')
        // .leftJoinAndSelect('formation.formateur','utilisateur')
        .leftJoinAndSelect('formation.typeFormation','type_formation')
        .leftJoinAndSelect('formation.stagiaire','formation_contact');

        query = this.queryService.parseQuery(query, inQuery);
        return await query.getMany();
    }

    async getById(id: number):Promise<CFormation>{
        let query = this.formationRepository.createQueryBuilder('formation')
        .leftJoinAndSelect('formation.salle','salle')
        .leftJoinAndSelect('formation.bureau','bureau')
        .leftJoinAndSelect('bureau.adresse','adresseBureau')
        .leftJoinAndSelect('formation.formateur','formateur-formation')
        .leftJoinAndSelect('formateur-formation.formateur','rh')
        .leftJoinAndSelect('rh.utilisateur','utilisateur')
        // .leftJoinAndSelect('formation_contact.noteCompetence','note-competence-stagiaire')
        .leftJoinAndSelect('formation.typeFormation','type_formation')
        .leftJoinAndSelect('type_formation.dCompetence','tFormation-dCompetence')
        .leftJoinAndSelect('tFormation-dCompetence.dCompetence','domaine-competence')
        // .leftJoinAndSelect('formation.stagiaire','formation_contact')
        .orderBy('tFormation-dCompetence.dCompetence','ASC')
        .where('formation.id =:number',{number: id});
        

        return await query.getOne();
    }

    async getAllByIdFranchise(id: number,inQuery: string):Promise<CFormation[]>{
        let query = this.formationRepository.createQueryBuilder('formation')
        .leftJoinAndSelect('formation.salle','salle')
        .leftJoinAndSelect('formation.bureau','bureau')
        .leftJoinAndSelect('bureau.adresse','adresseBureau')
        .leftJoinAndSelect('formation.formateur','formateur-formation')
        .leftJoinAndSelect('formateur-formation.formateur','rh')
        .leftJoinAndSelect('rh.utilisateur','utilisateur')
        .leftJoinAndSelect('formation.typeFormation','type_formation')
        .leftJoinAndSelect('formation.stagiaire','formation_contact')
        .where('formation.idFranchise=:id',{id:id});

        query = this.queryService.parseQuery(query, inQuery);

        return await query.getMany();
    }

    async getTypeFormationNull(id: number):Promise<CFormation>{
        let query = this.formationRepository.createQueryBuilder('formation')
        .leftJoinAndSelect('formation.salle','salle')
        .leftJoinAndSelect('formation.bureau','bureau')
        .leftJoinAndSelect('formation.typeFormation','type_formation')
        .where('formation.idTypeFormation =:number',{number: id});

        return await query.getOne();
    }

    async update(id: number, partialEntry: DeepPartial<CFormation>){
        return await this.formationRepository.update(id, partialEntry);
    }

    async delete(id: number) {
    const forma = await this.formationRepository.createQueryBuilder('formation')
        .where('id = :id', {id: id}).getOne();
    return await this.formationRepository.remove(forma);
    }


}