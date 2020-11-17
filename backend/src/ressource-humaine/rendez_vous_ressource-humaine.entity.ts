import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import {ApiModelProperty} from '@nestjs/swagger';
import {RendezVous} from '../rendez-vous/rendez-vous.entity';
import {RessourceHumaine} from './ressource-humaine.entity';
import {IRendezVousRessourceHumaine} from '@aleaac/shared';


@Entity()
export  class RendezVousRessourceHumaine implements IRendezVousRessourceHumaine {

    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @ApiModelProperty()
    @ManyToOne(type => RessourceHumaine, ressourceHumaine => ressourceHumaine.rendezVousRessourceHumaines)
    @JoinColumn({name: 'idRessourceHumaine'})
    ressourceHumaine: RessourceHumaine;

    @Column({nullable: true})
    @ApiModelProperty()
    idRessourceHumaine: number;

    @ApiModelProperty()
    @ManyToOne(type => RendezVous, rendezVous => rendezVous.rendezVousRessourceHumaines, {onDelete: 'SET NULL'})
    @JoinColumn({name: 'idRendezVous'})
    rendezVous: RendezVous;

    @Column({nullable: true})
    @ApiModelProperty()
    idRendezVous: number;

}
