import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {TravailHumide} from './travail-humide.entity';
import {CaptageAspirationSource} from '../captage-aspiration-source/captage-aspiration-source.entity';


@Injectable()
export class TravailHumideService {
    constructor(
        @InjectRepository(TravailHumide)
        private readonly outilTechniqueRepository: Repository<TravailHumide>
    ) {}

    async getAll(): Promise<TravailHumide[]> {
        return await this.outilTechniqueRepository.createQueryBuilder('travailHumide')
            .getMany();
    }

    async get(idTravailHumide): Promise<CaptageAspirationSource> {
        return await this.outilTechniqueRepository
            .createQueryBuilder('travailHumide')
            .where('travailHumide.id = :idTravailHumide', {idTravailHumide: idTravailHumide})
            .getOne();
    }
}
