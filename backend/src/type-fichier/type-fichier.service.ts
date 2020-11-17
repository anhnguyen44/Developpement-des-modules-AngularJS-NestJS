import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeFichier } from './type-fichier.entity';

@Injectable()
export class TypeFichierService {
    constructor(
        @InjectRepository(TypeFichier)
        private readonly typeFichierRepository: Repository<TypeFichier>
    ) { }

    async getAll(): Promise<TypeFichier[]> {
        return await this.typeFichierRepository.createQueryBuilder('typeFichier')
            .leftJoinAndSelect('typeFichier.groupe', 'groupe')
            .getMany();
    }

    async getAllAffectable(idGroupe: number): Promise<TypeFichier[]> {
        return await this.typeFichierRepository.createQueryBuilder('typeFichier')
            .leftJoinAndSelect('typeFichier.groupe', 'groupe')
            .where('affectable = :affectable AND (idGroupe = :idGroupe OR idGroupe IS NULL)', { affectable: 1, idGroupe: idGroupe })
            .getMany();
    }

    async create(typeFichier) {
        const newTypeFichier = await this.typeFichierRepository.create(typeFichier);
        return await this.typeFichierRepository.save(newTypeFichier);
    }

    async update(typeFichier) {
        return await this.typeFichierRepository.save(typeFichier);
    }

    async get(id: number) {
        return await this.typeFichierRepository.findOneOrFail(id);
    }
}
