import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {CaptageAspirationSource} from './captage-aspiration-source.entity';


@Injectable()
export class CaptageAspirationSourceService {
    constructor(
        @InjectRepository(CaptageAspirationSource)
        private readonly captageAspirationSourceRepository: Repository<CaptageAspirationSource>
    ) {}

    async getAll(): Promise<CaptageAspirationSource[]> {
        return await this.captageAspirationSourceRepository.createQueryBuilder('captageAspirationSource')
            .getMany();
    }

    async get(idCaptageAspirationSource): Promise<CaptageAspirationSource> {
        return await this.captageAspirationSourceRepository
            .createQueryBuilder('captageAspirationSource')
            .where('captageAspirationSource.id = :idCaptageAspirationSource', {idCaptageAspirationSource: idCaptageAspirationSource})
            .getOne();
    }
}
