import { Injectable } from '@nestjs/common';
import { Repository, UpdateResult, FindManyOptions, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Echantillonnage } from './echantillonnage.entity';
import { id } from 'aws-sdk/clients/datapipeline';
import { Consommable } from '../consommable/consommable.entity';
import { QueryService } from '../query/query.service';
import { Objectif } from '../objectif/objectif.entity';
import { ZoneIntervention } from '@aleaac/shared';

@Injectable()
export class EchantillonnageService {
    constructor(
        @InjectRepository(Echantillonnage)
        private readonly echantillonnageRepository: Repository<Echantillonnage>,
        private queryService: QueryService
    ) { }

    async find(options: FindManyOptions<Echantillonnage>): Promise<Echantillonnage[]> {
        return await this.echantillonnageRepository.find(options);
    }

    async getAll(idZoneIntervention: number, inQuery): Promise<Echantillonnage[]> {
        let query = this.echantillonnageRepository
            .createQueryBuilder('echantillonnage')
            .leftJoinAndSelect('echantillonnage.objectif', 'objectif')
            .where('echantillonnage.idZIEch = :idZoneIntervention', { idZoneIntervention: idZoneIntervention });
        query = this.queryService.parseQuery(query, inQuery);

        return await query.getMany()
    }

    async countAll(idZoneIntervention: number, inQuery: string): Promise<number> {
        let query = this.echantillonnageRepository
            .createQueryBuilder('echantillonnage')
            .where('echantillonnage.idZIEch = :idZoneIntervention', { idZoneIntervention: idZoneIntervention });
        query = this.queryService.parseQuery(query, inQuery);

        return await query.getCount()
    }

    async get(idEchantillonnage: number): Promise<Echantillonnage> {

        return await this.echantillonnageRepository.createQueryBuilder('echantillonnage')
            .leftJoinAndSelect('echantillonnage.objectif', 'objectif')
            .where('echantillonnage.id = :idEchantillonnage', { idEchantillonnage: idEchantillonnage }).getOne()
    }

    async create(echantillonnage: Echantillonnage): Promise<Echantillonnage> {
        const newEchantillonnage = await this.echantillonnageRepository.create(echantillonnage);
        return await this.echantillonnageRepository.save(newEchantillonnage);
    }

    async update(echantillonnage: Echantillonnage): Promise<Echantillonnage> {
        return await this.echantillonnageRepository.save(echantillonnage)
    }

    async delete(echantillonnage: Echantillonnage): Promise<DeleteResult> {
        return await this.echantillonnageRepository.delete(echantillonnage);
    }

    // getNbPrelevements(objectif: Objectif, nbPiecesUnitaires: number, nbGrpExtrateurs: number = 1): number {
    getNbPrelevements(objectif: Objectif, zone: ZoneIntervention): number {
        if (zone.isZoneInf10) {
            return 1;
        }

        switch (objectif.code) {
            case 'A':
            case 'B':
            case 'C':
            case 'D':
            case 'G':
                if (zone.nbPiecesUnitaires) {
                    // 1ère colonne GA-X p 13
                    // console.log('TOTO 1');
                    switch (zone.nbPiecesUnitaires) {
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                            return 2;
                        case 5:
                        case 6:
                        case 7:
                        case 8:
                        case 9:
                        case 10:
                        case 11:
                        case 12:
                        case 13:
                        case 14:
                            return 3;
                        case 15:
                        case 16:
                        case 17:
                        case 18:
                        case 19:
                        case 20:
                            return 4;
                        case 21:
                        case 22:
                        case 23:
                        case 24:
                        case 25:
                        case 26:
                        case 27:
                        case 28:
                        case 29:
                        case 30:
                        case 31:
                            return 5;
                        case 32:
                        case 33:
                        case 34:
                        case 35:
                        case 36:
                        case 37:
                        case 38:
                        case 39:
                        case 40:
                        case 41:
                        case 42:
                        case 43:
                        case 44:
                        case 45:
                        case 46:
                            return 6;
                        case 47:
                        case 48:
                        case 49:
                        case 50:
                        case 51:
                        case 52:
                        case 53:
                        case 54:
                        case 55:
                            return 7;
                        default:
                            return Math.ceil(zone.nbPiecesUnitaires / 8);
                    }
                } else {
                    // TODO : Vérifier après si c'est toujours bon
                    return 1;
                }
            case 'E':
            case 'F':
            case 'T':
            case 'U':
            case 'V':
            case 'W':
            case 'X':
            case 'Y':
                if (zone.nbPiecesUnitaires) {
                    // 2ème colonne GA-X p13
                    // console.log('TOTO 2');
                    switch (zone.nbPiecesUnitaires) {
                        case 1:
                        case 2:
                            return 2;
                        case 3:
                        case 4:
                            return 3;
                        case 5:
                        case 6:
                            return 4;
                        case 7:
                        case 8:
                            return 5;
                        case 9:
                        case 10:
                        case 11:
                            return 6;
                        case 12:
                        case 13:
                        case 14:
                            return 7;
                        case 15:
                        case 16:
                        case 17:
                            return 8;
                        case 18:
                        case 19:
                        case 20:
                            return 9;
                        case 21:
                        case 22:
                        case 23:
                        case 24:
                        case 25:
                            return 10;
                        case 26:
                        case 27:
                        case 28:
                        case 29:
                        case 30:
                        case 31:
                            return 11;
                        case 32:
                        case 33:
                        case 34:
                        case 35:
                        case 36:
                        case 37:
                        case 38:
                            return 12;
                        case 39:
                        case 40:
                        case 41:
                        case 42:
                        case 43:
                        case 44:
                        case 45:
                        case 46:
                            return 13;
                        case 47:
                        case 48:
                        case 49:
                        case 50:
                        case 51:
                        case 52:
                        case 53:
                        case 54:
                        case 55:
                            return 14;
                        default:
                            return Math.ceil(zone.nbPiecesUnitaires / 4);
                    }
                } else {
                    // TODO : Vérifier après si c'est toujours bon
                    return 1;
                }
            case 'N':
                return zone.nbGrpExtracteurs;
            default:
                // SUIVI --> 1 par semaine
                // H : 1 tout court puis le stratège fait ce qu'il veut
                return 1;
        }

        return 0;
    }
}
