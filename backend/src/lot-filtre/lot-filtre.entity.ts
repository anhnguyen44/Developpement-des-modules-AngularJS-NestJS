import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    Unique
} from 'typeorm';
import {ApiModelProperty} from '@nestjs/swagger';
import {ILotFiltre} from '@aleaac/shared';
import {Bureau} from '../bureau/bureau.entity';
import {Filtre} from '../filtre/filtre.entity';


@Entity()
@Unique('REF_FRANCHISE', ['idFranchise', 'ref'])
export  class LotFiltre implements ILotFiltre {

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
    dateEnvoi: Date;

    @Column()
    @ApiModelProperty()
    idTypeFiltre: number;

    @Column()
    @ApiModelProperty()
    numeroPV: string;

    @Column()
    @ApiModelProperty()
    dateReception: Date;

    @Column({ type: 'decimal', precision: 4, scale: 3 })
    @ApiModelProperty()
    fractFiltre: number;

    @Column()
    @ApiModelProperty()
    surfaceFiltreSecondaire: number;

    @Column({ type: 'decimal', precision: 5, scale: 4 })
    @ApiModelProperty()
    surfaceOuvertureGrille: number;

    @Column()
    @ApiModelProperty()
    nombreGrilleExam: number;

    @Column()
    @ApiModelProperty()
    nombreOuvertureGrillesLues: number;

    @Column()
    @ApiModelProperty()
    nombreFibresComptees: number;

    @Column({ type: 'decimal', precision: 3, scale: 2 })
    @ApiModelProperty()
    resultat: number;

    @Column({ type: 'decimal', precision: 5, scale: 2 })
    @ApiModelProperty()
    observationFiltre: number;

    @Column()
    @ApiModelProperty()
    isConforme: boolean;

    @Column()
    @ApiModelProperty()
    libelle: string;

    @Column()
    @ApiModelProperty()
    lot: string;

    @Column()
    @ApiModelProperty()
    ref: string;

    @OneToMany(type => Filtre, filtre => filtre.lotFiltre)
    filtres: Filtre[];

    @Column()
    @ApiModelProperty()
    idFranchise: number;

}
