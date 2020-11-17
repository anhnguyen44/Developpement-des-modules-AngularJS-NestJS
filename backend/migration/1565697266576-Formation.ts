import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class Formation1565697266576 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'formation',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name:'nbrJour',
                    type:'int'
                },
                {
                    name:'dateDebut',
                    type:'datetime',
                    isNullable: true,
                },
                {
                    name:'dateFin',
                    type:'datetime',
                    isNullable: true,
                },
                {
                    name:'commentaire',
                    type:'text'
                },
                {
                    name:'idStatutFormation',
                    type:'int'
                },
                {
                    name:'phrCertificat',
                    type:'varchar'
                },
                {
                    name:'heureDebutForma',
                    type:'varchar'
                },
                {
                    name:'heureFinForma',
                    type:'varchar'
                },
                {
                    name:'idFranchise',
                    type:'int',
                    isNullable: true
                },
                {
                    name:'idSalle',
                    type:'int',
                    isNullable: true
                },
                {
                    name:'idBureau',
                    type:'int',
                    isNullable: true
                },
                {
                    name:'idTypeFormation',
                    type:'int',
                    isNullable: true
                },
            ]
        }));
        await queryRunner.createForeignKey('formation', new TableForeignKey({
            columnNames: ['idSalle'],
            referencedColumnNames: ['id'],
            referencedTableName: 'salle',
        }));

        await queryRunner.createForeignKey('formation', new TableForeignKey({
            columnNames: ['idTypeFormation'],
            referencedColumnNames: ['id'],
            referencedTableName: 'type_formation',
        }))

        await queryRunner.createForeignKey('formation', new TableForeignKey({
            columnNames: ['idFranchise'],
            referencedColumnNames: ['id'],
            referencedTableName: 'franchise',
        }));

        await queryRunner.createForeignKey('formation', new TableForeignKey({
            columnNames: ['idBureau'],
            referencedColumnNames: ['id'],
            referencedTableName: 'bureau',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
