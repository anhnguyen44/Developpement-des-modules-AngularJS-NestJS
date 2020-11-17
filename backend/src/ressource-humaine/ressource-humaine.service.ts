import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {QueryService} from '../query/query.service';
import {RessourceHumaine} from './ressource-humaine.entity';
import {RendezVousPompe} from '../pompe/rendez_vous_pompe.entity';
import {RendezVousRessourceHumaine} from './rendez_vous_ressource-humaine.entity';

@Injectable()
export class RessourceHumaineService {
    constructor(
        @InjectRepository(RessourceHumaine)
        private readonly ressourceHumaineRepository: Repository<RessourceHumaine>,
        @InjectRepository(RendezVousRessourceHumaine)
        private readonly rendezVousRessourceHumaineRepository: Repository<RendezVousRessourceHumaine>,
        private queryService: QueryService
    ) {}

    async getAll(idFranchise: number, inQuery) {
        let query = this.ressourceHumaineRepository
            .createQueryBuilder('ressourceHumaine')
            .leftJoinAndSelect('ressourceHumaine.bureau', 'bureau')
            .leftJoinAndSelect('ressourceHumaine.utilisateur', 'utilisateur')
            .leftJoinAndSelect('ressourceHumaine.fonctions','rh_fonction')
            .leftJoinAndSelect('ressourceHumaine.formationValide','rh_formation_valide')
            .leftJoinAndSelect('rh_fonction.fonction','fonction')
            .leftJoinAndSelect('rh_formation_valide.formation','type_formation')
            .where('ressourceHumaine.idFranchise = :idFranchise', {idFranchise: idFranchise});

        if ('dd' in inQuery && 'df' in inQuery) {
            query.leftJoinAndSelect('ressourceHumaine.rendezVousRessourceHumaines', 'rendezVousRessourceHumaines')
                .leftJoinAndSelect('rendezVousRessourceHumaines.rendezVous', 'rendezVous')
                .andWhere('((:df BETWEEN rendezVous.dateHeureDebut AND rendezVous.dateHeureFin) OR ' +
                    '(:dd BETWEEN rendezVous.dateHeureDebut AND rendezVous.dateHeureFin) OR ' +
                    '(:dd <= rendezVous.dateHeureDebut AND :df >= rendezVous.dateHeureFin))', {
                    dd: inQuery.dd,
                    df: inQuery.df
                })
        }

        query = this.queryService.parseQuery(query, inQuery);

        return await query.getMany()
    }

    async countAll(idBureau: number, inQuery) {
        let query = this.ressourceHumaineRepository
            .createQueryBuilder('ressourceHumaine')
            .leftJoinAndSelect('ressourceHumaine.bureau', 'bureau')
            .leftJoinAndSelect('ressourceHumaine.utilisateur', 'utilisateur')
            .where('ressourceHumaine.idBureau = :idBureau', {idBureau: idBureau});
        query = this.queryService.parseQuery(query, inQuery);

        return await query.getCount()
    }

    async getByBureau(idBureau: number, inQuery) {
        let query = this.ressourceHumaineRepository
            .createQueryBuilder('ressourceHumaine')
            .leftJoinAndSelect('ressourceHumaine.bureau', 'bureau')
            .leftJoinAndSelect('ressourceHumaine.utilisateur', 'utilisateur')
            .where('ressourceHumaine.idBureau = :idBureau', {idBureau: idBureau});
        query = this.queryService.parseQuery(query, inQuery);

        // console.log(inQuery);

        if ('dd' in inQuery && 'df' in inQuery) {

            query.leftJoin('ressourceHumaine.rendezVousRessourceHumaines', 'rendezVousRessourceHumaine')
                .leftJoin('rendezVousRessourceHumaine.rendezVous', 'rendezVous')
                .leftJoinAndSelect('ressourceHumaine.rendezVousRessourceHumaines', 'rendezVousRessourceHumaines',
                    '((:df BETWEEN rendezVous.dateHeureDebut AND rendezVous.dateHeureFin) OR ' +
                    '(:dd BETWEEN rendezVous.dateHeureDebut AND rendezVous.dateHeureFin) OR ' +
                    '(:dd <= rendezVous.dateHeureDebut AND :df >= rendezVous.dateHeureFin))', {
                        dd: inQuery.dd,
                        df: inQuery.df
                    })
                .leftJoinAndSelect('rendezVousRessourceHumaines.rendezVous', 'rdv')

        }

        return await query.getMany()
    }

    async countByBureau(idBureau: number, inQuery) {
        let query = this.ressourceHumaineRepository
            .createQueryBuilder('ressourceHumaine')
            .leftJoinAndSelect('ressourceHumaine.bureau', 'bureau')
            .where('ressourceHumaine.idBureau = :idBureau', {idBureau: idBureau});
        query = this.queryService.parseQuery(query, inQuery);

        return await query.getCount()
    }

    async get(idRessourceHumaine: number): Promise<RessourceHumaine> {

        return await this.ressourceHumaineRepository.createQueryBuilder('ressourceHumaine')
            .leftJoinAndSelect('ressourceHumaine.bureau', 'bureau')
            .leftJoinAndSelect('ressourceHumaine.utilisateur', 'utilisateur')
            .leftJoinAndSelect('ressourceHumaine.fonctions','rh_fonction')
            .leftJoinAndSelect('ressourceHumaine.formationValide','rh_formation_valide')
            .leftJoinAndSelect('rh_fonction.fonction','fonction')
            .leftJoinAndSelect('rh_formation_valide.formation','type_formation')
            .where('ressourceHumaine.id = :idRessourceHumaine', {idRessourceHumaine: idRessourceHumaine}).getOne()
    }

    async create(ressourceHumaine: RessourceHumaine): Promise<RessourceHumaine> {

        const newRessourceHumaine =  await this.ressourceHumaineRepository.create(ressourceHumaine);
        return await this.ressourceHumaineRepository.save(newRessourceHumaine);
    }

    async update(ressourceHumaine: RessourceHumaine): Promise<RessourceHumaine> {
        return await this.ressourceHumaineRepository.save(ressourceHumaine)
    }

    // Rendez Vous Ressource Humaine

    async addRendezVousRessourceHumaine(rendezVousRessourceHumaine: RendezVousRessourceHumaine): Promise<RendezVousRessourceHumaine> {
        const newRendezVousRessourceHumaine =  await this.rendezVousRessourceHumaineRepository.create(rendezVousRessourceHumaine);
        return await this.rendezVousRessourceHumaineRepository.save(newRendezVousRessourceHumaine);
    }

    async removeRendezVousRessourceHumaine(idRendezVousRessouceHumaine: number) {
        return  await this.rendezVousRessourceHumaineRepository.delete(idRendezVousRessouceHumaine);
    }
}
