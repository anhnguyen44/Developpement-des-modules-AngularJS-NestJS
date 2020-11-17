import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class ficheExpositionAjout1565598711945 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumns('fiche_exposition', [
            new TableColumn({
                name: 'autreEPI',
                type: 'varchar',
                isNullable: true
            })
        ]);

        await queryRunner.addColumns('fiche_exposition', [
            new TableColumn({
                name: 'autreRisqueNuisance',
                type: 'varchar',
                isNullable: true
            })
        ]);

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
