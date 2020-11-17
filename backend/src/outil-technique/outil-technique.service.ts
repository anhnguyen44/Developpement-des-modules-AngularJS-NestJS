import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {OutilTechnique} from './outil-technique.entity';
import {CaptageAspirationSource} from '../captage-aspiration-source/captage-aspiration-source.entity';


@Injectable()
export class OutilTechniqueService {
    constructor(
        @InjectRepository(OutilTechnique)
        private readonly outilTechniqueRepository: Repository<OutilTechnique>
    ) {}

    async getAll(): Promise<OutilTechnique[]> {
        return await this.outilTechniqueRepository.createQueryBuilder('outilTechnique')
            .getMany();
    }

    async get(idOutilTechnique): Promise<OutilTechnique> {
        return await this.outilTechniqueRepository
            .createQueryBuilder('outilTechnique')
            .where('outilTechnique.id = :idOutilTechnique', {idOutilTechnique: idOutilTechnique})
            .getOne();
    }
}
