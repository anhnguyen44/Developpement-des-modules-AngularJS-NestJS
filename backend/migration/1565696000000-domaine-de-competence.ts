import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class domaineDeCompetence1565696000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'domaine-competence',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'nom',
                    type: 'varchar',
                },
                {
                    name: 'description',
                    type: 'varchar',
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
