import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class LocalisationPrelevement1565094677217 implements MigrationInterface {

    // ajout localisation car elle doit etre complétable par les tech sur chantier
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumns('prelevement', [
            new TableColumn({
                name: 'localisation',
                type: 'TEXT',
                isNullable: true
            })
        ]);

        // ajout commentaire pour tout ce qui n'est pas fiche ecart
        await queryRunner.addColumns('affectation_prelevement', [
            new TableColumn({
                name: 'commentaire',
                type: 'TEXT',
                isNullable: true
            })
        ]);

        // suppression pour utiuliser les notion avant pendant après
        await queryRunner.dropColumn('prelevement', 'temperature');
        await queryRunner.dropColumn('prelevement', 'pression');
        await queryRunner.dropColumn('prelevement', 'humidite');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
