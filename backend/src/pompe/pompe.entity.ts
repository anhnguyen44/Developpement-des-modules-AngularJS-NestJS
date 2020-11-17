import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';
import {ApiModelProperty} from '@nestjs/swagger';
import {EnumTypePompe, IPompe} from '@aleaac/shared';
import {Bureau} from '../bureau/bureau.entity';
import {RendezVousPompe} from './rendez_vous_pompe.entity';


@Entity()
export  class Pompe implements IPompe {

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
    dateEtalonnage: Date;

    @Column()
    @ApiModelProperty()
    periodeEtalonnage: number;

    @Column()
    @ApiModelProperty()
    dateValidation: Date;

    @Column()
    @ApiModelProperty()
    periodeValidation: number;

    @Column()
    @ApiModelProperty()
    dateVerifAnnexe: Date;

    @Column()
    @ApiModelProperty()
    periodeVerifAnnexe: number;

    @Column()
    @ApiModelProperty()
    incertitude: number;

    /*@Column()
    @ApiModelProperty()
    indice: number;

    @Column()
    @ApiModelProperty()
    indiceHoraire: number;*/

    @Column()
    @ApiModelProperty()
    indiceVolumique: number;

    @Column()
    @ApiModelProperty()
    libelle: string;

    @Column()
    @ApiModelProperty()
    ref: string;

    @Column()
    @ApiModelProperty()
    idTypePompe: EnumTypePompe;

    @Column()
    @ApiModelProperty()
    idFranchise: number;

    @OneToMany(type => RendezVousPompe, rendezVousPompes => rendezVousPompes.pompe, { cascade: true })
    rendezVousPompes: RendezVousPompe[];

    @Column()
    @ApiModelProperty()
    couleur: string

}
