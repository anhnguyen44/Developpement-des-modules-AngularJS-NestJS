import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { Adresse } from '../adresse/adresse.entity';
import { Franchise } from '../franchise/franchise.entity';
import {IActivite, IFicheExposition} from '@aleaac/shared';
import { Contact } from '../contact/contact.entity';
import { CUtilisateur } from '../utilisateur/utilisateur.entity';
import { Categorie } from '../categorie/categorie.entity';
import {RessourceHumaine} from '../ressource-humaine/ressource-humaine.entity';
import {Prelevement} from '../prelevement/prelevement.entity';


@Entity()
export class FicheExposition implements IFicheExposition {

    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column({ nullable: true })
    @ApiModelProperty()
    idRessourceHumaine: number;

    @ManyToOne(type => RessourceHumaine)
    @JoinColumn({ name: 'idRessourceHumaine' })
    @ApiModelProperty()
    ressourceHumaine: RessourceHumaine;

    @Column({nullable: true})
    @ApiModelProperty()
    idPrelevement: number;

    @ManyToOne(type => Prelevement, prelevement => prelevement.fichesExposition)
    @JoinColumn({ name: 'idPrelevement' })
    @ApiModelProperty()
    prelevement: Prelevement;

    @Column()
    @ApiModelProperty()
    date: Date;

    @Column()
    @ApiModelProperty()
    duree: number;

    @Column()
    @ApiModelProperty()
    idRisqueNuisance: number;

    @Column()
    @ApiModelProperty()
    autreRisqueNuisance: string;

    @Column()
    @ApiModelProperty()
    idEPI: number;

    @Column()
    @ApiModelProperty()
    autreEPI: string;
}
