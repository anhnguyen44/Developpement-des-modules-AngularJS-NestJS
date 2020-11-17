import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationVuPar } from './notification-vu-par.entity';
import { QueryService } from '../query/query.service';


@Injectable()
export class NotificationVuParService {
    constructor(
        @InjectRepository(NotificationVuPar)
        private readonly notificationVuParRepository: Repository<NotificationVuPar>,
        private queryService: QueryService
    ) { }

    async getAll(inQuery): Promise<NotificationVuPar[]> {
        let query = this.notificationVuParRepository.createQueryBuilder('notificationVuPar')
        query = this.queryService.parseQuery(query, inQuery);

        return await query.getMany();
    }

    async getAllByProcessus(idProcessus, inQuery): Promise<NotificationVuPar[]> {
        let query = this.notificationVuParRepository.createQueryBuilder('notificationVuPar')
            .leftJoinAndSelect('notificationVuPar.prelevements', 'prelevements')
            .where('idProcessus = :idProcessus', { idProcessus: idProcessus });

        query = this.queryService.parseQuery(query, inQuery);

        return await query.getMany();
    }

    async getAllByZone(idZoneIntervention, inQuery): Promise<NotificationVuPar[]> {
        let query = this.notificationVuParRepository.createQueryBuilder('notificationVuPar')
            .where('idZoneIntervention = :idZoneIntervention', { idZoneIntervention: idZoneIntervention });

        query = this.queryService.parseQuery(query, inQuery);

        return await query.getMany();
    }

    async get(idNotificationVuPar): Promise<NotificationVuPar> {
        return await this.notificationVuParRepository.createQueryBuilder('notificationVuPar')
            .where('notificationVuPar.id = :idNotificationVuPar', { idNotificationVuPar: idNotificationVuPar }).getOne()
    }

    async create(notificationVuPar: NotificationVuPar): Promise<NotificationVuPar> {
        const newNotificationVuPar = this.notificationVuParRepository.create(notificationVuPar);
        return this.notificationVuParRepository.save(newNotificationVuPar);
    }

    async update(notificationVuPar: NotificationVuPar): Promise<NotificationVuPar> {
        return this.notificationVuParRepository.save(notificationVuPar);
    }

    async delete(notificationVuPar: NotificationVuPar): Promise<DeleteResult> {
        return await this.notificationVuParRepository.delete(notificationVuPar.id);
    }
}
