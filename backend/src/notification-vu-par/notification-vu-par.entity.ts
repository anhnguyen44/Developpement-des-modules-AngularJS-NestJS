import {
    Entity,
    ManyToOne,
    Column,
    OneToMany,
    PrimaryGeneratedColumn, JoinColumn
} from 'typeorm';

import { ApiModelProperty } from '@nestjs/swagger';
import { INotificationVuPar } from '@aleaac/shared';
import { CUtilisateur } from '../utilisateur/utilisateur.entity';
import { Notification } from '../notification/notification.entity';


@Entity()
export class NotificationVuPar implements INotificationVuPar {
    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @ManyToOne(() => Notification, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idNotification' })
    @ApiModelProperty()
    notification: Notification;

    @Column()
    @ApiModelProperty()
    idNotification: number;

    @ManyToOne(() => CUtilisateur, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idUtilisateur' })
    @ApiModelProperty()
    utilisateur: CUtilisateur;

    @Column()
    @ApiModelProperty()
    idUtilisateur: number;

    @Column()
    @ApiModelProperty()
    date: Date;
}
