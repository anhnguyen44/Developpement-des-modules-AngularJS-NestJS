import {Entity, ManyToMany, PrimaryGeneratedColumn, Column, JoinTable} from 'typeorm';

import {ApiModelProperty} from '@nestjs/swagger';
import {Droit} from '../droit/droit.entity';
import { IProfil } from '@aleaac/shared';

@Entity()
export class Profil implements IProfil {
    @ApiModelProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiModelProperty()
    @Column()
    nom: string;

    @ApiModelProperty()
    @Column()
    isVisibleFranchise: boolean;

    @ApiModelProperty()
    @Column({default: true})
    isInterne: boolean;

    @ManyToMany(type => Droit, { eager: true, cascade: true })
    @JoinTable({
        name: 'profil_droit',
        joinColumns: [
            { name: 'idProfil' }
        ],
        inverseJoinColumns: [
            { name: 'idDroit' }
        ]
    })
    public droits: Droit[];
}
