import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { INotification } from '@aleaac/shared';
import { CUtilisateur } from '../utilisateur/utilisateur.entity';
import { NotificationVuPar } from '../notification-vu-par/notification-vu-par.entity';

@Entity()
export class Notification implements INotification {
    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @ManyToMany(() => CUtilisateur, { cascade: true, eager: true })
    @ApiModelProperty()
    @JoinTable({ name: 'notification_destinataire' })
    destinataires: CUtilisateur[];

    @ManyToOne(() => CUtilisateur, { nullable: true })
    @JoinColumn({ name: 'idDemandeur' })
    @ApiModelProperty()
    demandeur: CUtilisateur | null;

    @Column({ nullable: true })
    @ApiModelProperty()
    idDemandeur: number | null;

    @ManyToOne(() => CUtilisateur, { nullable: true })
    @JoinColumn({ name: 'idValideur' })
    @ApiModelProperty()
    valideur: CUtilisateur | null;

    @Column({ nullable: true })
    @ApiModelProperty()
    idValideur: number | null;

    @Column({ type: 'text' })
    @ApiModelProperty()
    contenu: string;

    @Column()
    @ApiModelProperty()
    importance: number;

    @Column()
    @ApiModelProperty()
    dateEnvoi: Date;

    @OneToMany(() => NotificationVuPar, nvp => nvp.notification, { cascade: true, eager: true })
    vuePar: NotificationVuPar[];

    @Column({ nullable: true })
    @ApiModelProperty()
    lien: string | null;

    @Column('tinyint', {
        nullable: true,
        select: false
    })
    vu: boolean; // Pour le front
}
