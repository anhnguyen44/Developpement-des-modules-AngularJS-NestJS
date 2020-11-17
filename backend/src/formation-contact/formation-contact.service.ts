import { Injectable, NotFoundException } from '@nestjs/common';
import { Log } from '../logger/logger';
import { FindManyOptions, Repository, DeepPartial, UpdateResult, FindOperator, In, Brackets } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryService } from '../query/query.service';
import { CFormationContact } from './formation-contact.entity';
import { HistoriqueService } from '../historique/historique.service';
import { CNoteCompetenceStagiaire } from '../note-competence-stagiaire//note-competence-stagiaire.entity';

@Injectable()
export class FormationContactService {

    constructor(
        @InjectRepository(CFormationContact)
        private readonly formationContactRepository: Repository<CFormationContact>,
        private queryService: QueryService,
        private historiqueService: HistoriqueService,
    ) { }


    async create(stagiaireDto: CFormationContact): Promise<CFormationContact> {
        const saveStagiaire = await this.formationContactRepository.save(stagiaireDto);
        return saveStagiaire;
    }

    async getById(idSession: number, id: number): Promise<CFormationContact> {
        let query = this.formationContactRepository.createQueryBuilder('formation-contact')
            .leftJoinAndSelect('formation-contact.formation', 'formation')
            .leftJoinAndSelect('formation.bureau', 'bureau')
            .leftJoinAndSelect('bureau.franchise', 'franchise')
            .leftJoinAndSelect('bureau.adresse', 'adresseBureau')
            .leftJoinAndSelect('formation.typeFormation', 'type-formation')
            .leftJoinAndSelect('formation-contact.contact', 'contact')
            .leftJoinAndSelect('contact.adresse', 'adresseContact')
            .leftJoinAndSelect('formation-contact.sousTraitance', 'compte')
            .leftJoinAndSelect('compte.adresse', 'adresse')
            .leftJoinAndSelect('formation-contact.dossierComplet', 'fichier')
            .leftJoinAndSelect('formation.salle', 'salle')
            .leftJoinAndSelect('formation-contact.noteCompetence', 'note-competence-stagiaire')
            .leftJoinAndSelect('note-competence-stagiaire.competence', 'td')
            .where('formation-contact.idFormation=:number', { number: idSession })
            .andWhere('formation-contact.idContact=:number2', { number2: id });

        return await query.getOne();
    }

    async getStaById(id: number): Promise<CFormationContact> {
        let query = this.formationContactRepository.createQueryBuilder('formation-contact')
            .leftJoinAndSelect('formation-contact.formation', 'formation')
            .leftJoinAndSelect('formation.bureau', 'bureau')
            .leftJoinAndSelect('bureau.franchise', 'franchise')
            .leftJoinAndSelect('bureau.adresse', 'adresseBureau')
            .leftJoinAndSelect('formation.formateur', 'formateur-formation')
            .leftJoinAndSelect('formateur-formation.formateur', 'rh')
            .leftJoinAndSelect('rh.utilisateur', 'utilisateur')
            .leftJoinAndSelect('formation.typeFormation', 'type-formation')
            .leftJoinAndSelect('formation-contact.contact', 'contact')
            .leftJoinAndSelect('contact.adresse', 'adresseContact')
            .leftJoinAndSelect('contact.civilite', 'civilite')
            .leftJoinAndSelect('formation-contact.sousTraitance', 'compte')
            .leftJoinAndSelect('compte.adresse', 'adresse')
            .leftJoinAndSelect('formation-contact.dossierComplet', 'fichier')
            .leftJoinAndSelect('formation-contact.noteCompetence', 'note-competence-stagiaire')
            .leftJoinAndSelect('note-competence-stagiaire.competence', 'td')
            .where('formation-contact.id=:number', { number: id })

        return await query.getOne();
    }

    async getAllByIdFormation(inQuery: string, id: number): Promise<CFormationContact[]> {
        let query = this.formationContactRepository.createQueryBuilder('formation-contact')
            .leftJoinAndSelect('formation-contact.noteCompetence', 'note-competence-stagiaire')
            .leftJoinAndSelect('formation-contact.dossierComplet', 'fichier')
            .leftJoinAndSelect('note-competence-stagiaire.competence', 'tFormation-dCompetence')
            .leftJoinAndSelect('tFormation-dCompetence.dCompetence', 'dCompetence')
            .leftJoinAndSelect('formation-contact.formation', 'formation')
            .leftJoinAndSelect('formation.bureau', 'bureau')
            .leftJoinAndSelect('bureau.franchise', 'franchise')
            .leftJoinAndSelect('bureau.adresse', 'adresseBureau')
            .leftJoinAndSelect('formation.formateur', 'formateur-formation')
            .leftJoinAndSelect('formateur-formation.formateur', 'rh')
            .leftJoinAndSelect('rh.utilisateur', 'utilisateur')
            .leftJoinAndSelect('formation.typeFormation', 'type-formation')
            .leftJoinAndSelect('type-formation.product', 'produit')
            .leftJoinAndSelect('formation-contact.contact', 'contact')
            .leftJoinAndSelect('contact.adresse', 'adresseContact')
            .leftJoinAndSelect('contact.civilite', 'civilite')
            .leftJoinAndSelect('formation-contact.sousTraitance', 'compte')
            .leftJoinAndSelect('compte.adresse', 'adresse')
            .leftJoinAndSelect('compte.compteContacts','compte-contact')
            .leftJoinAndSelect('compte-contact.contact','contactEntreprise')
            .leftJoinAndSelect('contactEntreprise.civilite','civiliteEntreprise')
            .leftJoinAndSelect('contactEntreprise.adresse','adresseEntreprise')
            .orderBy('formation-contact.contact', 'ASC')
            .where('formation-contact.idFormation=:number', { number: id });


        query = this.queryService.parseQuery(query, inQuery);
        return await query.getMany();
    }

    async getByIdDevis(id: number): Promise<CFormationContact[]> {
        let query = this.formationContactRepository.createQueryBuilder('formation-contact')
            .leftJoinAndSelect('formation-contact.noteCompetence', 'note-competence-stagiaire')
            .leftJoinAndSelect('formation-contact.dossierComplet', 'fichier')
            .leftJoinAndSelect('note-competence-stagiaire.competence', 'tFormation-dCompetence')
            .leftJoinAndSelect('tFormation-dCompetence.dCompetence', 'dCompetence')
            .leftJoinAndSelect('formation-contact.formation', 'formation')
            .leftJoinAndSelect('formation.formateur', 'formateur-formation')
            .leftJoinAndSelect('formateur-formation.formateur', 'rh')
            .leftJoinAndSelect('rh.utilisateur', 'utilisateur')
            .leftJoinAndSelect('formation.typeFormation', 'type-formation')
            .leftJoinAndSelect('type-formation.product', 'produit')
            .leftJoinAndSelect('formation-contact.contact', 'contact')
            .leftJoinAndSelect('contact.adresse', 'adresseContact')
            .leftJoinAndSelect('contact.civilite', 'civilite')
            .leftJoinAndSelect('formation-contact.sousTraitance', 'compte')
            .leftJoinAndSelect('compte.adresse', 'adresse')
            .leftJoinAndSelect('compte.compteContacts','compte-contact')
            .leftJoinAndSelect('compte-contact.contact','contactEntreprise')
            .leftJoinAndSelect('contactEntreprise.civilite','civiliteEntreprise')
            .leftJoinAndSelect('contactEntreprise.adresse','adresseEntreprise')
            .orderBy('formation-contact.contact', 'ASC')
            .where('formation-contact.idDevis=:number', { number: id });


        return await query.getMany();
    }

    async getAllByIdTypeFormation(id: number): Promise<CFormationContact[]> {
        let query = this.formationContactRepository.createQueryBuilder('formation-contact')
            .leftJoinAndSelect('formation-contact.formation', 'formation')
            .leftJoinAndSelect('formation.typeFormation', 'type-formation')
            .where('type-formation.id=:number', { number: id })

        return await query.getMany();
    }


    async update(id: number, partialEntry: DeepPartial<CFormationContact>) {
        return await this.formationContactRepository.update(id, partialEntry);
    }


    async delete(idStagiaire: number) {
        const sta = await this.formationContactRepository.createQueryBuilder('formation-contact')
            .where('id = :id', { id: idStagiaire }).getOne();
        return await this.formationContactRepository.remove(sta)
    }

}