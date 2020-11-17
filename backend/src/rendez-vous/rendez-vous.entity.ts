import {
    Column,
    Entity, OneToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import {ApiModelProperty} from '@nestjs/swagger';
import {EnumTypePompe, IRendezVous} from '@aleaac/shared';
import {Intervention} from '../intervention/intervention.entity';
import {RendezVousPompe} from '../pompe/rendez_vous_pompe.entity';
import {OneToMany} from 'typeorm';
import {RendezVousRessourceHumaine} from '../ressource-humaine/rendez_vous_ressource-humaine.entity';
import {RendezVousSalle} from '../salle/rendez_vous_salle.entity';


@Entity()
export  class RendezVous implements IRendezVous {

    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column()
    @ApiModelProperty()
    nom: string;

    @Column()
    @ApiModelProperty()
    dateHeureDebut: Date;

    @Column({nullable: true})
    @ApiModelProperty()
    dateHeureFin: Date;

    @Column()
    @ApiModelProperty()
    isDefinitif: boolean;

    @OneToMany(type => RendezVousPompe, rendezVousPompes => rendezVousPompes.rendezVous)
    rendezVousPompes: RendezVousPompe[];

    @OneToMany(type => RendezVousRessourceHumaine, rendezVousRessourceHumaines => rendezVousRessourceHumaines.rendezVous, {onDelete: 'SET NULL'})
    rendezVousRessourceHumaines: RendezVousRessourceHumaine[];

    @OneToMany(type => RendezVousSalle, rendezVousSalles => rendezVousSalles.rendezVous, {onDelete: 'SET NULL'})
    rendezVousSalles: RendezVousSalle[];

    @Column({default: null, nullable: true})
    @ApiModelProperty()
    idParent: number;

    @Column({default: null, nullable: true})
    @ApiModelProperty()
    application: string;

    @OneToOne(type => Intervention, intervention => intervention.rendezVous)
    intervention: Intervention;

    @Column({default: false})
    @ApiModelProperty()
    isAbsence: boolean;
}
