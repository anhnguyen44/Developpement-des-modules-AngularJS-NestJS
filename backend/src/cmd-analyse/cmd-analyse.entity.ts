import {
    Entity,
    ManyToOne,
    Column,
    JoinColumn,
    PrimaryGeneratedColumn,
    OneToMany, ManyToMany, JoinTable
} from 'typeorm';

import { ApiModelProperty } from '@nestjs/swagger';
import { IPrelevement } from '@aleaac/shared';
import {Chantier} from '../chantier/chantier.entity';
import {ICmdAnalyse} from '@aleaac/shared';
import {Prelevement} from '../prelevement/prelevement.entity';


@Entity()
export class CmdAnalyse implements ICmdAnalyse {

    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column({default: null, nullable: true})
    @ApiModelProperty()
    idChantier: number;

    @ManyToOne(type => Chantier, chantier => chantier.prelevements, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({name: 'idChantier'})
    chantier: Chantier;

    @Column()
    @ApiModelProperty()
    idTypePrelevement: number;

    @Column()
    @ApiModelProperty()
    dateEnvoi: Date;

    @Column()
    @ApiModelProperty()
    dateRetour: Date;

    @OneToMany(type => Prelevement, prelevement => prelevement.cmdAnalyse)
    prelevements: IPrelevement[];
}
