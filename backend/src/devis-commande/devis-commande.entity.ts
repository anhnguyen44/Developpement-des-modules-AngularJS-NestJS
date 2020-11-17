import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IDevisCommande } from '@aleaac/shared';
import { Bureau } from '../bureau/bureau.entity';
import { Contact } from '../contact/contact.entity';
import { DevisCommandeDetail } from '../devis-commande-detail/devis-commande-detail.entity';
import { ApiModelProperty } from '@nestjs/swagger';
import { StatutCommande } from '../statut-commande/statut-commande.entity';
import { MotifAbandonCommande } from '../motif-abandon-commande/motif-abandon-commande.entity';
import { Adresse } from '../adresse/adresse.entity';
import {ContactDevisCommande} from '../contact-devis-commande/contact-devis-commande.entity';

@Entity()
export class DevisCommande implements IDevisCommande {

    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column()
    @ApiModelProperty()
    idFranchise: number;

    @Column()
    @ApiModelProperty()
    typeDevis: number;

    @Column()
    @ApiModelProperty()
    ref: number;

    @Column()
    @ApiModelProperty()
    mission: string;

    @Column({ nullable: true })
    @ApiModelProperty()
    idBureau: number;

    @ManyToOne(type => Bureau)
    @JoinColumn({ name: 'idBureau' })
    @ApiModelProperty()
    bureau: Bureau;

    @OneToMany(type => DevisCommandeDetail, devisCommandeDetail => devisCommandeDetail.devisCommande)
    devisCommandeDetails: DevisCommandeDetail[];

    @ManyToOne(type => StatutCommande, { eager: true })
    @JoinColumn({ name: 'idStatutCommande' })
    @ApiModelProperty()
    statut: StatutCommande;

    @Column({ default: 1 })
    @ApiModelProperty()
    idStatutCommande: number;

    @ManyToOne(type => MotifAbandonCommande, { eager: true, nullable: true })
    @JoinColumn({ name: 'idMotifAbandonCommande' })
    @ApiModelProperty()
    motifAbandonCommande: MotifAbandonCommande;

    @Column({ nullable: true, default: null })
    @ApiModelProperty()
    idMotifAbandonCommande: number;

    @Column()
    @ApiModelProperty()
    raisonStatutCommande: string;

    @Column({ type: 'decimal', default: 20.0, precision: 10, scale: 1 })
    @ApiModelProperty()
    tauxTVA: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    @ApiModelProperty()
    totalTVA: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    @ApiModelProperty()
    totalHT: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    @ApiModelProperty()
    totalRemiseHT: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    @ApiModelProperty()
    totalTTC: number;

    @Column()
    @ApiModelProperty()
    version: number;

    @Column()
    @ApiModelProperty()
    dateCreation: Date;

    @Column()
    @ApiModelProperty()
    commentaireDevis: string;

    @Column()
    @ApiModelProperty()
    commentaireInterne: string;

    @Column({
        default: false
    })
    @ApiModelProperty()
    versionFigee: boolean;

    @Column({
        default: true
    })
    @ApiModelProperty()
    isModifie: boolean;

    @ManyToOne(type => Adresse, { eager: true, nullable: true, cascade: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idAdresse' })
    @ApiModelProperty()
    adresse: Adresse;

    @Column({ nullable: true, default: null })
    @ApiModelProperty()
    idAdresse: number;

    @ApiModelProperty()
    @OneToMany(type => ContactDevisCommande, contactDevisCommande => contactDevisCommande.devisCommande)
    @JoinColumn({name: 'idDevisCommande'})
    contactDevisCommandes: ContactDevisCommande[];


    // non géré par relations, uniquement pour la recherche
    @Column({ nullable: true })
    idChantier?: number | null;

    @Column({ nullable: true })
    idFormation?: number | null;
}