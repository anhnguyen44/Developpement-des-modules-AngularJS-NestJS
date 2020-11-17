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
import { IIntervention } from '@aleaac/shared';
import { RendezVous } from '../rendez-vous/rendez-vous.entity';
import { Prelevement } from '../prelevement/prelevement.entity';
import { Filtre } from '../filtre/filtre.entity';
import { Fichier } from '../fichier/fichier.entity';
import { SitePrelevement } from '../site-prelevement/site-prelevement.entity';
import { Chantier } from '../chantier/chantier.entity';
import {Bureau} from '../bureau/bureau.entity';


@Entity()
export class Intervention implements IIntervention {

    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column()
    @ApiModelProperty()
    libelle: string;

    @Column()
    @ApiModelProperty()
    rang: number;

    @Column()
    @ApiModelProperty()
    idFranchise: number;

    @Column({default: null, nullable: true})
    @ApiModelProperty()
    idDevisCommande: number;

    @Column()
    @ApiModelProperty()
    idRendezVous: number;

    @OneToOne(type => RendezVous, rendezvous => rendezvous.intervention, { cascade: true })
    @JoinColumn({ name: 'idRendezVous' })
    rendezVous: RendezVous;

    @ManyToMany(type => Prelevement, prelevement => prelevement.interventions, { cascade: true })
    prelevements: Prelevement[];

    @Column({ nullable: true, default: null })
    @ApiModelProperty()
    idSiteIntervention: number;

    @ManyToOne(type => SitePrelevement, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'idSiteIntervention' })
    @ApiModelProperty()
    siteIntervention: SitePrelevement;

    @Column({default: null, nullable: true})
    @ApiModelProperty()
    idStrategie: number;

    @Column({ nullable: true, default: null })
    @ApiModelProperty()
    idChantier: number;

    @ManyToOne(type => Chantier, chantier => chantier.interventions, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'idChantier' })
    chantier: Chantier;

    @Column({default: null, nullable: true})
    @ApiModelProperty()
    idFacture: number;

    @Column({ nullable: true, default: null })
    @ApiModelProperty()
    dateValidation: Date;

    @Column({ nullable: true, default: null })
    @ApiModelProperty()
    idOrdreIntervention: number;

    @OneToOne(type => Fichier, { cascade: true })
    @JoinColumn({ name: 'idOrdreIntervention' })
    ordreIntervention: Fichier;

    @Column({ nullable: true, default: null })
    @ApiModelProperty()
    idOrdreInterventionValide: number;

    @OneToOne(type => Fichier, { cascade: true })
    @JoinColumn({ name: 'idOrdreInterventionValide' })
    ordreInterventionValide: Fichier;

    @Column({nullable: true, default: null})
    @ApiModelProperty()
    idOrigineValidation: number;

    @Column()
    @ApiModelProperty()
    commentaire: string;

    @Column({ default: 0 })
    @ApiModelProperty()
    nbPompeEnvi: number;

    @Column({ default: 0 })
    @ApiModelProperty()
    nbPompeMeta: number;

    @Column({ default: 0 })
    @ApiModelProperty()
    nbFiltreEnvi: number;

    @Column({ default: 0 })
    @ApiModelProperty()
    nbFiltreMeta: number;

    @Column({ default: 1 })
    @ApiModelProperty()
    idStatut: number;

    @Column({ default: null, nullable: true })
    @ApiModelProperty()
    idBureau: number;

    @ManyToOne(type => Bureau)
    @JoinColumn({ name: 'idBureau' })
    bureau: Bureau;

    @Column({ default: null, nullable: true })
    @ApiModelProperty()
    idFiltreTemoinPI: number;

    @OneToOne(type => Filtre)
    @JoinColumn({ name: 'idFiltreTemoinPI' })
    filtreTemoinPI: Filtre;

    @Column({ default: null, nullable: true })
    @ApiModelProperty()
    idFiltreTemoinPPF: number;

    @OneToOne(type => Filtre)
    @JoinColumn({ name: 'idFiltreTemoinPPF' })
    filtreTemoinPPF: Filtre;
}
