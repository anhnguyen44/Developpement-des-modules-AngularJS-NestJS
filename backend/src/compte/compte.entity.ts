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
import { ApiModelProperty } from '@nestjs/swagger';
import { Adresse } from '../adresse/adresse.entity';
import { Franchise } from '../franchise/franchise.entity';
import { ICompte } from '@aleaac/shared';
import { Bureau } from '../bureau/bureau.entity';
import { Qualite } from '../qualite/qualite.entity';
import { CompteContact } from '../compte-contact/compte-contact.entity';
import { Droit } from '../droit/droit.entity';
import { GrilleTarif } from '../grille-tarif/grille-tarif.entity';
import { TypeFacturation } from '../type-facturation/type-facturation.entity';
import {Processus} from '../processus/processus.entity';


@Entity()
export class Compte implements ICompte {

    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column({ nullable: true })
    @ApiModelProperty()
    idBureau: number;

    @ManyToOne(type => Bureau)
    @JoinColumn({ name: 'idBureau' })
    @ApiModelProperty()
    bureau: Bureau;

    @Column({ nullable: true })
    @ApiModelProperty()
    idFranchise: number;

    @ManyToOne(type => Franchise)
    @JoinColumn({ name: 'idFranchise' })
    @ApiModelProperty()
    franchise: Franchise;

    @Column({ nullable: true })
    idAdresse: number;

    @ManyToOne(type => Adresse, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idAdresse' })
    @ApiModelProperty()
    adresse: Adresse;

    @ManyToOne(type => Qualite)
    @JoinColumn({ name: 'idQualite' })
    @ApiModelProperty()
    qualite: Qualite;

    @Column({ nullable: true })
    idQualite: number;

    @Column()
    @ApiModelProperty()
    bAccreditationCofrac: boolean;

    @Column()
    @ApiModelProperty()
    bEntreprise: boolean;

    @Column()
    @ApiModelProperty()
    bLaboratoire: boolean;

    @Column({ nullable: true })
    @ApiModelProperty()
    dateValiditeCofrac: Date;

    @Column()
    @ApiModelProperty()
    numClientCompta: string;

    @Column()
    @ApiModelProperty()
    raisonSociale: string;

    @Column()
    @ApiModelProperty()
    commentaire: string;

    @OneToMany(type => CompteContact, compteContacts => compteContacts.compte, { onDelete: 'CASCADE' })
    compteContacts: CompteContact[];

    @Column()
    @ApiModelProperty()
    siret: string;

    @ManyToMany(type => GrilleTarif, {cascade: true})
    @JoinTable({
        name: 'compte_grille-tarif',
        joinColumns: [
            { name: 'idGrilleTarif' }
        ],
        inverseJoinColumns: [
            { name: 'idCompte' }
        ]
    })
    public grilleTarifs: GrilleTarif[];

    @ManyToOne(type => TypeFacturation, { eager: true })
    @JoinColumn({ name: 'idTypeFacturation' })
    @ApiModelProperty()
    typeFacturation: TypeFacturation;

    @Column({ nullable: true })
    idTypeFacturation: number;

    @Column({ nullable: true })
    nbJoursFacturation: number;

    @OneToMany(type => Processus, processus => processus.compte)
    @ApiModelProperty()
    processus: Processus[];
}
