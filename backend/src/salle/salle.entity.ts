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
import {ApiModelProperty} from '@nestjs/swagger';
import {ISalle} from '@aleaac/shared';
import {Bureau} from '../bureau/bureau.entity';
import {RendezVous} from '../rendez-vous/rendez-vous.entity';
import {RendezVousSalle} from './rendez_vous_salle.entity';
import {RendezVousRessourceHumaine} from '../ressource-humaine/rendez_vous_ressource-humaine.entity';


@Entity()
export  class Salle implements ISalle {

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
    libelle: string;

    @Column()
    @ApiModelProperty()
    place: number;

    @Column()
    @ApiModelProperty()
    ref: string;

    @Column()
    @ApiModelProperty()
    idFranchise: number;

    @Column()
    @ApiModelProperty()
    couleur: string;

    @OneToMany(type => RendezVousSalle, rendezVousSalle => rendezVousSalle.salle, { cascade: true })
    rendezVousSalles: RendezVousSalle[];

}
