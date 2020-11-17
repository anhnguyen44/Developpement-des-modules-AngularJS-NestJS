import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { IRendezVousPompe } from '@aleaac/shared';
import { Pompe } from './pompe.entity';
import { RendezVous } from '../rendez-vous/rendez-vous.entity';


@Entity()
export class RendezVousPompe implements IRendezVousPompe {

    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @ApiModelProperty()
    @ManyToOne(type => Pompe, pompe => pompe.rendezVousPompes, { nullable: true })
    @JoinColumn({ name: 'idPompe' })
    pompe: Pompe;

    @Column({ nullable: true })
    @ApiModelProperty()
    idPompe: number;

    @ApiModelProperty()
    @ManyToOne(type => RendezVous, rendezVous => rendezVous.rendezVousPompes, { cascade: true, nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'idRendezVous' })
    rendezVous: RendezVous;

    @Column({ nullable: true })
    @ApiModelProperty()
    idRendezVous: number;

}
