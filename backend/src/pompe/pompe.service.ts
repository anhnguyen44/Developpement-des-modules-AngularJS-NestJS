import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Pompe} from './pompe.entity';
import {QueryService} from '../query/query.service';
import {RendezVousPompe} from './rendez_vous_pompe.entity';

@Injectable()
export class PompeService {
    constructor(
        @InjectRepository(Pompe)
        private readonly pompeRepository: Repository<Pompe>,
        @InjectRepository(RendezVousPompe)
        private readonly rendezVousPompeRepository: Repository<RendezVousPompe>,
        private queryService: QueryService
    ) {}

    async getAll(idFranchise: number, inQuery): Promise<Pompe[]> {
        let query = this.pompeRepository
            .createQueryBuilder('pompe')
            .leftJoinAndSelect('pompe.bureau', 'bureau')
            .where('pompe.idFranchise = :idFranchise', {idFranchise: idFranchise});

        query = this.queryService.parseQuery(query, inQuery);

        if ('dd' in inQuery && 'df' in inQuery) {
            query.leftJoinAndSelect('pompe.rendezVousPompes', 'rendezVousPompes')
                .leftJoinAndSelect('rendezVousPompes.rendezVous', 'rendezVous')
                .andWhere('((:df BETWEEN rendezVous.dateHeureDebut AND rendezVous.dateHeureFin) OR ' +
                    '(:dd BETWEEN rendezVous.dateHeureDebut AND rendezVous.dateHeureFin) OR ' +
                    '(:dd <= rendezVous.dateHeureDebut AND :df >= rendezVous.dateHeureFin))', {
                    dd: inQuery.dd,
                    df: inQuery.df
                })
        }
        return await query.getMany()
    }

    async countAll(idFranchise: number, inQuery: string): Promise<number> {
        let query = this.pompeRepository
            .createQueryBuilder('pompe')
            .leftJoinAndSelect('pompe.bureau', 'bureau')
            .where('pompe.idFranchise = :idFranchise', {idFranchise: idFranchise});
        query = this.queryService.parseQuery(query, inQuery);

        return await query.getCount()
    }

    async getByBureau(idBureau: number, inQuery): Promise<Pompe[]> {
        let query = this.pompeRepository
            .createQueryBuilder('pompe')
            .leftJoinAndSelect('pompe.bureau', 'bureau')
            .where('pompe.idBureau = :idBureau', {idBureau: idBureau});
        query = this.queryService.parseQuery(query, inQuery);

        if ('dd' in inQuery && 'df' in inQuery) {

            query.leftJoin('pompe.rendezVousPompes', 'rendezVousPompe')
                .leftJoin('rendezVousPompe.rendezVous', 'rendezVous')
                .leftJoinAndSelect('pompe.rendezVousPompes', 'rendezVousPompes',
                    '((:df BETWEEN rendezVous.dateHeureDebut AND rendezVous.dateHeureFin) OR ' +
                    '(:dd BETWEEN rendezVous.dateHeureDebut AND rendezVous.dateHeureFin) OR ' +
                    '(:dd <= rendezVous.dateHeureDebut AND :df >= rendezVous.dateHeureFin))', {
                        dd: inQuery.dd,
                        df: inQuery.df
                    })
                .leftJoinAndSelect('rendezVousPompes.rendezVous', 'rdv');
        }

        return await query.getMany()
    }

    async countByBureau(idBureau: number, inQuery: string): Promise<number> {
        let query = this.pompeRepository
            .createQueryBuilder('pompe')
            .leftJoinAndSelect('pompe.bureau', 'bureau')
            .where('pompe.idBureau = :idBureau', {idBureau: idBureau});
        query = this.queryService.parseQuery(query, inQuery);

        return await query.getCount()
    }

    async get(idPompe: number, inQuery): Promise<Pompe> {

        let query =  await this.pompeRepository.createQueryBuilder('pompe')
            .leftJoinAndSelect('pompe.bureau', 'bureau')

            .where('pompe.id = :idPompe', {idPompe: Number(idPompe)});

        // query = this.queryService.parseQuery(query, inQuery);

        let pompe = await query.getOne();

        if ('dd' in inQuery && 'df' in inQuery) {
            const rendezVousPompe = await this.rendezVousPompeRepository
                .createQueryBuilder('rendezVousPompe')
                .leftJoinAndSelect('rendezVousPompe.rendezVous', 'rendezVous')
                .where('((:df BETWEEN rendezVous.dateHeureDebut AND rendezVous.dateHeureFin) OR ' +
                    '(:dd BETWEEN rendezVous.dateHeureDebut AND rendezVous.dateHeureFin) OR ' +
                    '(:dd <= rendezVous.dateHeureDebut AND :df >= rendezVous.dateHeureFin))', {
                    dd: inQuery.dd,
                    df: inQuery.df
                })
                .andWhere('rendezVousPompe.idPompe = :idPompe', {idPompe: Number(idPompe)})
                .getMany();

            pompe.rendezVousPompes = rendezVousPompe;
        }

        return pompe
    }

    async create(pompe: Pompe): Promise<Pompe> {

        const newPompe =  await this.pompeRepository.create(pompe);
        return await this.pompeRepository.save(newPompe);
    }

    async update(pompe: Pompe): Promise<Pompe> {
        return await this.pompeRepository.save(pompe)
    }

    async getStock(idBureau: number, inQuery): Promise<{idTypePompe: number, stock: number}[]> {
        const stocks = await this.pompeRepository.createQueryBuilder('pompe')
            .select('pompe.idTypePompe AS idTypePompe')
            .where('pompe.idBureau = :idBureau', {idBureau: idBureau})
            .groupBy('idTypePompe')
            .addSelect('COUNT(*) AS stock')
            .getRawMany()

        const indispos = await this.pompeRepository.createQueryBuilder('pompe')
            .select('pompe.idTypePompe AS idTypePompe')
            .leftJoinAndSelect('pompe.rendezVousPompes', 'rendezVousPompes')
            .leftJoinAndSelect('rendezVousPompes.rendezVous', 'rendezVous')
            .where('pompe.idBureau = :idBureau', {idBureau: idBureau})
            .where('((:df BETWEEN rendezVous.dateHeureDebut AND rendezVous.dateHeureFin) OR ' +
                '(:dd BETWEEN rendezVous.dateHeureDebut AND rendezVous.dateHeureFin) OR ' +
                '(:dd <= rendezVous.dateHeureDebut AND :df >= rendezVous.dateHeureFin)) AND rendezVous.isAbsence = 1', {
                dd: inQuery.dd,
                df: inQuery.df
            })
            .groupBy('idTypePompe')
            .addSelect('COUNT(*) AS stock')
            .getRawMany();

        for (const indispo of indispos) {
            const  sp = stocks.find((stockPompe) => stockPompe.idTypePompe === indispo.idTypePompe);
            sp.stock -= 1;
        }

        return stocks;
    }

    async getIndisponible(idPompe: number): Promise<Pompe> {
        return this.pompeRepository.createQueryBuilder('pompe')
            .leftJoinAndSelect('pompe.rendezVousPompes', 'rendezVousPompes')
            .leftJoinAndSelect('rendezVousPompes.rendezVous', 'rendezVous', 'rendezVous.isAbsence = 1')
            .where('pompe.id = :idPompe', {idPompe: idPompe})
            .getOne()
    }

    // Rendez Vous Pompe

    async addRendezVousPompe(rendezVousPompe: RendezVousPompe): Promise<RendezVousPompe> {
        const newRendezVousPompe =  await this.rendezVousPompeRepository.create(rendezVousPompe);
        return await this.rendezVousPompeRepository.save(newRendezVousPompe);
    }

    async removeRendezVousPompe(idRendezVousPompe: number) {
        return  await this.rendezVousPompeRepository.delete(idRendezVousPompe);
    }

}
