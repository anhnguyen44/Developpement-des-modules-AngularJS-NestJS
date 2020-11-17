import { Injectable, Inject } from '@nestjs/common';
import { FindManyOptions, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { Log } from '../logger/logger';
import { LocalUnitaire } from './local-unitaire.entity';
import { ILocalUnitaire, EnumTypeLocal } from '@aleaac/shared';
import { GeocodingService } from '../geocoding/geocoding';
import { Adresse } from '../adresse/adresse.entity';
import { QueryService } from '../query/query.service';

@Injectable()
export class LocalUnitaireService {
    constructor(
        @InjectRepository(LocalUnitaire) private readonly localUnitaireRepository: Repository<LocalUnitaire>,
        @InjectRepository(Adresse) private readonly adresseRepository: Repository<Adresse>,
        private readonly geocodingService: GeocodingService,
        private readonly queryService: QueryService,
    ) { }

    // Create
    // Precondition: the localUnitaire needs to have a unique nom
    async create(localUnitaireDto: ILocalUnitaire): Promise<LocalUnitaire> {
        const localUnitaire = this.localUnitaireRepository.create(localUnitaireDto);

        const savedLocalUnitaire = await this.localUnitaireRepository.save(localUnitaire);
        // this.log.debug(JSON.stringify(savedLocalUnitaire));
        return savedLocalUnitaire;
    }

    // Read
    async find(findOptions?: FindManyOptions<LocalUnitaire>): Promise<LocalUnitaire[]> {
        const options = {
            take: 100,
            skip: 0,
            ...findOptions // overwrite default ones
        };
        // this.log.debug(`searching for max ${options.take} localUnitaires with an offset of ${options.skip} ...`);
        return await this.localUnitaireRepository.find(options);
    }

    async findByZone(idZoneIntervention: number, inQuery: string): Promise<LocalUnitaire[]> {
        let query = this.localUnitaireRepository.createQueryBuilder('localUnitaire')
            .where('localUnitaire.idZILocal = :idZoneIntervention', { idZoneIntervention: idZoneIntervention });
        query = this.queryService.parseQuery(query, inQuery);
        return await query.getMany();
    }

    async findOneById(id: number): Promise<LocalUnitaire> {
        // this.log.debug('trying to find one localUnitaire by id...');
        return await this.localUnitaireRepository.findOne({
            id: id
        });
    }

    // Update
    async update(id: number, partialEntry: DeepPartial<LocalUnitaire>): Promise<UpdateResult> {
        // this.log.debug('trying to update localUnitaire...');
        return await this.localUnitaireRepository.update(id, partialEntry);
    }

    // Delete
    async remove(id: number): Promise<LocalUnitaire> {
        // this.log.debug('trying to remove localUnitaire...');
        return await this.localUnitaireRepository.remove(await this.findOneById(id));
    }


    calculPUSingle(local: LocalUnitaire | DeepPartial<LocalUnitaire>) {

        let nbPU: number = 0;
        switch (local.type) {
            case EnumTypeLocal.S_INF_EGAL_100M2_L_INF_EGAL_15M:
                // Maintenant on ajoute chaque superficie à la main, on saisit pas un nombre
                nbPU = 1; // 2 prélèvements par PU mais une seule PU
                break;
            case EnumTypeLocal.S_INF_EGAL_100M2_L_SUP_15M:
                nbPU = Math.ceil(local.longueur / 15); // 1 PU par 15m arrondi au sup
                break;
            case EnumTypeLocal.S_SUP_100M2:
                nbPU = Math.ceil((14 * local.surface) / (730 + local.surface)); // formule réglementaire
                break;
            case EnumTypeLocal.GROUPEMENT:
                if (local.idParent === 0 || local.idParent === null) {
                    nbPU = 1; // On ajoute que le groupement parent pour le calcul des PU
                } else {
                    nbPU = 0;
                }
                break;
            case EnumTypeLocal.CAGE_ESCALIER:
                if (local.largeur * local.longueur * local.nbNiveaux > 100) {
                    nbPU = Math.ceil((14 * local.surface) / (730 + local.surface)); // formule réglementaire
                } else {
                    if (local.largeur > 15 || local.longueur > 15) {
                        nbPU =
                            Math.ceil(Math.max(local.longueur, local.largeur) / 15); // 1 PU par 15m arrondi au sup
                    } else {
                        nbPU = 1;
                    }
                }
                break;
            default:
                break;
        }

        return nbPU;
    }
}
