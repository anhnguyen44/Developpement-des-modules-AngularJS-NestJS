import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { RendezVous } from '../rendez-vous/rendez-vous.entity';
import { IRendezVousSalle } from '@aleaac/shared';
import { Salle } from './salle.entity';


@Entity()
export class RendezVousSalle implements IRendezVousSalle {

    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @ApiModelProperty()
    @ManyToOne(type => Salle, salle => salle.rendezVousSalles, { nullable: true })
    @JoinColumn({ name: 'idSalle' })
    salle: Salle;

    @Column({ nullable: true })
    @ApiModelProperty()
    idSalle: number;

    @ApiModelProperty()
    @ManyToOne(type => RendezVous, rendezVous => rendezVous.rendezVousSalles, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'idRendezVous' })
    rendezVous: RendezVous;

    @Column({ nullable: true })
    @ApiModelProperty()
    idRendezVous: number;
}
