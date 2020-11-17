import { Injectable } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { QueryService } from '../query/query.service';
import { NotificationVuPar } from '../notification-vu-par/notification-vu-par.entity';

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>,
        @InjectRepository(NotificationVuPar)
        private readonly notificationVuParRepository: Repository<NotificationVuPar>,
        private queryService: QueryService
    ) { }

    async getAll(idUser: number, inQuery) {
        let query = this.notificationRepository
            .createQueryBuilder('notification')
            .leftJoinAndSelect('notification.destinataires', 'destinataires')
            .leftJoinAndSelect('notification.vuePar', 'vuePar')
            // Hack en attendant typeORM 0.3 avec addSelectAndMap -- En fait même ça ça marche pas
            // .addSelect(s => s.select('EXISTS(SELECT 1')
            //     .from('notification_vu_par', 'nvp')
            //     .where('nvp.idNotification = notification.id AND nvp.idUtilisateur = :id)', { id: idUser })
            //     , 'vu')
            .where('destinataires.id = :idUser OR notification.idValideur = :idUser', { idUser: idUser })
            .orderBy('dateEnvoi', 'DESC');
        query = this.queryService.parseQuery(query, inQuery);

        const res = await query.getMany();

        const listeIds = [...res].map(x => x.id);
        let listeVues = new Array<NotificationVuPar>();
        if (res && res.length > 0) {
            if (listeIds.length > 0) {
                listeVues = await this.notificationVuParRepository.find({
                    where: {
                        idNotification: In(listeIds),
                        idUtilisateur: idUser
                    }
                });
            }
        }

        for (const notif of res) {
            // Si la liste des vues filtrée par utilisateur contient la notif en cours, elle a été vue
            notif.vu = listeVues.findIndex(x => x.idNotification === notif.id) > -1;
        }

        return res;
    }

    async countAll(idUser: number, inQuery: string) {
        let query = this.notificationRepository
            .createQueryBuilder('notification')
            .leftJoinAndSelect('notification.destinataires', 'destinataires')
            .where('destinataires.id = :idUser OR notification.idValideur = :idUser', { idUser: idUser });
        query = this.queryService.parseQuery(query, inQuery);

        return await query.getCount()
    }

    async countUnread(idUser: number, inQuery: string) {
        let query = this.notificationRepository
            .createQueryBuilder('notification')
            .leftJoinAndSelect('notification.destinataires', 'destinataires')
            .where('destinataires.id = :idUser OR notification.idValideur = :idUser', { idUser: idUser });
        query = this.queryService.parseQuery(query, inQuery);

        const res = await query.getMany();
        let listeVues = new Array<NotificationVuPar>();
        if (res && res.length > 0) {
            const listeIds = [...res].map(x => x.id);
            if (listeIds.length > 0) {
                listeVues = await this.notificationVuParRepository.find({
                    where: {
                        idNotification: In(listeIds),
                        idUtilisateur: idUser
                    }
                });
            }
        }

        for (const notif of res) {
            // Si la liste des vues filtrée par utilisateur contient la notif en cours, elle a été vue
            notif.vu = listeVues.findIndex(x => x.idNotification === notif.id) > -1;
        }

        return res.filter(x => !x.vu).length;
    }

    async get(idNotification: number): Promise<Notification> {

        return await this.notificationRepository.createQueryBuilder('notification')
            .where('notification.id = :idNotification', { idNotification: idNotification }).getOne()
    }

    async create(notification: Notification): Promise<Notification> {

        const newNotification = await this.notificationRepository.create(notification);
        return await this.notificationRepository.save(newNotification);
    }

    async update(notification: Notification): Promise<Notification> {
        return await this.notificationRepository.save(notification)
    }
}
