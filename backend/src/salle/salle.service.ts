import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Salle} from './salle.entity';
import {QueryService} from '../query/query.service';
import {Filtre} from '../filtre/filtre.entity';
import {RendezVousRessourceHumaine} from '../ressource-humaine/rendez_vous_ressource-humaine.entity';
import {RendezVousSalle} from './rendez_vous_salle.entity';

@Injectable()
export class SalleService {
    constructor(
        @InjectRepository(Salle)
        private readonly salleRepository: Repository<Salle>,
        @InjectRepository(RendezVousSalle)
        private readonly rendezVousSalleRepository: Repository<RendezVousSalle>,
        private queryService: QueryService
    ) {}

    async getAll(idFranchise: number, inQuery) {
        let query = this.salleRepository
            .createQueryBuilder('salle')
            .leftJoinAndSelect('salle.bureau', 'bureau')
            .where('salle.idFranchise = :idFranchise', {idFranchise: idFranchise});
        query = this.queryService.parseQuery(query, inQuery);

        if ('dd' in inQuery && 'df' in inQuery) {
            query.leftJoinAndSelect('salle.rendezVousSalles', 'rendezVousSalles')
                .leftJoinAndSelect('rendezVousSalles.rendezVous', 'rendezVous')
                .andWhere('((:df BETWEEN rendezVous.dateHeureDebut AND rendezVous.dateHeureFin) OR ' +
                    '(:dd BETWEEN rendezVous.dateHeureDebut AND rendezVous.dateHeureFin) OR ' +
                    '(:dd <= rendezVous.dateHeureDebut AND :df >= rendezVous.dateHeureFin))', {
                    dd: inQuery.dd,
                    df: inQuery.df
                })
        };

        return await query.getMany()
    }

    async countAll(idFranchise: number, inQuery: string) {
        let query = this.salleRepository
            .createQueryBuilder('salle')
            .leftJoinAndSelect('salle.bureau', 'bureau')
            .where('salle.idFranchise = :idFranchise', {idFranchise: idFranchise});
        query = this.queryService.parseQuery(query, inQuery);

        return await query.getCount()
    }

    async get(idSalle: number): Promise<Salle> {

        return await this.salleRepository.createQueryBuilder('salle')
            .leftJoinAndSelect('salle.bureau', 'bureau')
            .where('salle.id = :idSalle', {idSalle: idSalle}).getOne()
    }

    async create(salle: Salle): Promise<Salle> {

        const newSalle =  await this.salleRepository.create(salle);
        return await this.salleRepository.save(newSalle);
    }

    async update(salle: Salle): Promise<Salle> {
        return await this.salleRepository.save(salle)
    }


    // Rendez Vous Salle

    async addRendezVousSalle(rendezVousSalle: RendezVousSalle): Promise<RendezVousSalle> {
        const newRendezVousSalle = await this.rendezVousSalleRepository.create(rendezVousSalle);
        return await this.rendezVousSalleRepository.save(newRendezVousSalle);
    }

    async removeRendezVousSalle(idRendezVousSalle: number) {
        return  await this.rendezVousSalleRepository.delete(idRendezVousSalle);
    }
}
