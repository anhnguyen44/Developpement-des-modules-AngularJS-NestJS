import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class rhFormationValide1565698914581 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'rh_formation_valide',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'idRh',
                    type: 'int'
                },
                {
                    name: 'idTypeFormation',
                    type: 'int',
                    isNullable: true
                },
                {
                    name: 'dateObtenu',
                    type: 'datetime',
                    isNullable: true,
                },
                {
                    name: 'habilite',
                    type: 'tinyint',
                    isNullable: true,
                }
            ]
        }));

        await queryRunner.createForeignKey('rh_formation_valide', new TableForeignKey({
            columnNames: ['idTypeFormation'],
            referencedColumnNames: ['id'],
            referencedTableName: 'type_formation'
        }));


        await queryRunner.createForeignKey('rh_formation_valide', new TableForeignKey({
            columnNames: ['idRh'],
            referencedColumnNames: ['id'],
            referencedTableName: 'ressource_humaine',
            onDelete: 'CASCADE'
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
