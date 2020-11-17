import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from "typeorm";

export class DebitMetre1564566673330 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'debitmetre',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'ref',
                    type: 'text',
                },
                {
                    name: 'libelle',
                    type: 'text',
                },
                {
                    name: 'idFranchise',
                    type: 'int'
                },
                {
                    name: 'idBureau',
                    type: 'int'
                }
            ]
        }));

        await queryRunner.addColumn('affectation_prelevement', new TableColumn({
            name: 'idDebitmetre',
            type: 'int',
            isNullable: true,
            default: null
        }));

        await queryRunner.createForeignKey('affectation_prelevement', new TableForeignKey({
            columnNames: ['idDebitmetre'],
            referencedColumnNames: ['id'],
            referencedTableName: 'debitmetre',
            onDelete: 'CASCADE'
        }))

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
