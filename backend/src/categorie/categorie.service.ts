import {Injectable} from '@nestjs/common';
import {Repository, UpdateResult} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Categorie} from './categorie.entity';

@Injectable()
export class CategorieService {
    constructor(
        @InjectRepository(Categorie)
        private readonly categorieRepository: Repository<Categorie>,
    ) {}

    async getAll() {
       return await this.categorieRepository.find();
    }
}
