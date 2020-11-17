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
import {ISalle, IFonctionRH, IFormationValideRH, IRendezVousRessourceHumaine} from '@aleaac/shared';
import {Bureau} from '../bureau/bureau.entity';
import {IRessourceHumaine} from '@aleaac/shared';
import {CUtilisateur} from '../utilisateur/utilisateur.entity';
import {RendezVous} from '../rendez-vous/rendez-vous.entity';
import {RendezVousRessourceHumaine} from './rendez_vous_ressource-humaine.entity';
import {RendezVousPompe} from '../pompe/rendez_vous_pompe.entity';
import { RhFonction } from '../rh-fonction/rh-fonction.entity';
import { RhFormationValide } from '../rh-formationValide/rh-formationValide.entity';
import { CFormation } from '../formation/formation.entity';
import { TypeFormation } from '../type-formation/type-formation.entity';


@Entity()
export  class RessourceHumaine implements IRessourceHumaine {

    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @ManyToOne(type => Bureau)
    @JoinColumn({ name: 'idBureau'})
    @ApiModelProperty()
    bureau: Bureau;

    @Column()
    @ApiModelProperty()
    idBureau: number;

    @Column()
    @ApiModelProperty()
    idFranchise: number;

    @Column()
    @ApiModelProperty()
    idUtilisateur: number;

    @OneToOne(type => CUtilisateur)
    @JoinColumn({ name: 'idUtilisateur'})
    @ApiModelProperty()
    utilisateur: CUtilisateur;

    @Column()
    @ApiModelProperty()
    couleur: string;

    // @ApiModelProperty()
    // @ManyToOne(type => TypeFormation, { nullable: true })
    // @JoinColumn({ name: 'idformationHabilite' })
    // formationHabilite: TypeFormation;

    /*@ManyToMany(type => RendezVous, {cascade: true})
    @JoinTable({
        name: 'rendez_vous_ressource_humaine',
        joinColumns: [
            { name: 'idRessourceHumaine' }
        ],
        inverseJoinColumns: [
            { name: 'idRendezVous' }
        ]
    })
    rendezVous: RendezVous[];*/

    @OneToMany(type=> RhFonction, rhFonction => rhFonction.rh, { cascade: true })
    fonctions: IFonctionRH[];

    @OneToMany(type=> RhFormationValide, rhFormationValide => rhFormationValide.rh, { cascade: true })
    formationValide: IFormationValideRH[];

    @OneToMany(type => RendezVousRessourceHumaine, rendezVousRessourceHumaine => rendezVousRessourceHumaine.ressourceHumaine, { cascade: true })
    rendezVousRessourceHumaines: IRendezVousRessourceHumaine[];

}
