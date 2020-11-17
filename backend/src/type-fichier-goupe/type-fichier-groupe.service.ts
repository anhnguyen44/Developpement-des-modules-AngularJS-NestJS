import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import { TypeFichierGroupe} from './type-fichier-groupe.entity';

@Injectable()
export class TypeFichierGroupeService {
    constructor(
        @InjectRepository(TypeFichierGroupe)
        private readonly typeFichierRepository: Repository<TypeFichierGroupe>
    ) {}

    async getAll(): Promise<TypeFichierGroupe[]> {
        return await this.typeFichierRepository.createQueryBuilder('typeFichierGroupe')
            .getMany();
    }

    async create(typeFichier) {
        const newTypeFichier = await this.typeFichierRepository.create(typeFichier);
        return await this.typeFichierRepository.save(newTypeFichier);
    }

    async update(typeFichier) {
        return await this.typeFichierRepository.save(typeFichier);
    }
}
