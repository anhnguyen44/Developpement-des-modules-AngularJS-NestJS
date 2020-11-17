import {
    Entity,
    ManyToOne,
    Column,
    JoinColumn,
    PrimaryGeneratedColumn,
    OneToMany, ManyToMany, JoinTable, OneToOne
} from 'typeorm';

import { ApiModelProperty } from '@nestjs/swagger';
import { IPrelevement } from '@aleaac/shared';
import { Processus } from '../processus/processus.entity';
import { Echantillonnage } from '../echantillonnage/echantillonnage.entity';
import { Intervention } from '../intervention/intervention.entity';
import {Chantier} from '../chantier/chantier.entity';
import {GES} from '../ges/ges.entity';
import {AffectationPrelevement} from '../affectationPrelevement/affectation-prelevement.entity';
import {Objectif} from '../objectif/objectif.entity';
import {SitePrelevement} from '../site-prelevement/site-prelevement.entity';
import {ProcessusZone} from '../processus-zone/processus-zone.entity';
import {ZoneIntervention} from '../zone-intervention/zone-intervention.entity';
import {CmdAnalyse} from '../cmd-analyse/cmd-analyse.entity';
import {CUtilisateur} from '../utilisateur/utilisateur.entity';
import {FicheExposition} from '../fiche-exposition/fiche-exposition.entity';


@Entity()
export class Prelevement implements IPrelevement {

    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column()
    @ApiModelProperty()
    idFranchise: number;

    @ManyToMany(type => Intervention, intervention => intervention.prelevements, {nullable: true})
    @JoinTable({ name: 'prelevement_intervention' })
    interventions: Intervention[];

    @Column({default: null, nullable: true})
    @ApiModelProperty()
    idChantier: number;

    @ManyToOne(type => Chantier, chantier => chantier.prelevements, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({name: 'idChantier'})
    chantier: Chantier;

    @Column()
    @ApiModelProperty()
    idTypePrelevement: number;

    @Column()
    @ApiModelProperty()
    reference: string;

    @ApiModelProperty()
    @ManyToOne(type => Processus, processus => processus.prelevements, { nullable: true })
    @JoinColumn({ name: 'idProcessus' })
    processus: Processus;

    @Column({default: null, nullable: true})
    @ApiModelProperty()
    idProcessus: number;

    @ApiModelProperty()
    @ManyToOne(type => ProcessusZone, processusZone => processusZone.prelevements, { onDelete: 'SET NULL'})
    @JoinColumn({ name: 'idProcessusZone' })
    processusZone: ProcessusZone;

    @Column({default: null, nullable: true})
    @ApiModelProperty()
    idProcessusZone: number;

    @ManyToOne(type => GES, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({name: 'idGes'})
    ges: GES;

    @Column({ nullable: true, default: null })
    @ApiModelProperty()
    idGes: number;

    @ApiModelProperty()
    @OneToMany(type => AffectationPrelevement, affectationPrelevement => affectationPrelevement.prelevement, {cascade: true})
    @JoinColumn({ name: 'idPrelevement' })
    affectationsPrelevement: AffectationPrelevement[];

    @Column({nullable: true, default: null})
    @ApiModelProperty()
    idStrategie: number;

    @ManyToOne(type => ZoneIntervention, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'idZIPrel' })
    zoneIntervention: ZoneIntervention;

    @Column({nullable: true})
    @ApiModelProperty()
    idZIPrel: number;

    @Column({nullable: true})
    @ApiModelProperty()
    idEchantillonnage: number;

    @ManyToOne(() => Echantillonnage, { onUpdate: 'CASCADE', onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'idEchantillonnage' })
    echantillonnage: Echantillonnage;

    @Column({nullable: true})
    idObjectif: number;

    @ManyToOne(() => Objectif, { nullable: true })
    @JoinColumn({ name: 'idObjectif' })
    objectif: Objectif;

    @ManyToOne(() => SitePrelevement, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'idSitePrelevement' })
    sitePrelevement: SitePrelevement;

    @Column({nullable: true})
    @ApiModelProperty()
    idSitePrelevement: number;

    @Column()
    @ApiModelProperty()
    conditions: string;

    @Column()
    @ApiModelProperty()
    isDelaiExpress: boolean;

    @Column({default: null, nullable: true})
    @ApiModelProperty()
    idFractionAnalyse: number;

    @Column({default: 3})
    @ApiModelProperty()
    idFractionStrategie: number;

    @Column({default: null, nullable: true})
    @ApiModelProperty()
    idTypeEcartSaVisee: number;

    @Column()
    @ApiModelProperty()
    isCofrac: boolean;

    @Column({default: null, nullable: true})
    @ApiModelProperty()
    nbOuverturesGrilleAnalyse: number;

    @Column({default: 80})
    @ApiModelProperty()
    nbOuverturesGrilleStrategie: number;

    @Column({default: null, nullable: true})
    @ApiModelProperty()
    saViseeAnalyse: number;

    @Column({default: null, nullable: true})
    @ApiModelProperty()
    saViseeStrategie: number;

    @Column({default: null, nullable: true})
    @ApiModelProperty()
    surfaceFiltration: number;

    @Column({default: null, nullable: true})
    @ApiModelProperty()
    surfaceMoyenneOuvertures: number;

    @Column({default: false})
    @ApiModelProperty()
    isCreeApresStrategie: boolean;

    @Column({default: 1})
    @ApiModelProperty()
    idStatutPrelevement: number;

    @Column({nullable: true, default: null})
    idCmdAnalyse: number;

    @ManyToOne(type => CmdAnalyse, cmdAnalyse => cmdAnalyse.prelevements)
    @JoinColumn({ name: 'idCmdAnalyse' })
    cmdAnalyse: CmdAnalyse;

    // METEO
    @Column()
    @ApiModelProperty()
    pluieAvant: number;

    @Column({nullable: true})
    @ApiModelProperty()
    vistesseVentAvant: number;

    @Column({nullable: true})
    @ApiModelProperty()
    directionVentAvant: string;

    @Column({nullable: true})
    @ApiModelProperty()
    temperatureAvant: number;

    @Column({nullable: true})
    @ApiModelProperty()
    humiditeAvant: number;

    @Column({nullable: true})
    @ApiModelProperty()
    pressionAvant: number;

    @Column()
    @ApiModelProperty()
    pluiePendant: number;

    @Column({nullable: true})
    @ApiModelProperty()
    vistesseVentPendant: number;

    @Column({nullable: true})
    @ApiModelProperty()
    directionVentPendant: string;

    @Column({nullable: true})
    @ApiModelProperty()
    temperaturePendant: number;

    @Column({nullable: true})
    @ApiModelProperty()
    humiditePendant: number;

    @Column({nullable: true})
    @ApiModelProperty()
    pressionPendant: number;

    @Column()
    @ApiModelProperty()
    pluieApres: number;

    @Column({nullable: true})
    @ApiModelProperty()
    vistesseVentApres: number;

    @Column({nullable: true})
    @ApiModelProperty()
    directionVentApres: string;

    @Column({nullable: true})
    @ApiModelProperty()
    temperatureApres: number;

    @Column({nullable: true})
    @ApiModelProperty()
    humiditeApres: number;

    @Column({nullable: true})
    @ApiModelProperty()
    pressionApres: number;

    @Column()
    @ApiModelProperty()
    isPrelevementMateriaux: boolean;

    @Column()
    @ApiModelProperty()
    isFicheExposition: boolean;

    @Column({nullable: true})
    @ApiModelProperty()
    idPrelevementMateriaux: number;

    /*@OneToOne(type => Prelevement, {nullable: true})
    @JoinColumn({ name: 'idPrelevementMateriaux'})
    prelevementMateriaux: Prelevement;*/

    @Column()
    @ApiModelProperty()
    localisation: string;

    @Column({nullable: true})
    @ApiModelProperty()
    conditionTemperatureAvant: number;

    @Column({nullable: true})
    @ApiModelProperty()
    conditionPressionAvant: number;

    @Column({nullable: true})
    @ApiModelProperty()
    conditionHumiditeAvant: number;

    @Column({nullable: true})
    @ApiModelProperty()
    conditionTemperaturePendant: number;

    @Column({nullable: true})
    @ApiModelProperty()
    conditionPressionPendant: number;

    @Column({nullable: true})
    @ApiModelProperty()
    conditionHumiditePendant: number;

    @Column({nullable: true})
    @ApiModelProperty()
    conditionTemperatureApres: number;

    @Column({nullable: true})
    @ApiModelProperty()
    conditionPressionApres: number;

    @Column({nullable: true})
    @ApiModelProperty()
    conditionHumiditeApres: number;

    @Column({nullable: true})
    @ApiModelProperty()
    idPointPrelevementMEST: number;

    @Column({nullable: true})
    @ApiModelProperty()
    referenceFlaconMEST: string;

    @OneToMany(type => FicheExposition, ficheExposition => ficheExposition.prelevement, {cascade: true})
    @ApiModelProperty()
    fichesExposition: FicheExposition[];

}
