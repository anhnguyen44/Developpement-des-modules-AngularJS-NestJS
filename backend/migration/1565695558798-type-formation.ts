import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from "typeorm";

export class typeFormation1565695558798 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'type_formation',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'nomFormation',
                    type: 'varchar',
                },
                {
                    name: 'cateFormation',
                    type: 'varchar',
                },
                {
                    name: 'phrFormation',
                    type: 'varchar'
                },
                {
                    name: 'foncCible',
                    type: 'varchar'
                },
                {
                    name: 'idProduit',
                    type: 'int'
                },
                {
                    name: 'phrDiplome',
                    type: 'varchar'
                },
                {
                    name: 'dureeEnJour',
                    type: 'int'
                },
                {
                    name: 'dureeEnHeure',
                    type: 'int'
                },
                {
                    name: 'dureeValidite',
                    type: 'int'
                },
                {
                    name: 'delaiAmerte',
                    type: 'int'
                },
                {
                    name: 'interne',
                    type: 'tinyint'
                },
                {
                    name: 'referentielUtilise',
                    type: 'varchar'
                },
                {
                    name: 'typeEvaluationPratique',
                    type: 'varchar'
                },
                {
                    name: 'typeEvaluationTheorique',
                    type: 'varchar'
                },
            ]
        }));
        await queryRunner.createForeignKey('type_formation', new TableForeignKey({
            columnNames: ['idProduit'],
            referencedColumnNames: ['id'],
            referencedTableName: 'produit',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
