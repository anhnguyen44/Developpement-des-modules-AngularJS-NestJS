import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class addDateEnvoiDossierFormationContact1565944982742 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumns('formation_contact', [
            new TableColumn({
                name: 'dateEnvoiDossier',
                type: 'datetime',
                isNullable: true
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
