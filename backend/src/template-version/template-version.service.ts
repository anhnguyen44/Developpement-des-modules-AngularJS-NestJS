import { Injectable } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TemplateVersion } from './template-version.entity';
import { QueryService } from '../query/query.service';
import { EnumTypeTemplate } from '@aleaac/shared';
import { Fichier } from '../fichier/fichier.entity';

@Injectable()
export class TemplateVersionService {
    constructor(
        @InjectRepository(TemplateVersion)
        private readonly templateVersionRepository: Repository<TemplateVersion>,
        @InjectRepository(Fichier)
        private readonly fichierRepository: Repository<Fichier>,
    ) { }

    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }


    async getAll(): Promise<Array<TemplateVersion>> {
        const lignes = await this.templateVersionRepository.find();
        const res: TemplateVersion[] = new Array<TemplateVersion>();
        const listeTemplates = [...lignes].map(x => x.typeTemplate).filter(this.onlyUnique);

        for (const templateType of listeTemplates) {
            const max = await this.getMaxVersionFor(templateType);
            res.push(lignes.find(t =>  t.typeTemplate === templateType && t.version === max));
        }

        return res.sort((a, b) => { return a.typeTemplate < b.typeTemplate ? -1 : 1 });
    }

    async countAll(): Promise<number> {
        return (await this.getAll()).length;
    }


    async getVersion(type: EnumTypeTemplate, version: number = 0): Promise<TemplateVersion> {
        const tout = await this.templateVersionRepository.createQueryBuilder('templateVersion')
        .where('templateVersion.typeTemplate = :idType', { idType: type })
        .orderBy('templateVersion.version', 'DESC').getMany();

        if (version > 0) {
            return tout.find(t => t.version === version);
        } else {
            return tout[0];
        }
    }

    async getFichierVersion(type: EnumTypeTemplate, version: number = 0): Promise<Fichier> {
        const tout = await this.templateVersionRepository.createQueryBuilder('templateVersion')
        .where('templateVersion.typeTemplate = :idType', { idType: type })
        .orderBy('templateVersion.version', 'DESC').getMany();

        if (version > 0) {
            return await this.fichierRepository.findOne(tout.find(t => t.version === version).idFichier);
        } else {
            return await this.fichierRepository.findOne(tout[0].idFichier);
        }
    }

    async getMaxVersionFor(type: number) {
        const query = this.templateVersionRepository.createQueryBuilder('templateVersion');
        query.select('MAX(templateVersion.version)', 'max')
        .where('templateVersion.typeTemplate = :idType', { idType: type });

        return (await query.getRawOne()).max;
    }

    async get(idTemplateVersion: number): Promise<TemplateVersion> {

        return await this.templateVersionRepository.createQueryBuilder('templateVersion')
            .where('templateVersion.id = :idTemplateVersion', { idTemplateVersion: idTemplateVersion }).getOne()
    }

    async create(templateVersion: TemplateVersion): Promise<TemplateVersion> {

        const newTemplateVersion = await this.templateVersionRepository.create(templateVersion);
        return await this.templateVersionRepository.save(newTemplateVersion);
    }

    async update(templateVersion: TemplateVersion): Promise<TemplateVersion> {
        return await this.templateVersionRepository.save(templateVersion)
    }
}
