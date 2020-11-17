import { Injectable } from '@nestjs/common';
import { Repository, DeepPartial } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import {AffectationPrelevement} from './affectation-prelevement.entity';

@Injectable()
export class AffectationPrelevementService {
    constructor(
        @InjectRepository(AffectationPrelevement)
        private readonly affectationPrelevementRepository: Repository<AffectationPrelevement>,
    ) { }

    async create(affectationPrelevement: AffectationPrelevement): Promise<AffectationPrelevement> {
        const newAffectationPrelevement = await this.affectationPrelevementRepository.create(affectationPrelevement);
        return await this.affectationPrelevementRepository.save(newAffectationPrelevement);
    }

    async delete(idAffectationPrelevement: number) {
        return await this.affectationPrelevementRepository.delete(idAffectationPrelevement);
    }
}
