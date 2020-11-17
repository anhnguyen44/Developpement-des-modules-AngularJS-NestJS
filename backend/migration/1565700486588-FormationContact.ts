import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class FormationContact1565700486588 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'formation_contact',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name:'rattrapage',
                    type:'int',
                },
                {
                    name:'absencePartielle',
                    type:'int',
                    isNullable: true,
                },
                {
                    name:'absenceTotal',
                    type:'tinyint',
                },
                {
                    name:'formationValide',
                    type:'tinyint',
                },
                {
                    name:'numCertificat',
                    type:'int',
                    isNullable:true
                },
                {
                    name:'numForprev',
                    type:'int',
                    isNullable:true
                },
                {
                    name:'phraseForprev',
                    type:'varchar',
                    isNullable:true
                },
                {
                    name:'noteObtenu',
                    type:'int',
                    isNullable:true
                },
                {
                    name:'delivrerLe',
                    type:'datetime',
                    isNullable:true
                },
                {
                    name:'isDevis',
                    type:'int',
                    isNullable:true
                },
                {
                    name:'idFormation',
                    type:'int',
                    isNullable:true,
                    isPrimary: true,
                },
                {
                    name:'idContact',
                    type:'int',
                    isNullable:true,
                    isPrimary: true,
                }
                ,
                {
                    name:'idEntrepriseCompte',
                    type:'int',
                    isNullable:true,
                }
                ,
                {
                    name:'idDossierComplet',
                    type:'int',
                    isNullable:true,
                }

            ]
        }));

        await queryRunner.createForeignKey('formation_contact', new TableForeignKey({
            columnNames: ['idFormation'],
            referencedColumnNames: ['id'],
            referencedTableName: 'formation',
            onDelete: 'CASCADE'
        }));

        await queryRunner.createForeignKey('formation_contact', new TableForeignKey({
            columnNames: ['idContact'],
            referencedColumnNames: ['id'],
            referencedTableName: 'contact',
        }));
        await queryRunner.createForeignKey('formation_contact', new TableForeignKey({
            columnNames: ['idEntrepriseCompte'],
            referencedColumnNames: ['id'],
            referencedTableName: 'compte',
        }));
        await queryRunner.createForeignKey('formation_contact', new TableForeignKey({
            columnNames: ['idDossierComplet'],
            referencedColumnNames: ['id'],
            referencedTableName: 'fichier',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
