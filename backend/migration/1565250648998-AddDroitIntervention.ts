import {MigrationInterface, QueryRunner} from "typeorm";

export class AddDroitIntervention1565250648998 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into('droit')
            .values([
                // pour les stratége
                {
                    id: '60',
                    nom: 'Créer des interventions',
                    code: 'INTER_CREATE',
                    niveau: '9999'
                },
                // pour les technicien
                {
                    id: '61',
                    nom: 'Update des interventions',
                    code: 'INTER_UPDATE',
                    niveau: '9999'
                },
                {
                    id: '62',
                    nom: 'Voir des interventions',
                    code: 'INTER_SEE',
                    niveau: '9999'
                }])
            .execute();

        queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into('profil_droit')
            .values([
                {
                    idProfil: '8',
                    idDroit: '60',
                },
                {
                    idProfil: '8',
                    idDroit: '61',
                },
                {
                    idProfil: '8',
                    idDroit: '62',
                },
                {
                    idProfil: '9',
                    idDroit: '60',
                },
                {
                    idProfil: '9',
                    idDroit: '61',
                },
                {
                    idProfil: '9',
                    idDroit: '62',
                },
                {
                    idProfil: '10',
                    idDroit: '60',
                },
                {
                    idProfil: '10',
                    idDroit: '61',
                },
                {
                    idProfil: '10',
                    idDroit: '62',
                },
                {
                    idProfil: '11',
                    idDroit: '60',
                },
                {
                    idProfil: '11',
                    idDroit: '61',
                },
                {
                    idProfil: '11',
                    idDroit: '62',
                },
                {
                    idProfil: '4',
                    idDroit: '61',
                },
                {
                    idProfil: '4',
                    idDroit: '62',
                }
                ])
            .execute()
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
