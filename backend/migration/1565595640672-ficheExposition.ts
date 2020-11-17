import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class ficheExposition1565595640672 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'fiche_exposition',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'idRessourceHumaine',
                    type: 'int',
                    isNullable: true,
                },
                {
                    name: 'idPrelevement',
                    type: 'int',
                    isNullable: true
                },
                {
                    name: 'date',
                    type: 'date'
                },
                {
                    name: 'duree',
                    type: 'int',
                    isNullable: true
                },
                {
                    name: 'idRisqueNuisance',
                    type: 'int',
                    isNullable: true
                },
                {
                    name: 'idEPI',
                    type: 'int',
                    isNullable: true
                }
            ]
        }));

        await queryRunner.createForeignKey('fiche_exposition', new TableForeignKey({
            columnNames: ['idPrelevement'],
            referencedColumnNames: ['id'],
            referencedTableName: 'prelevement'
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
