import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { FormationContact, Formation, IFormationContact } from '@aleaac/shared';
import { CFormation } from '../formation/formation.entity';
import { Contact } from '../contact/contact.entity';
import { Compte } from '../compte/compte.entity';
import { Fichier } from '../fichier/fichier.entity';
import { CNoteCompetenceStagiaire } from '../note-competence-stagiaire/note-competence-stagiaire.entity';

@Entity({name: 'formation_contact'})
export class CFormationContact implements IFormationContact{

    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    
    @Column({nullable: true})
    @ApiModelProperty()
    idFormation: number;

    @ApiModelProperty()
    @ManyToOne(type => CFormation, formation => formation.stagiaire, { primary: true, onDelete: 'CASCADE' })
    @JoinColumn({name: 'idFormation'})
    formation: CFormation;

    @Column({nullable: true})
    @ApiModelProperty()
    idContact: number;

    @ApiModelProperty()
    @ManyToOne(type => Contact, { primary: true, eager: true })
    @JoinColumn({name: 'idContact'})
    contact: Contact;
    
    
    @Column({nullable: true})
    @ApiModelProperty()
    idEntrepriseCompte: number;

    @ApiModelProperty()
    @ManyToOne(type => Compte, { nullable: true })
    @JoinColumn({ name: 'idEntrepriseCompte' })
    sousTraitance: Compte;

    @Column({nullable: true})
    @ApiModelProperty()
    idDossierComplet: number;
    
    @ApiModelProperty()
    @ManyToOne(type => Fichier, { nullable: true })
    @JoinColumn({ name: 'idDossierComplet' })
    dossierComplet: Fichier;

    @ApiModelProperty()
    @Column()
    rattrapage: number;
    
    @ApiModelProperty()
    @Column()
    absenceTotal: boolean;

    @ApiModelProperty()
    @Column({ nullable: true })
    absencePartielle: number;

    @ApiModelProperty()
    @Column()
    formationValide: boolean;

    @ApiModelProperty()
    @Column({ nullable: true })
    numCertificat: number;

    @ApiModelProperty()
    @Column({ nullable: true })
    numForprev: number;

    @ApiModelProperty()
    @Column({ nullable: true })
    phraseForprev: string;

    @ApiModelProperty()
    @Column({ nullable: true })
    noteObtenu: number;

    @ApiModelProperty()
    @Column( { nullable: true })
    delivrerLe: Date;

    @ApiModelProperty()
    @Column( { nullable: true })
    dateEnvoiDossier: Date;

   


    @OneToMany(type => CNoteCompetenceStagiaire, cNoteCompetenceStagiaire => cNoteCompetenceStagiaire.stagiaire, { eager: true })
    noteCompetence: CNoteCompetenceStagiaire[];

    @Column({ nullable: true })
    idDevis: number;
}