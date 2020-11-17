import {Injectable} from '@nestjs/common';
import {DeleteResult, FindManyOptions, Repository, UpdateResult} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {CodePostal} from './code-postal.entity';
import {QueryService} from '../query/query.service';

@Injectable()
export class CodePostalService {
    constructor(
        @InjectRepository(CodePostal)
        private readonly codePostalRepository: Repository<CodePostal>,
        private queryService: QueryService
        // private readonly log: Log
    ) {}

    async getAll(options?: FindManyOptions<CodePostal>): Promise<CodePostal[]> {

        const searchOptions: FindManyOptions<CodePostal> = {
            ...options
        }
        return await this.codePostalRepository.find(searchOptions);
    }

    async getById(idCodePostal: number): Promise<CodePostal> {
        const options = {};
        return await this.codePostalRepository.findOne(idCodePostal, options)
    }

    async create(codePostal: CodePostal): Promise<CodePostal> {
        const newCodePostal = await this.codePostalRepository.create(codePostal);
        return await this.codePostalRepository.save(newCodePostal);
    }

    async update(codePostal: CodePostal): Promise<UpdateResult> {
        return await this.codePostalRepository.update(codePostal.id, codePostal);
    }

    async delete(ids: number[]): Promise<DeleteResult> {
        return await this.codePostalRepository.delete(ids);
    }

}
