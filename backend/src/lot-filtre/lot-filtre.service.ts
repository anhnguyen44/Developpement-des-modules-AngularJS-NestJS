import {Injectable} from '@nestjs/common';
import {Repository, UpdateResult, FindManyOptions} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {QueryService} from '../query/query.service';
import {LotFiltre} from './lot-filtre.entity';
import {Filtre} from '../filtre/filtre.entity';
import { Franchise } from '../franchise/franchise.entity';

@Injectable()
export class LotFiltreService {
    constructor(
        @InjectRepository(LotFiltre)
        private readonly lotFiltreRepository: Repository<LotFiltre>,
        private queryService: QueryService,
        @InjectRepository(Filtre)
        private readonly filtreRepository: Repository<Filtre>,
        @InjectRepository(Franchise)
        private readonly franchiseRepository: Repository<Franchise>,
    ) {}

    async getAll(idFranchise: number, inQuery): Promise<LotFiltre[]> {
        let query = this.lotFiltreRepository
            .createQueryBuilder('lotFiltre')
            .leftJoinAndSelect('lotFiltre.filtres', 'filtre')
            .leftJoinAndSelect('lotFiltre.bureau', 'bureau')
            .where('lotFiltre.idFranchise = :idFranchise', {idFranchise: idFranchise});
        query = this.queryService.parseQuery(query, inQuery);

        return await query.getMany()
    }

    async countAll(idFranchise: number, inQuery: string): Promise<number> {
        let query = this.lotFiltreRepository
            .createQueryBuilder('lotFiltre')
            .leftJoinAndSelect('lotFiltre.filtres', 'filtre')
            .leftJoinAndSelect('filtre.bureau', 'bureau')
            .where('filtre.idFranchise = :idFranchise', {idFranchise: idFranchise});
        query = this.queryService.parseQuery(query, inQuery);

        return await query.getCount()
    }

    async get(idLotFiltre: number): Promise<LotFiltre> {

        return await this.lotFiltreRepository.createQueryBuilder('lotFiltre')
            .leftJoinAndSelect('lotFiltre.bureau', 'bureau')
            .leftJoinAndSelect('lotFiltre.filtres', 'filtres')
            .leftJoinAndSelect('filtres.affectationsPrelevement', 'affectationsPrelevement')
            .where('lotFiltre.id = :idLotFiltre', {idLotFiltre: idLotFiltre}).getOne()
    }

    async create(lotFiltre: LotFiltre): Promise<LotFiltre> {
        const newLotFiltre =  await this.lotFiltreRepository.create(lotFiltre);
        const franchise = await this.franchiseRepository.findOne(lotFiltre.idFranchise);
        newLotFiltre.ref = franchise.trigramme + '-' + newLotFiltre.ref;
        return await this.lotFiltreRepository.save(newLotFiltre);
    }

    async update(lotFiltre: LotFiltre): Promise<LotFiltre> {
        const franchise = await this.franchiseRepository.findOne(lotFiltre.idFranchise);
        lotFiltre.ref = franchise.trigramme + '-' + lotFiltre.ref;
        if (lotFiltre.isConforme) {
            for (let i = 1; i <= 100; i++) {
                // console.log(i);
                const filtre = new Filtre();
                filtre.idBureau = lotFiltre.idBureau;
                filtre.idFranchise = lotFiltre.idFranchise;
                filtre.idLotFiltre = lotFiltre.id;
                filtre.ref = lotFiltre.ref + '-' + this.pad(i, 3);
                if (i === 1) {
                    filtre.isBlanc = true
                }
                filtre.idTypeFiltre = lotFiltre.idTypeFiltre;
                const newFiltre = await this.filtreRepository.create(filtre);
                await this.filtreRepository.save(newFiltre)
            }
        }
        return await this.lotFiltreRepository.save(lotFiltre)
    }

    pad(number, length) {
        let str = '' + number;
        while (str.length < length) {
            str = '0' + str;
        }
        return str;
    }

    async infoGeneratePlanche(idLotFiltre): Promise<Filtre[]> {
        return await this.filtreRepository.createQueryBuilder('filtre')
            .leftJoinAndSelect('filtre.affectationsPrelevement', 'affectationsPrelevement')
            .where('idLotFiltre = :idLotFiltre AND affectationsPrelevement.id IS NULL AND isBlanc = 0', {idLotFiltre: idLotFiltre})
            .getMany();
    }

}
