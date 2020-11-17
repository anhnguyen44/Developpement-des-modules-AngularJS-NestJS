import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {TypeContactDevisCommande} from './type-contact-devis-commande.entity';

@Injectable()
export class TypeContactDevisCommandeService {
    constructor(
        @InjectRepository(TypeContactDevisCommande)
        private readonly fichierRepository: Repository<TypeContactDevisCommande>
    ) {}

    async getAll(): Promise<TypeContactDevisCommande[]> {
        return await this.fichierRepository.createQueryBuilder('typeContactDevisCommande')
            .getMany();
    }
}
