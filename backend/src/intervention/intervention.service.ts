import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Intervention} from './intervention.entity';
import {QueryService} from '../query/query.service';
import {EnumStatutIntervention} from '@aleaac/shared';

@Injectable()
export class InterventionService {
    enumStatutIntervention = EnumStatutIntervention;

    constructor(
        @InjectRepository(Intervention)
        private readonly interventionRepository: Repository<Intervention>,
        private queryService: QueryService
    ) {
    }

    async getAll(idFranchise: number, inQuery): Promise<Intervention[]> {

        let query = this.interventionRepository.createQueryBuilder('intervention')
            .where('intervention.idFranchise = :idFranchise', {idFranchise: idFranchise});

        if ('dd' in inQuery && 'df' in inQuery && 'colonne' in inQuery) {
            query.leftJoinAndSelect('intervention.rendezVous', 'rendezVous')
                .andWhere('((:df BETWEEN rendezVous.dateHeureDebut AND rendezVous.dateHeureFin) OR ' +
                    '(:dd BETWEEN rendezVous.dateHeureDebut AND rendezVous.dateHeureFin) OR ' +
                    '(:dd <= rendezVous.dateHeureDebut AND :df >= rendezVous.dateHeureFin))', {
                    dd: inQuery.dd,
                    df: inQuery.df
                })
        }

        query = this.queryService.parseQuery(query, inQuery);

        return await query.getMany();
    }

    async countAll(idFranchise: number, inQuery: string): Promise<number> {

        let query = this.interventionRepository.createQueryBuilder('intervention')
            .where('intervention.idFranchise = :idFranchise', {idFranchise: idFranchise});

        query = this.queryService.parseQuery(query, inQuery);

        return query.getCount();
    }

    async get(idIntervention: number): Promise<Intervention> {
        return this.interventionRepository.createQueryBuilder('intervention')
            .leftJoinAndSelect('intervention.rendezVous', 'rendezVous')
            .leftJoinAndSelect('intervention.siteIntervention', 'siteIntervention')
            .leftJoinAndSelect('siteIntervention.adresse', 'adresse')
            .leftJoinAndSelect('rendezVous.rendezVousRessourceHumaines', 'rendezVousRessourceHumaines')
            .leftJoinAndSelect('rendezVousRessourceHumaines.ressourceHumaine', 'ressourceHumaineRDV')
            .leftJoinAndSelect('ressourceHumaineRDV.utilisateur', 'utilisateur')
            .leftJoinAndSelect('rendezVous.rendezVousPompes', 'rendezVousPompe')
            .leftJoinAndSelect('rendezVousPompe.pompe', 'pompeRDV')
            .leftJoinAndSelect('intervention.prelevements', 'prelevement')
            .leftJoinAndSelect('prelevement.objectif', 'objectif')
            .leftJoinAndSelect('prelevement.processus', 'processus')
            .leftJoinAndSelect('prelevement.zoneIntervention', 'zoneIntervention')
            .leftJoinAndSelect('zoneIntervention.materiauxZone', 'materiauxZone')
            .leftJoinAndSelect('materiauxZone.materiau', 'materiau')
            .leftJoinAndSelect('processus.tachesRetrait', 'tachesRetrait')
            .leftJoinAndSelect('processus.tachesRepli', 'tachesRepli')
            .leftJoinAndSelect('processus.tachesInstallation', 'tachesInstallation')
            .leftJoinAndSelect('prelevement.ges', 'ges')
            .leftJoinAndSelect('prelevement.processusZone', 'processusZone')
            .leftJoinAndSelect('prelevement.fichesExposition', 'fichesExposition')
            .leftJoinAndSelect('fichesExposition.ressourceHumaine', 'ressourceHumaineExpo')
            .leftJoinAndSelect('ges.taches', 'taches')
            .leftJoinAndSelect('intervention.bureau', 'bureau')
            .leftJoinAndSelect('intervention.filtreTemoinPI', 'filtreTemoinPI')
            .leftJoinAndSelect('intervention.filtreTemoinPPF', 'filtreTemoinPPF')
            .leftJoinAndSelect('prelevement.affectationsPrelevement', 'affectationPrelevement')
            .leftJoinAndSelect('affectationPrelevement.pompe', 'pompe')
            .leftJoinAndSelect('affectationPrelevement.filtre', 'filtre')
            .leftJoinAndSelect('affectationPrelevement.debitmetre', 'debitmetre')
            .leftJoinAndSelect('affectationPrelevement.operateurChantier', 'operateurChantier')
            .leftJoinAndSelect('intervention.ordreIntervention', 'ordreIntervention')
            .leftJoinAndSelect('intervention.ordreInterventionValide', 'ordreInterventionValide')
            .where('intervention.id = :idIntervention', {idIntervention: idIntervention})
            .getOne()
    }

    async create(intervention: Intervention) {
        const newIntervention = await this.interventionRepository.create(intervention);
        return this.interventionRepository.save(newIntervention)
    }

    async update(intervention: Intervention) {
        return this.interventionRepository.save(intervention)
    }

    async getInInterval(idBureau, dd, df): Promise<Intervention[]> {
        return await this.interventionRepository.createQueryBuilder('intervention')
            .leftJoinAndSelect('intervention.rendezVous', 'rendezVous')
            .where(
                'intervention.idBureau = :idBureau AND (intervention.idStatut BETWEEN 2 AND 4) AND ' +
                '((:df BETWEEN rendezVous.dateHeureDebut AND rendezVous.dateHeureFin) OR ' +
                '(:dd BETWEEN rendezVous.dateHeureDebut AND rendezVous.dateHeureFin) OR ' +
                '(:dd <= rendezVous.dateHeureDebut AND :df >= rendezVous.dateHeureFin))', {
                    idBureau: idBureau,
                    dd: dd,
                    df: df
                })
            .getMany()
    }

    async getInIntervalAllStatut(idBureau, dd, df): Promise<Intervention[]> {
        return await this.interventionRepository.createQueryBuilder('intervention')
            .leftJoinAndSelect('intervention.rendezVous', 'rendezVous')
            .where(
                '((:df BETWEEN rendezVous.dateHeureDebut AND rendezVous.dateHeureFin) OR ' +
                '(:dd BETWEEN rendezVous.dateHeureDebut AND rendezVous.dateHeureFin) OR ' +
                '(:dd <= rendezVous.dateHeureDebut AND :df >= rendezVous.dateHeureFin))', {
                    idBureau: idBureau,
                    dd: dd,
                    df: df
                })
            .getMany()
    }

    async getAllValide(idBureau): Promise<Intervention[]> {
        return await this.interventionRepository.createQueryBuilder('intervention')
            .leftJoinAndSelect('intervention.rendezVous', 'rendezVous')
            .where('intervention.idBureau = :idBureau AND (intervention.idStatut BETWEEN 2 AND 4)', {idBureau: idBureau})
            .getMany()
    }

    async getDefinitifNonTermine(idFranchise): Promise<Intervention[]> {
        return await this.interventionRepository.createQueryBuilder('intervention')
            .leftJoinAndSelect('intervention.rendezVous', 'rendezVous')
            .where('rendeVous.isDefinitif = 1 && intervention.idStatut != :statut && intervention.idFranchise = :idFranchise',
                {statut: this.enumStatutIntervention.TERMINE, idFranchise: idFranchise}).getMany()
    }

    async getForGenerate(idIntervention: number): Promise<Intervention> {
        return this.interventionRepository.createQueryBuilder('intervention')
            .leftJoinAndSelect('intervention.rendezVous', 'rendezVous')
            .leftJoinAndSelect('intervention.siteIntervention', 'siteIntervention')
            .leftJoinAndSelect('siteIntervention.adresse', 'adresse')
            .leftJoinAndSelect('intervention.chantier', 'chantier')
            .leftJoinAndSelect('chantier.client', 'client')
            .leftJoinAndSelect('client.adresse', 'clientAdresse')
            .leftJoinAndSelect('chantier.bureau', 'bureau')
            .leftJoinAndSelect('bureau.adresse', 'bureauAdresse')
            .leftJoinAndSelect('client.compteContacts', 'compteContacts')
            .leftJoinAndSelect('compteContacts.compte', 'compte')
            .leftJoinAndSelect('intervention.prelevements', 'prelevement')
            .leftJoinAndSelect('prelevement.objectif', 'objectif')
            .where('intervention.id = :idIntervention', {idIntervention: idIntervention})
            .getOne()
    }
}
