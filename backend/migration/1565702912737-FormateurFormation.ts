import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class FormateurFormation1565702912737 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'formateur_formation',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name:'idFormateur',
                    type:'int',
                    isNullable:true,
                    isPrimary: true,
                },
                {
                    name:'idFormation',
                    type:'int',
                    isNullable:true,
                    isPrimary: true,
                }
            ]
        }));

        await queryRunner.createForeignKey('formateur_formation', new TableForeignKey({
            columnNames: ['idFormateur'],
            referencedColumnNames: ['id'],
            referencedTableName: 'ressource_humaine',
        }));

        await queryRunner.createForeignKey('formateur_formation', new TableForeignKey({
            columnNames: ['idFormation'],
            referencedColumnNames: ['id'],
            referencedTableName: 'formation',
            onDelete: 'CASCADE'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
