import {Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {ApiModelProperty} from '@nestjs/swagger';
import {IActivite, IFiltre} from '@aleaac/shared';
import {Bureau} from '../bureau/bureau.entity';
import {LotFiltre} from '../lot-filtre/lot-filtre.entity';
import {Intervention} from '../intervention/intervention.entity';
import {Prelevement} from '../prelevement/prelevement.entity';
import {AffectationPrelevement} from '../affectationPrelevement/affectation-prelevement.entity';


@Entity()
export  class Filtre implements IFiltre {

    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column()
    @ApiModelProperty()
    idBureau: number;

    @ManyToOne(type => Bureau)
    @JoinColumn({ name: 'idBureau'})
    @ApiModelProperty()
    bureau: Bureau;

    @Column()
    @ApiModelProperty()
    idFranchise: number;

    @Column()
    @ApiModelProperty()
    idLotFiltre: number;

    @ManyToOne(type => LotFiltre, {cascade: true})
    @JoinColumn({ name: 'idLotFiltre'})
    lotFiltre: LotFiltre;

    @Column({default: false})
    @ApiModelProperty()
    isBlanc: boolean;

    @Column()
    @ApiModelProperty()
    idTypeFiltre: number;

    @Column()
    @ApiModelProperty()
    idChantier: number;

    @Column()
    @ApiModelProperty()
    ref: string;

    @Column({nullable: true, default: null})
    @ApiModelProperty()
    idIntervention: number;

    @OneToOne(type => AffectationPrelevement, affectationPrelevement => affectationPrelevement.filtre)
    affectationsPrelevement: AffectationPrelevement[]

}
