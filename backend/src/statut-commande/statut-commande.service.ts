import {Injectable} from '@nestjs/common';
import {StatutCommande} from './statut-commande.entity';
import {Repository, FindManyOptions} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {QueryService} from '../query/query.service';
import {HistoriqueService} from '../historique/historique.service';

@Injectable()
export class StatutCommandeService {
    constructor(
        @InjectRepository(StatutCommande)
        private readonly devisCommandeRepository: Repository<StatutCommande>,
        private queryService: QueryService,
        private historiqueService: HistoriqueService,
    ) { }

    async get(idStatutCommande: number): Promise<StatutCommande> {
       return await this.devisCommandeRepository.findOne(idStatutCommande);
    }

    async getAll(): Promise<StatutCommande[]> {
        const opt: FindManyOptions<StatutCommande> = {
            relations: ['parent']
        };
        return this.devisCommandeRepository.find(opt);
    }

    async countAll(): Promise<number> {
        return this.devisCommandeRepository.count();
    }

    async create(requestBody: StatutCommande, req): Promise<StatutCommande> {
        // TODO : check si enfants. Si statut a déjà des enfants il ne peut avoir de parent
        let newStatutCommande = await this.devisCommandeRepository.create(requestBody);
        newStatutCommande = await this.devisCommandeRepository.save(newStatutCommande);
        return newStatutCommande;
    }

    async update(requestBody: StatutCommande, req): Promise<StatutCommande> {
        const oldStatutCommande = await this.devisCommandeRepository.findOneOrFail(requestBody.id)

        let historique = '';
        // modification page information
        if (requestBody.nom && requestBody.nom !== oldStatutCommande.nom) {
            historique += 'Nom : ' + oldStatutCommande.nom + ' => ' + requestBody.nom + '.'
        }
        if (requestBody.ordre && requestBody.ordre !== oldStatutCommande.ordre) {
            historique += 'Ordre : ' + oldStatutCommande.ordre + ' => ' + requestBody.ordre + '.'
        }
        if (requestBody.parent && requestBody.parent.id !== oldStatutCommande.parent.id) {
            historique += 'ParentId : ' + oldStatutCommande.parent.id + ' => ' + requestBody.parent.id + '.'
        }

        if (historique.length > 0) {
            this.historiqueService.add(req.user.id, 'statut-commande', requestBody.id, historique);
        }
        return await this.devisCommandeRepository.save(requestBody)
    }
}