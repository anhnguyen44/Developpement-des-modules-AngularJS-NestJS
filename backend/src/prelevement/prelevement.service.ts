import { Injectable } from '@nestjs/common';
import {Brackets, DeleteResult, Repository} from 'typeorm';
import { Prelevement } from './prelevement.entity';
import { QueryService } from '../query/query.service';
import { EnumStatutPrelevement, EnumTypePrelevement } from '@aleaac/shared';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class PrelevementService {
    constructor(
        @InjectRepository(Prelevement)
        private readonly prelevementRepository: Repository<Prelevement>,
        private queryService: QueryService
    ) { }

    async getAllByType(nomIdParent: string, idParent: number, inQuery): Promise<Prelevement[]> {
        let query = this.prelevementRepository.createQueryBuilder('prelevement')
            .loadRelationCountAndMap('prelevement.countInter', 'prelevement.interventions', 'countInter')
            .leftJoinAndSelect('prelevement.affectationsPrelevement', 'affectationPrelevement')
            .leftJoinAndSelect('prelevement.chantier', 'chantier')
            .leftJoinAndSelect('prelevement.echantillonnage', 'echantillonnage')
            .leftJoinAndSelect('prelevement.processusZone', 'processusZone')
            .leftJoinAndSelect('processusZone.zoneIntervention', 'zoneIntervention')
            .leftJoinAndSelect('processusZone.listeGES', 'listeGES')
            .leftJoinAndSelect('listeGES.taches', 'taches')
            .leftJoinAndSelect('processusZone.processus', 'processus')
            .leftJoinAndSelect('processus.tachesInstallation', 'tachesInstallation')
            .leftJoinAndSelect('processus.tachesRetrait', 'tachesRetrait')
            .leftJoinAndSelect('processus.tachesRepli', 'tachesRepli')
            .leftJoinAndSelect('affectationPrelevement.filtre', 'filtre')
            .leftJoinAndSelect('prelevement.objectif', 'objectif')
            .where('prelevement.' + nomIdParent + ' = :idParent',
                { nomIdParent: 'prelevement.id' + nomIdParent, idParent: idParent });

        if (inQuery && 'nonPreleve' in inQuery) {
            query.andWhere(new Brackets(subQ => {
                subQ.where(
                    'prelevement.idStatutPrelevement = :idStatutEnAttente AND prelevement.idTypePrelevement = :typeMeta',
                    {
                        idStatutEnAttente: EnumStatutPrelevement.EN_ATTENTE,
                        typeMeta: EnumTypePrelevement.METAOP
                    });
                subQ.orWhere('prelevement.idTypePrelevement = :typeEnvi',
                    {
                        typeEnvi: EnumTypePrelevement.ENVIRONNEMENTAL
                    })
            }))
        }

        query = this.queryService.parseQuery(query, inQuery);

        return await query.getMany();
    }

    async countAllByType(nomIdParent: string, idParent: number, inQuery): Promise<number> {
        let query = this.prelevementRepository.createQueryBuilder('prelevement')
            .leftJoinAndSelect('prelevement.affectationsPrelevement', 'affectationPrelevement')
            .leftJoinAndSelect('prelevement.chantier', 'chantier')
            .leftJoinAndSelect('prelevement.echantillonnage', 'echantillonnage')
            .leftJoinAndSelect('affectationPrelevement.filtre', 'filtre')
            .leftJoinAndSelect('prelevement.objectif', 'objectif')
            .where('prelevement.' + nomIdParent + ' = :idParent',
                { nomIdParent: 'prelevement.id' + nomIdParent, idParent: idParent });

        query = this.queryService.parseQuery(query, inQuery);

        return await query.getCount();
    }

    async get(idPrelevement: number): Promise<Prelevement> {
        return await this.prelevementRepository.createQueryBuilder('prelevement')
            .leftJoinAndSelect('prelevement.interventions', 'interventions')
            .leftJoinAndSelect('prelevement.zoneIntervention', 'zoneIntervention')
            .leftJoinAndSelect('prelevement.objectif', 'objectif')
            .leftJoinAndSelect('prelevement.processus', 'processus')
            .leftJoinAndSelect('prelevement.affectationsPrelevement', 'affectationPrelevement')
            .leftJoinAndSelect('affectationPrelevement.operateurChantier', 'operateurChantier')
            .leftJoinAndSelect('affectationPrelevement.pompe', 'pompe')
            .leftJoinAndSelect('affectationPrelevement.filtre', 'filtre')
            .where('prelevement.id = :idPrelevement', { idPrelevement: idPrelevement }).getOne()
    }

    async create(prelevement: Prelevement): Promise<Prelevement> {
        if (!prelevement.idSitePrelevement) {
            prelevement.idSitePrelevement = null;
        }
        prelevement.idStatutPrelevement = 1;

        const newPrelevement = await this.prelevementRepository.create(prelevement);
        return await this.prelevementRepository.save(newPrelevement)
    }

    async update(prelevement: Prelevement): Promise<Prelevement> {
        return await this.prelevementRepository.save(prelevement)
    }

    async delete(idPrelevement: number): Promise<DeleteResult> {
        return await this.prelevementRepository.delete(idPrelevement)
    }
}
