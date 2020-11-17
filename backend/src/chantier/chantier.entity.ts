import { IChantier } from '@aleaac/shared';
import { ApiModelProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { BesoinClientLabo } from '../besoin-client-labo/besoin-client-labo.entity';
import { Bureau } from '../bureau/bureau.entity';
import { ContactChantier } from '../contact-chantier/contact-chantier.entity';
import { Contact } from '../contact/contact.entity';
import { Franchise } from '../franchise/franchise.entity';
import { GrilleTarif } from '../grille-tarif/grille-tarif.entity';
import { SitePrelevement } from '../site-prelevement/site-prelevement.entity';
import { StatutCommande } from '../statut-commande/statut-commande.entity';
import { CUtilisateur } from '../utilisateur/utilisateur.entity';
import { MotifAbandonCommande } from '../motif-abandon-commande/motif-abandon-commande.entity';
import { DevisCommande } from '../devis-commande/devis-commande.entity';
import { Strategie } from '../strategie/strategie.entity';
import { Intervention } from '../intervention/intervention.entity';
import { Fichier } from '../fichier/fichier.entity';
import { Prelevement } from '../prelevement/prelevement.entity';

@Entity()
export class Chantier implements IChantier {
    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column()
    @ApiModelProperty()
    reference: number;

    @ManyToOne(() => Franchise, { nullable: true })
    @JoinColumn({ name: 'idFranchise' })
    franchise: Franchise;

    @Column({ nullable: true })
    @ApiModelProperty()
    idFranchise: number;

    @ManyToOne(() => Bureau, { nullable: true })
    @JoinColumn({ name: 'idBureau' })
    bureau: Bureau;

    @Column({ nullable: true })
    @ApiModelProperty()
    idBureau: number;

    @Column()
    @ApiModelProperty()
    nomChantier: string;

    @ManyToOne(() => Contact)
    @JoinColumn({ name: 'idClient' })
    client: Contact;

    @Column()
    @ApiModelProperty()
    idClient: number;

    @OneToMany(() => ContactChantier, cc => cc.chantier, { cascade: true })
    @JoinTable({ name: 'contacts_chantier' })
    @ApiModelProperty()
    contacts: ContactChantier[];

    @ManyToOne(() => CUtilisateur, { nullable: true })
    @JoinColumn({ name: 'idChargeClient' })
    @ApiModelProperty()
    chargeClient: CUtilisateur;

    @Column({ nullable: true })
    @ApiModelProperty()
    idChargeClient: number;

    @ManyToOne(() => CUtilisateur, { nullable: true })
    @JoinColumn({ name: 'idRedacteurStrategie' })
    @ApiModelProperty()
    redacteurStrategie: CUtilisateur;

    @Column({ nullable: true })
    @ApiModelProperty()
    idRedacteurStrategie: number;

    @ManyToOne(() => CUtilisateur, { nullable: true })
    @JoinColumn({ name: 'idValideurStrategie' })
    @ApiModelProperty()
    valideurStrategie: CUtilisateur;

    @Column({ nullable: true })
    @ApiModelProperty()
    idValideurStrategie: number;

    @ManyToOne(() => GrilleTarif, { nullable: true })
    @JoinColumn({ name: 'idTarif' })
    @ApiModelProperty()
    tarif: GrilleTarif;

    @Column({ nullable: true })
    @ApiModelProperty()
    idTarif: number;

    @ManyToOne(() => StatutCommande, { cascade: true })
    @JoinColumn({ name: 'idStatut' })
    @ApiModelProperty()
    statut: StatutCommande;

    @Column()
    @ApiModelProperty()
    idStatut: number;

    @Column({ type: 'date', nullable: true, default: null })
    @ApiModelProperty()
    dateReceptionDemande: Date;

    @Column({ type: 'date', nullable: true, default: null })
    @ApiModelProperty()
    dateDevisSouhaitee: Date;

    @Column({ type: 'date', nullable: true, default: null })
    @ApiModelProperty()
    dateStrategieSouhaitee: Date;

    @Column({ type: 'date', nullable: true, default: null })
    @ApiModelProperty()
    dateDernierPrelevement: Date;

    @Column({ type: 'date', nullable: true, default: null })
    @ApiModelProperty()
    dateCommande: Date;

    @Column({ type: 'date', nullable: true, default: null })
    @ApiModelProperty()
    dateEmissionRapport: Date;

    @Column({ type: 'date', nullable: true, default: null })
    @ApiModelProperty()
    dateMiseADispoDernierRE: Date;

    @Column({ type: 'date', nullable: true, default: null })
    @ApiModelProperty()
    debutPeriodeIntervention: Date;

    @Column({ type: 'date', nullable: true, default: null })
    @ApiModelProperty()
    finPeriodeIntervention: Date;

    @Column({ type: 'date', nullable: true, default: null })
    @ApiModelProperty()
    datePreviDemarrage: Date;

    @Column({ type: 'date', nullable: true, default: null })
    @ApiModelProperty()
    datePreviFinChantier: Date;

    @OneToMany(() => SitePrelevement, sitePrelevement => sitePrelevement.chantier)
    @JoinColumn({ name: 'idChantier' })
    @ApiModelProperty()
    sitesPrelevement: SitePrelevement[];

    @OneToOne(() => BesoinClientLabo, b => b.chantier, { nullable: true, eager: true, cascade: true })
    @JoinColumn({ name: 'idBesoinClient' })
    @ApiModelProperty()
    besoinClient: BesoinClientLabo;

    @Column({ nullable: true })
    @ApiModelProperty()
    idBesoinClient: number;

    @Column()
    @ApiModelProperty()
    createdAt: Date;

    @Column({ nullable: true, default: null })
    @ApiModelProperty()
    updatedAt: Date;

    @Column({ nullable: true, default: null })
    @ApiModelProperty()
    raisonStatutCommande: string;

    @ManyToOne(() => MotifAbandonCommande, { nullable: true, eager: true })
    @JoinColumn({ name: 'idMotifAbandonCommande' })
    @ApiModelProperty()
    motifAbandonCommande: MotifAbandonCommande;

    @Column({ nullable: true })
    @ApiModelProperty()
    idMotifAbandonCommande: number;

    @ManyToMany(() => DevisCommande)
    @JoinTable({ name: 'chantier_devis' })
    listeDevisCommande: DevisCommande[];

    @OneToMany(() => Strategie, s => s.chantier, { cascade: true })
    @JoinTable({ name: 'strategies_chantier' })
    @ApiModelProperty()
    strategies: Strategie[];
    besoinClientLabo?: any;

    @OneToMany(type => Intervention, intervention => intervention.chantier)
    interventions: Intervention[];

    @Column({ nullable: true, default: null })
    @ApiModelProperty()
    idOrdreInterventionGlobal: number;

    @OneToOne(type => Fichier, { cascade: true })
    @JoinColumn({ name: 'idOrdreInterventionGlobal' })
    ordreInterventionGlobal: Fichier;

    @Column({ nullable: true, default: null })
    @ApiModelProperty()
    idOrdreInterventionGlobalSigne: number;

    @OneToOne(type => Fichier, { cascade: true })
    @JoinColumn({ name: 'idOrdreInterventionGlobalSigne' })
    ordreInterventionGlobalSigne: Fichier;

    @OneToMany(type => Prelevement, prelevement => prelevement.chantier)
    prelevements: Prelevement[];

    @Column()
    @ApiModelProperty()
    versionStrategie: number;

    @Column({ default: true })
    @ApiModelProperty()
    isCOFRAC: boolean; // Utilisé pour générer la stratégie

    @Column({ type: 'text' })
    @ApiModelProperty()
    justifNonCOFRAC: string; // Utilisé pour générer la stratégie

    @Column({ default: false })
    @ApiModelProperty()
    hasRDVPrealable: boolean; // Utilisé pour générer la stratégie

    @Column({ type: 'text' })
    @ApiModelProperty()
    txtRDVPrealable: string; // Utilisé pour générer la stratégie

    @Column({ type: 'text' })
    @ApiModelProperty()
    commentaire: string;
}
