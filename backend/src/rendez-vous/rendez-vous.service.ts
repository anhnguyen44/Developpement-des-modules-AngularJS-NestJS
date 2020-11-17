import {Injectable} from '@nestjs/common';
import {Repository, UpdateResult, FindManyOptions} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Consommable} from '../consommable/consommable.entity';
import {QueryService} from '../query/query.service';
import {Filtre} from '../../../frontend/src/app/logistique/Filtre';
import {RendezVous} from './rendez-vous.entity';

@Injectable()
export class RendezVousService {
    constructor(
        @InjectRepository(RendezVous)
        private readonly rendezVousRepository: Repository<RendezVous>
    ) {}

    async getAll(idFranchise: number): Promise<RendezVous[]> {
        return await this.rendezVousRepository
            .createQueryBuilder('rendez-vous')
            .where('pompe.idFranchise = :idFranchise', {idFranchise: idFranchise}).getMany();
    }

    async delete(idRendezVous: number) {
        return await this.rendezVousRepository.delete(idRendezVous);
    }
}
