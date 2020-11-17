import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Mpca} from './mpca.entity';
import {OutilTechnique} from '../outil-technique/outil-technique.entity';


@Injectable()
export class MpcaService {
    constructor(
        @InjectRepository(Mpca)
        private readonly mpcaRepository: Repository<Mpca>
    ) {}

    async getAll(): Promise<Mpca[]> {
        return await this.mpcaRepository.createQueryBuilder('mpca')
            .getMany();
    }

    async get(idMpca): Promise<OutilTechnique> {
        return await this.mpcaRepository
            .createQueryBuilder('mpca')
            .where('mpca.id = :idMpca', {idMpca: idMpca})
            .getOne();
    }
}
