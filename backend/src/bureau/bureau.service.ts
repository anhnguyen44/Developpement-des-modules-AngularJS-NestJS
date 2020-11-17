import { Injectable } from '@nestjs/common';
import { Log } from '../logger/logger';
import { DeleteResult, FindManyOptions, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Bureau } from './bureau.entity';
import { Adresse } from '../adresse/adresse.entity';
import { QueryService } from '../query/query.service';
import { GeocodingService } from '../geocoding/geocoding';
import { LatLng } from '../geocoding/LatLng';

@Injectable()
export class BureauService {
    constructor(
        @InjectRepository(Bureau)
        private readonly bureauRepository: Repository<Bureau>,
        @InjectRepository(Adresse)
        private readonly adresseRepository: Repository<Adresse>,
        private readonly queryService: QueryService,
        private readonly geocodingService: GeocodingService
    ) { }

    async getAll(idFranchise, inQuery: string): Promise<Bureau[]> {

        let query = this.bureauRepository.createQueryBuilder('bureau')
            .leftJoinAndSelect('bureau.adresse', 'adresse')
            .where('idFranchise = :idFranchise', { idFranchise: idFranchise });

        if (inQuery) {
            query = this.queryService.parseQuery(query, inQuery);
        }

        return await query.getMany();
    }

    async getAllPricipal(idFranchise, inQuery: string): Promise<Bureau[]> {

        let query = this.bureauRepository.createQueryBuilder('bureau')
            .leftJoinAndSelect('bureau.adresse', 'adresse')
            .where('idFranchise = :idFranchise', { idFranchise: idFranchise })
            .andWhere('bureau.bPrincipal = :num', { num: 1 });

        if (inQuery) {
            query = this.queryService.parseQuery(query, inQuery);
        }

        return await query.getMany();
    }

    async getAllAll(): Promise<Bureau[]> {

        let query = this.bureauRepository.createQueryBuilder('bureau')
            .leftJoinAndSelect('bureau.adresse', 'adresse')
            .leftJoinAndSelect('bureau.franchise', 'franchise');

        return await query.getMany();
    }

    async getById(idBureau: number): Promise<Bureau> {
        const options = {
            relations: ['adresse', 'franchise']
        };
        return await this.bureauRepository.findOne(idBureau, options)
    }

    async create(bureau: Bureau): Promise<Bureau> {
        if (bureau.bPrincipal) {
            await this.bureauRepository.update({ idFranchise: bureau.idFranchise }, { bPrincipal: false })
        }
        const newBureau = await this.bureauRepository.create(bureau);
        const newAdresse = await this.adresseRepository.create(bureau.adresse);
        newBureau.adresse = newAdresse;
        const latLng: LatLng = await this.geocodingService.getLatLng(newAdresse.adresse, newAdresse.cp)
        newAdresse.latitude = latLng.latitude;
        newAdresse.longitude = latLng.longitude;
        await this.adresseRepository.save(newAdresse);
        return await this.bureauRepository.save(newBureau);
    }

    async update(bureau: Bureau): Promise<UpdateResult> {
        if (bureau.bPrincipal) {
            await this.bureauRepository.update({ idFranchise: bureau.idFranchise }, { bPrincipal: false });
        }
        if (bureau.adresse) {
            const latLng: LatLng = await this.geocodingService.getLatLng(bureau.adresse.adresse, bureau.adresse.cp)
            bureau.adresse.latitude = latLng.latitude;
            bureau.adresse.longitude = latLng.longitude;
            await this.adresseRepository.update(bureau.adresse.id, bureau.adresse);
        }
        return await this.bureauRepository.update(bureau.id, bureau);
    }

    async delete(id: number): Promise<DeleteResult> {
        console.log(id);
        const listeAdresses: Array<number> = new Array<number>();

        //for (const id of ids) {
        const pouet = await this.bureauRepository.findOne(id);
        if (pouet && pouet.idAdresse) {
            listeAdresses.push(pouet.idAdresse);
        }
        //}
        const old = await this.getById(id);
        old.idAdresse = null;
        delete old.adresse;
        delete old.franchise;
        await this.update(old);
        await this.adresseRepository.delete(listeAdresses);
        const res = await this.bureauRepository.delete(id);
        return res;
    }

}
