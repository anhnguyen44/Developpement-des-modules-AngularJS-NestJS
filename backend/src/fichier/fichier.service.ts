import { Injectable } from '@nestjs/common';
import { Repository, DeepPartial } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Fichier } from './fichier.entity';
import * as fs from 'fs';
import { HistoriqueService } from '../historique/historique.service';
import { CurrentUtilisateur } from '../utilisateur/utilisateur.decorator';
import { IFichier, EnumTypeFichier } from '@aleaac/shared';

@Injectable()
export class FichierService {
    constructor(
        @InjectRepository(Fichier)
        private readonly fichierRepository: Repository<Fichier>,
        private historiqueService: HistoriqueService
    ) { }

    async getAll(application: string, idParent: number): Promise<Fichier[]> {
        return await this.fichierRepository.createQueryBuilder('fichier')
            .leftJoinAndSelect('fichier.utilisateur', 'utilisateur')
            .leftJoinAndSelect('fichier.typeFichier', 'typeFichier')
            .where('fichier.application = :application AND fichier.idParent = :idParent',
                { application: application, idParent: idParent })
            .orderBy('date', 'DESC')
            .getMany();
    }

    async getAllByType(application: string, idParent: number, type: EnumTypeFichier): Promise<Fichier[]> {
        return await this.fichierRepository.createQueryBuilder('fichier')
            .leftJoinAndSelect('fichier.utilisateur', 'utilisateur')
            .leftJoinAndSelect('fichier.typeFichier', 'typeFichier')
            .where('fichier.application = :application AND fichier.idParent = :idParent AND idTypeFichier = :typeFichier',
                { application: application, idParent: idParent, typeFichier: type })
            .orderBy('date', 'DESC')
            .getMany();
    }

    async getLastByType(application: string, idParent: number, type: EnumTypeFichier): Promise<Fichier> {
        return await this.fichierRepository.createQueryBuilder('fichier')
            .leftJoinAndSelect('fichier.utilisateur', 'utilisateur')
            .leftJoinAndSelect('fichier.typeFichier', 'typeFichier')
            .where('fichier.application = :application AND fichier.idParent = :idParent AND idTypeFichier = :typeFichier',
                { application: application, idParent: idParent, typeFichier: type })
            .orderBy('date', 'DESC')
            .getOne();
    }

    async create(fichier: IFichier, @CurrentUtilisateur() user, keepOldIfExists: boolean = false): Promise<Fichier> {
        fichier = this.fichierRepository.create(fichier); // On s'assure d'avoir une instance de type Fichier
        const oldFichier = await this.fichierRepository.createQueryBuilder('fichier')
            .where('nom = :nom && application = :application && idParent = :idParent && extention = :extention',
                { nom: fichier.nom, application: fichier.application, idParent: Number(fichier.idParent), extention: fichier.extention })
            .getOne();
        // console.log(oldFichier);
        if (oldFichier && !keepOldIfExists) {
            if (user) {
                this.historiqueService.add(user.id, fichier.application, fichier.idParent, 'Remplacement fichier : ' + fichier.nom);
            }
            try {
                fs.unlinkSync('./uploads/' + oldFichier.keyDL);
            } catch (e) {
                console.error('Fichier impossible à supprimer ./uploads/' + oldFichier.keyDL);
            }
            fichier.idUtilisateur = user.id;
            fichier.id = oldFichier.id;
            return await this.fichierRepository.save(fichier)
        } else {
            if (user) {
                this.historiqueService.add(user.id, fichier.application, fichier.idParent, 'Ajout fichier : ' + fichier.nom);
            }
            fichier.idUtilisateur = user ? user.id : null;
            fichier.idParent = Number(fichier.idParent);
            const newFichier = await this.fichierRepository.create(fichier);
            newFichier.commentaire = fichier.commentaire;
            return await this.fichierRepository.save(newFichier);
        }
    }

    async update(fichier: Fichier) {
        return await this.fichierRepository.save(fichier)
    }

    async updatePartial(fichier: DeepPartial<Fichier>) {
        return await this.fichierRepository.update(fichier.id, fichier)
    }

    async get(keyDL) {
        return await this.fichierRepository.createQueryBuilder('fichier')
            .where('keyDL = :keyDL', { keyDL: keyDL }).getOne();
    }

    async getById(id) {
        return await this.fichierRepository.createQueryBuilder('fichier')
            .where('id = :id', { id: id }).getOne();
    }

    async getAsBase64ById(id): Promise<string> {
        const foundFile = await this.getById(parseInt(id, 10));
        const res = fs.readFileSync('./uploads/' + foundFile.keyDL, 'base64');
        return res;
    }

    async delete(idFichier: number, @CurrentUtilisateur() user) {
        const fichier = await this.fichierRepository.findOne(idFichier)
        this.historiqueService.add(user.id, fichier.application, fichier.idParent, 'Suppression fichier : ' + fichier.nom)
        return await this.fichierRepository.delete(idFichier);
    }
}
