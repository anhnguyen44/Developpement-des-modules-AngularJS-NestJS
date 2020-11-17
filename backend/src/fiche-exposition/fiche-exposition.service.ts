import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import { LatLng } from '../geocoding/LatLng';
import {FicheExposition} from './fiche-exposition.entity';

@Injectable()
export class FicheExpositionService {
    constructor(
        @InjectRepository(FicheExposition)
        private readonly ficheExpositionRepository: Repository<FicheExposition>,
    ) {}

    async create(ficheExposition: FicheExposition): Promise<FicheExposition> {
        const newFicheExposition = await this.ficheExpositionRepository.create(ficheExposition);
        return await this.ficheExpositionRepository.save(newFicheExposition);
    }

    async delete(idFicheExposition: number): Promise<any> {
        return await this.ficheExpositionRepository.delete(idFicheExposition);
   }

}
