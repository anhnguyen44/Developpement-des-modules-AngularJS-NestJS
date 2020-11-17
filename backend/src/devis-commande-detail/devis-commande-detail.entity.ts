import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { IDevisCommandeDetail } from '@aleaac/shared';
import { Produit } from '../produit/produit.entity';
import { DevisCommande } from '../devis-commande/devis-commande.entity';
import { ApiModelProperty } from '@nestjs/swagger';
import { Bureau } from '../bureau/bureau.entity';

@Entity()
export class DevisCommandeDetail implements IDevisCommandeDetail {

    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column()
    @ApiModelProperty()
    description: string;

    @Column()
    @ApiModelProperty()
    idDevisCommande: number;

    @ManyToOne(type => DevisCommande, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idDevisCommande' })
    @ApiModelProperty()
    devisCommande: DevisCommande;

    @Column({ nullable: true })
    @ApiModelProperty()
    idProduit: number;

    @ManyToOne(type => Produit, {
        nullable: true
    })
    @JoinColumn({ name: 'idProduit' })
    @ApiModelProperty()
    produit: Produit | null;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    @ApiModelProperty()
    montantHT: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    @ApiModelProperty()
    montantRemise: number;

    @Column()
    @ApiModelProperty()
    quantite: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    @ApiModelProperty()
    totalHT: number;
}