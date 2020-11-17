import {Injectable} from '@nestjs/common';
import {Repository, UpdateResult, FindManyOptions, DeleteResult} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Filtre} from './filtre.entity';
import {id} from 'aws-sdk/clients/datapipeline';
import {Consommable} from '../consommable/consommable.entity';
import {QueryService} from '../query/query.service';

@Injectable()
export class FiltreService {
    constructor(
        @InjectRepository(Filtre)
        private readonly filtreRepository: Repository<Filtre>,
        private queryService: QueryService
    ) {}

    async getAll(idFranchise: number, inQuery): Promise<Filtre[]> {
        let query = this.filtreRepository
            .createQueryBuilder('filtre')
            .leftJoinAndSelect('filtre.bureau', 'bureau')
            .where('filtre.idFranchise = :idFranchise', {idFranchise: idFranchise});
        query = this.queryService.parseQuery(query, inQuery);

        return await query.getMany()
    }

    async countAll(idFranchise: number, inQuery: string): Promise<number> {
        let query = this.filtreRepository
            .createQueryBuilder('filtre')
            .leftJoinAndSelect('filtre.bureau', 'bureau')
            .where('filtre.idFranchise = :idFranchise', {idFranchise: idFranchise});
        query = this.queryService.parseQuery(query, inQuery);

        return await query.getCount()
    }

    async get(idFiltre: number): Promise<Filtre> {

        return await this.filtreRepository.createQueryBuilder('filtre')
            .leftJoinAndSelect('filtre.bureau', 'bureau')
            .where('filtre.id = :idFiltre', {idFiltre: idFiltre}).getOne()
    }

    async create(filtre: Filtre): Promise<Filtre> {

        const newFiltre =  await this.filtreRepository.create(filtre);
        return await this.filtreRepository.save(newFiltre);
    }

    async update(filtre: Filtre): Promise<Filtre> {
        return await this.filtreRepository.save(filtre)
    }

    async delete(filtre: Filtre): Promise<DeleteResult> {
        return await this.filtreRepository.delete(filtre);
    }

    async getStock(idFranchise: number): Promise<{typeFiltre: number, idBureau: number, count: string}[]> {
        const filtres = await this.filtreRepository.createQueryBuilder('filtre')
            .select('filtre.idTypeFiltre AS idTypeFiltre, filtre.idBureau AS idBureau')
            .where('filtre.idFranchise = :idFranchise', {idFranchise: idFranchise})
            .leftJoin('filtre.affectationsPrelevement', 'affectationPrelevement')
            // .leftJoin('filtre.prelevement', 'prelevement')
            .andWhere('filtre.isBlanc = 0 && affectationPrelevement.id IS NULL')
            .addSelect('COUNT(*) AS count')
            .groupBy('filtre.idBureau')
            .addGroupBy('filtre.idTypeFiltre')
            .getRawMany();

        return filtres;
    }

    async getNonAffecte(idBureau: number): Promise<Filtre[]> {
        return await this.filtreRepository.createQueryBuilder('filtre')
            .where('filtre.idBureau = :idBureau && filtre.isBlanc = 0', { idBureau: Number(idBureau) })
            .getMany()
    }

    /*async getNonAffecte(idTypeFiltre: number, nonAffecte: number[]): Promise<Filtre> {
        const query = this.filtreRepository.createQueryBuilder('filtre')
            .leftJoinAndSelect('filtre.lotFiltre', 'lotFiltre')
            .where('filtre.typeFiltre = :idTypeFiltre ' +
                'AND filtre.idIntervention IS NULL ' +
                'AND filtre.isBlanc = 0 ' +
                'AND lotFiltre.isConforme = 1', {idTypeFiltre: Number(idTypeFiltre)});
        
        if (nonAffecte.length > 0) {
            query.andWhere('filtre.id NOT IN (:nonAffecte)', {nonAffecte: nonAffecte})
        }
        return await query.getOne();
    }*/

    async infoGeneratePlancheOI(idOrdreIntervention): Promise<Filtre[]> {
        return await this.filtreRepository.createQueryBuilder('filtre')
            .where('idOrdreIntervention = :idOrdreIntervention', {idOrdreIntervention: idOrdreIntervention})
            .getMany();
    }

}
