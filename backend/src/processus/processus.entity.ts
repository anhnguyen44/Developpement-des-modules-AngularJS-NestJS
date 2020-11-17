import {
    Entity,
    ManyToOne,
    Column,
    OneToMany,
    PrimaryGeneratedColumn, JoinColumn, ManyToMany, JoinTable
} from 'typeorm';

import {ApiModelProperty} from '@nestjs/swagger';
import {IProcessus} from '@aleaac/shared';
import {Compte} from '../compte/compte.entity';
import {Prelevement} from '../prelevement/prelevement.entity';
import {TacheProcessus} from '../tache-processus/tache-processus.entity';
import {Environnement} from '../environnement/environnement.entity';

@Entity()
export class Processus implements IProcessus {

    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column()
    @ApiModelProperty()
    idCompte: number;

    @ApiModelProperty()
    @ManyToOne(type => Compte, compte => compte.processus)
    @JoinColumn({ name: 'idCompte' })
    compte: Compte;

    @Column()
    @ApiModelProperty()
    description: string;

    @Column()
    @ApiModelProperty()
    idCaptageAspirationSource: number;

    @Column()
    @ApiModelProperty()
    idMpca: number;

    @Column()
    @ApiModelProperty()
    idOutilTechnique: number;

    @Column()
    @ApiModelProperty()
    idTravailHumide: number;

    @Column()
    @ApiModelProperty()
    idTypeBatiment: number;

    @Column()
    @ApiModelProperty()
    isProcessusCyclique: boolean;

    @Column()
    @ApiModelProperty()
    libelle: string;

    @Column()
    @ApiModelProperty()
    niveauAttenduFibresAmiante: number;


    @OneToMany(type => Prelevement, prelevement => prelevement.processus)
    @ApiModelProperty()
    prelevements: Prelevement[];

    @ManyToMany(() => TacheProcessus, { nullable: true, cascade: true })
    @JoinTable({ name: 'processus_tache-installation'})
    @ApiModelProperty()
    tachesInstallation: TacheProcessus[];

    @ManyToMany(() => TacheProcessus, { nullable: true, cascade: true })
    @JoinTable({ name: 'processus_tache-retrait'})
    @ApiModelProperty()
    tachesRetrait: TacheProcessus[];

    @ManyToMany(() => TacheProcessus, { nullable: true, cascade: true })
    @JoinTable({ name: 'processus_tache-repli'})
    @ApiModelProperty()
    tachesRepli: TacheProcessus[];

    @Column()
    @ApiModelProperty()
    tmin: number;

    @Column()
    @ApiModelProperty()
    tsatA: number;
}
