import { Injectable, NotFoundException } from '@nestjs/common';
import { Log } from '../logger/logger';
import { FindManyOptions, Repository, DeepPartial, UpdateResult, FindOperator, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryService } from '../query/query.service';
import { CNoteCompetenceStagiaire } from './note-competence-stagiaire.entity';
import { HistoriqueService } from '../historique/historique.service';

@Injectable()
export class NoteCompetenceStagiaireService {

    constructor(
        @InjectRepository(CNoteCompetenceStagiaire)
        private readonly noteCompetenceStagiaireRepository: Repository<CNoteCompetenceStagiaire>,
        private queryService: QueryService,
        private historiqueService: HistoriqueService,
    ) { }


    async create(note: CNoteCompetenceStagiaire): Promise<CNoteCompetenceStagiaire> {
        const saveNote = await this.noteCompetenceStagiaireRepository.save(note);
        return saveNote;
    }

    async getAllByIdStagiaire(id: number): Promise<CNoteCompetenceStagiaire[]> {
        const query = this.noteCompetenceStagiaireRepository.createQueryBuilder('note-competence-stagiaire')
            .leftJoinAndSelect('note-competence-stagiaire.stagiaire', 'formation-contact')
            .leftJoinAndSelect('note-competence-stagiaire.competence', 'tFormation-dCompetence')
            .leftJoinAndSelect('tFormation-dCompetence.dCompetence', 'domaine-competence')
            .orderBy('tFormation-dCompetence.dCompetence', 'ASC')
            .where('note-competence-stagiaire.idStagiaire=:number', { number: id });

        return await query.getMany();
    }

    async getNotesPratiqueByIdSta(id: number): Promise<CNoteCompetenceStagiaire[]> {
        const query = this.noteCompetenceStagiaireRepository.createQueryBuilder('note-competence-stagiaire')
            .leftJoinAndSelect('note-competence-stagiaire.stagiaire', 'formation-contact')
            .leftJoinAndSelect('note-competence-stagiaire.competence', 'tFormation-dCompetence')
            .leftJoinAndSelect('tFormation-dCompetence.dCompetence', 'domaine-competence')
            .orderBy('tFormation-dCompetence.dCompetence', 'ASC')
            .where('note-competence-stagiaire.idStagiaire=:number', { number: id })
            .andWhere('tFormation-dCompetence.typePratique=:boo',{boo: true});
        return await query.getMany();
    }

    async getAllPratiqueMoins60ByIdStagiaire(id: number): Promise<CNoteCompetenceStagiaire[]> {
        const query = this.noteCompetenceStagiaireRepository.createQueryBuilder('note-competence-stagiaire')
            .leftJoinAndSelect('note-competence-stagiaire.stagiaire', 'formation-contact')
            .leftJoinAndSelect('note-competence-stagiaire.competence', 'tFormation_dCompetence')
            .leftJoinAndSelect('tFormation_dCompetence.dCompetence', 'domaine-competence')
            .where('note-competence-stagiaire.idStagiaire = :number', { number: id })
            .andWhere('tFormation_dCompetence.typePratique = :boo',{boo: true})
            .andWhere('note-competence-stagiaire.note < :num',{num:60});
        return await query.getMany();
    }

    async getAllTheoriqueMoins60ByIdStagiaire(id: number): Promise<CNoteCompetenceStagiaire[]> {
        const query = this.noteCompetenceStagiaireRepository.createQueryBuilder('note-competence-stagiaire')
            .leftJoinAndSelect('note-competence-stagiaire.stagiaire', 'formation-contact')
            .leftJoinAndSelect('note-competence-stagiaire.competence', 'tFormation_dCompetence')
            .leftJoinAndSelect('tFormation_dCompetence.dCompetence', 'domaine-competence')
            .where('note-competence-stagiaire.idStagiaire = :number', { number: id })
            .andWhere('tFormation_dCompetence.typePratique = :boo',{boo: false})
            .andWhere('note-competence-stagiaire.note < :num',{num:60});
        return await query.getMany();
    }

    async getNotesTheoriqueByIdSta(id: number): Promise<CNoteCompetenceStagiaire[]> {
        const query = this.noteCompetenceStagiaireRepository.createQueryBuilder('note-competence-stagiaire')
            .leftJoinAndSelect('note-competence-stagiaire.stagiaire', 'formation-contact')
            .leftJoinAndSelect('note-competence-stagiaire.competence', 'tFormation-dCompetence')
            .leftJoinAndSelect('tFormation-dCompetence.dCompetence', 'domaine-competence')
            .orderBy('tFormation-dCompetence.dCompetence', 'ASC')
            .where('note-competence-stagiaire.idStagiaire=:number', { number: id })
            .andWhere('tFormation-dCompetence.typePratique=:boo',{boo: false});
        return await query.getMany();
    }

    async getAllByIdTypeForma(id: number): Promise<CNoteCompetenceStagiaire[]> {
        const query = this.noteCompetenceStagiaireRepository.createQueryBuilder('note-competence-stagiaire')
            .leftJoinAndSelect('note-competence-stagiaire.stagiaire', 'formation-contact')
            .leftJoinAndSelect('formation-contact.formation', 'formation')
            .leftJoinAndSelect('formation.typeFormation', 'type-formation')
            .where('type-formation.id=:number', { number: id })

        return await query.getMany();
    }
   

    // async getById(idSession:number, id:number):Promise<CFormationContact>{
    //     let query = this.formationContactRepository.createQueryBuilder('formation-contact')
    //     .leftJoinAndSelect('formation-contact.formation','formation')
    //     .leftJoinAndSelect('formation-contact.contact','contact')
    //     .leftJoinAndSelect('formation-contact.sousTraitance','compte')
    //     .leftJoinAndSelect('formation-contact.dossierComplet','fichier')
    //     .leftJoinAndSelect('formation.salle','salle')
    //     .where('formation-contact.idFormation=:number',{number:idSession})
    //     .andWhere('formation-contact.idContact=:number2',{number2:id});

    //     return await query.getOne();
    // }

    // async getStaById(id:number):Promise<CFormationContact>{
    //     let query = this.formationContactRepository.createQueryBuilder('formation-contact')
    //     .leftJoinAndSelect('formation-contact.formation','formation')
    //     .leftJoinAndSelect('formation.typeFormation','type-formation')
    //     .leftJoinAndSelect('formation-contact.contact','contact')
    //     .leftJoinAndSelect('contact.civilite','civilite')
    //     .leftJoinAndSelect('formation-contact.sousTraitance','compte')
    //     .leftJoinAndSelect('formation-contact.dossierComplet','fichier')
    //     .where('formation-contact.id=:number',{number:id})

    //     return await query.getOne();
    // }

    // async getAllByIdFormation(inQuery: string, id:number):Promise<CFormationContact[]>{
    //     let query = this.formationContactRepository.createQueryBuilder('formation-contact')
    //     .leftJoinAndSelect('formation-contact.formation','formation')
    //     .leftJoinAndSelect('formation.typeFormation','type-formation')
    //     .leftJoinAndSelect('formation-contact.contact','contact')
    //     .leftJoinAndSelect('contact.civilite','civilite')
    //     .leftJoinAndSelect('formation-contact.sousTraitance','compte')
    //     .leftJoinAndSelect('formation-contact.dossierComplet','fichier')
    //     .where('formation-contact.idFormation=:number',{number:id});


    //     query = this.queryService.parseQuery(query, inQuery);
    //     return await query.getMany();
    // }

    async update(id: number, partialEntry: DeepPartial<CNoteCompetenceStagiaire>) {
        return await this.noteCompetenceStagiaireRepository.update(id, partialEntry);
    }

    async deleteByIdNote(id: number) {
        // return await this.formationRhRepository.delete(RhFormationValide,{RhFormationValide.idRh:id});
        // return await this.formationRhRepository.delete(RhFormationValide, { idRh : id } );

        return await this.noteCompetenceStagiaireRepository.createQueryBuilder()
            .delete()
            .from(CNoteCompetenceStagiaire)
            .where("idCompetence = :idNote", { idNote: id })
            .execute();

    }

    async deleteAllNoteByIdTypeFormation(id: number) {
        // return await this.formationRhRepository.delete(RhFormationValide,{RhFormationValide.idRh:id});
        // return await this.formationRhRepository.delete(RhFormationValide, { idRh : id } );
        const query = await this.noteCompetenceStagiaireRepository.createQueryBuilder('note-competence-stagiaire')
        .leftJoinAndSelect('note-competence-stagiaire.stagiaire', 'formation-contact')
        .leftJoinAndSelect('note-competence-stagiaire.competence', 'tFormation-dCompetence')
        .leftJoinAndSelect('tFormation-dCompetence.dCompetence', 'domaine-competence')
        .orderBy('tFormation-dCompetence.dCompetence', 'ASC')
        .where('tFormation-dCompetence.idTypeFormation=:number', { number: id }).getMany();


        return await this.noteCompetenceStagiaireRepository.remove(query);
        // return await this.noteCompetenceStagiaireRepository
        //     .delete()
        //     .from(CNoteCompetenceStagiaire)
        //     .where("idCompetence = :idNote", { idNote: id })
        //     .execute();

    }

    async deleteAllNoteByIdFormation(id: number) {
        const query = await this.noteCompetenceStagiaireRepository.createQueryBuilder('note-competence-stagiaire')
        .leftJoinAndSelect('note-competence-stagiaire.stagiaire', 'formation-contact')
        .where('formation-contact.idFormation=:number', { number: id }).getMany();

        return await this.noteCompetenceStagiaireRepository.remove(query);
    }


    async deleteAllNoteByIdSta(id: number) {
        // return await this.formationRhRepository.delete(RhFormationValide,{RhFormationValide.idRh:id});
        // return await this.formationRhRepository.delete(RhFormationValide, { idRh : id } );
        const query = await this.noteCompetenceStagiaireRepository.createQueryBuilder('note-competence-stagiaire')
        .leftJoinAndSelect('note-competence-stagiaire.stagiaire', 'formation-contact')
        .where('formation-contact.id=:number', { number: id }).getMany();


        return await this.noteCompetenceStagiaireRepository.remove(query);
        // return await this.noteCompetenceStagiaireRepository
        //     .delete()
        //     .from(CNoteCompetenceStagiaire)
        //     .where("idCompetence = :idNote", { idNote: id })
        //     .execute();

    }

    async deleteByIdCompetence(id: number) {
        const query = await this.noteCompetenceStagiaireRepository.createQueryBuilder('note-competence-stagiaire')
        .where('note-competence-stagiaire.idCompetence=:number', { number: id }).getMany();

        return await this.noteCompetenceStagiaireRepository.remove(query);
    }

    // async delete(idStagiaire: number) {
    // const sta = await this.formationContactRepository.createQueryBuilder('formation-contact')
    //     .where('id = :id', {id: idStagiaire}).getOne();
    // return await this.formationContactRepository.remove(sta)
    // }

}