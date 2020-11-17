import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get, InternalServerErrorException,
  Param,
  Patch,
  Post,
  Put,
  Req, Res,
  UnauthorizedException,
  UseInterceptors,
  NotFoundException,
  ParseIntPipe
} from '@nestjs/common';
import { ApiOperation, ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { Rights } from '../common/decorators/rights.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { GenerationService } from '../generation/generation.service';
import { HistoriqueService } from '../historique/historique.service';
import { CurrentUtilisateur } from '../utilisateur/utilisateur.decorator';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { FormationService } from './formation.service';
import { CFormation } from './formation.entity';
import { DeepPartial } from 'typeorm';
import { FormationContactService } from '../formation-contact/formation-contact.service';
import { CFormationContact } from '../formation-contact/formation-contact.entity';
import { FormationContact, INoteCompetenceStagiaire } from '@aleaac/shared';
import { format } from 'date-fns';
import * as dateFns from 'date-fns';
import { ContactController } from '../contact/contact.controller';
import { NoteCompetenceStagiaireService } from '../note-competence-stagiaire/note-competence-stagiaire.service';
import { stringify } from 'querystring';
import { CompteContact } from '../../../frontend/src/app/contact/CompteContact';
import { request } from 'https';

@ApiUseTags('formation')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'formation'))

export class FormationController {
  note: INoteCompetenceStagiaire[];

  constructor(
    private formationService: FormationService,
    private generationService: GenerationService,
    // private utilisateurService: UtilisateurService,
    private historiqueService: HistoriqueService,
    private formationContactService: FormationContactService,
    private noteCompetenceStagiaireService: NoteCompetenceStagiaireService,
  ) { }


  @ApiOperation({ title: 'Nouveau session formation' })
  @ApiResponse({
    status: 200,
    description: 'Retourne la nouvelle session formation',
    type: CFormation
  })
  @ApiResponse({ status: 400, description: 'Le menu existe déjà.' })
  @Post()
  @Authorized()
  async create(@Body() requestBody: CFormation, @Req() request) {
    try {
      const formation = await this.formationService.create(requestBody);
      await this.historiqueService.add(request.user.id, 'formation', formation.id, 'Création du formation');
      return formation;
    } catch (err) {
      if (err.message === 'La session de formation existe déjà.') {
        throw new ForbiddenException(err.message);
      } else {
        throw new InternalServerErrorException(err.message);
      }
    }
  }

  @Post('generateCoche/:text/:idSession')
  @Authorized()
  async generateDocumentCoche(@Body() requestBody: any, @Req() req, @Param() params) {
    const forma = await this.formationService.getById(params.idSession);
    let periode: any[] = [];
    let periodeFeuilleEmargementTempo: any[] = [];




    console.log(forma.dateDebut);
    console.log(forma.dateFin);
    console.log(forma.nbrJour);



    let dateTemp = new Date(forma.dateDebut);
    let dateDebutTemp = new Date(forma.dateDebut);
    let dateFinTemp = new Date(forma.dateDebut);

    let listDay = new Array("Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi");

    for (let i = 1; i <= forma.nbrJour; i++) {
      if (listDay[dateTemp.getDay() + 1] == 'Samedi') {
        dateFinTemp = new Date(dateTemp);
        dateFinTemp.setDate(dateTemp.getDate());
        if (i != forma.nbrJour) {
          periode.push({
            "dateDebut": dateFns.format(dateDebutTemp, 'DD/MM/YYYY'),
            "dateFin": dateFns.format(dateFinTemp, 'DD/MM/YYYY')
          });

          periodeFeuilleEmargementTempo.push({
            "dateDebut": dateDebutTemp,
            "dateFin": dateFinTemp
          });
        }


        dateTemp.setDate(dateTemp.getDate() + 3);

        dateDebutTemp = new Date(dateTemp);
        dateDebutTemp.setDate(dateTemp.getDate());

        dateFinTemp = new Date(dateTemp);
        dateFinTemp.setDate(dateTemp.getDate());

        if (i == forma.nbrJour - 1) {
          periode.push({
            "dateDebut": dateFns.format(dateDebutTemp, 'DD/MM/YYYY'),
            "dateFin": dateFns.format(dateFinTemp, 'DD/MM/YYYY')
          });
          periodeFeuilleEmargementTempo.push({
            "dateDebut": dateDebutTemp,
            "dateFin": dateFinTemp
          });
        }
      } else {
        dateTemp.setDate(dateTemp.getDate() + 1);
        dateFinTemp = new Date(dateTemp);
        dateFinTemp.setDate(dateTemp.getDate());
        if (i == forma.nbrJour - 1) {
          periode.push({
            "dateDebut": dateFns.format(dateDebutTemp, 'DD/MM/YYYY'),
            "dateFin": dateFns.format(dateFinTemp, 'DD/MM/YYYY')
          });
          periodeFeuilleEmargementTempo.push({
            "dateDebut": dateDebutTemp,
            "dateFin": dateFinTemp
          });
        }
      }

    }
    console.log(periode);
    console.log(periodeFeuilleEmargementTempo);

    let periodeFeuilleEmargement: any[] = [];

    periodeFeuilleEmargementTempo.forEach(e => {
      if (e.dateFin.getDate() - e.dateDebut.getDate() == 0) {
        if (e.dateDebut.getDay() == 1) {
          periodeFeuilleEmargement.push({ 'lundi': dateFns.format(e.dateDebut, 'DD/MM/YYYY'), 'mardi': '', 'mercredi': '', 'jeudi': '', 'vendredi': '' });
        } else if (e.dateDebut.getDay() == 2) {
          periodeFeuilleEmargement.push({ 'lundi': '', 'mardi': dateFns.format(e.dateDebut, 'DD/MM/YYYY'), 'mercredi': '', 'jeudi': '', 'vendredi': '' });
        } else if (e.dateDebut.getDay() == 3) {
          periodeFeuilleEmargement.push({ 'lundi': '', 'mardi': '', 'mercredi': dateFns.format(e.dateDebut, 'DD/MM/YYYY'), 'jeudi': '', 'vendredi': '' });
        } else if (e.dateDebut.getDay() == 4) {
          periodeFeuilleEmargement.push({ 'lundi': '', 'mardi': '', 'mercredi': '', 'jeudi': dateFns.format(e.dateDebut, 'DD/MM/YYYY'), 'vendredi': '' });
        } else if (e.dateDebut.getDay() == 5) {
          periodeFeuilleEmargement.push({ 'lundi': '', 'mardi': '', 'mercredi': '', 'jeudi': '', 'vendredi': dateFns.format(e.dateDebut, 'DD/MM/YYYY') });
        }
      }
      if (e.dateFin.getDate() - e.dateDebut.getDate() == 1) {
        if (e.dateDebut.getDay() == 1) {
          periodeFeuilleEmargement.push({ 'lundi': dateFns.format(e.dateDebut, 'DD/MM/YYYY'), 'mardi': dateFns.format(e.dateFin, 'DD/MM/YYYY'), 'mercredi': '', 'jeudi': '', 'vendredi': '' });
        } else if (e.dateDebut.getDay() == 2) {
          periodeFeuilleEmargement.push({ 'lundi': '', 'mardi': dateFns.format(e.dateDebut, 'DD/MM/YYYY'), 'mercredi': dateFns.format(e.dateFin, 'DD/MM/YYYY'), 'jeudi': '', 'vendredi': '' });
        } else if (e.dateDebut.getDay() == 3) {
          periodeFeuilleEmargement.push({ 'lundi': '', 'mardi': '', 'mercredi': dateFns.format(e.dateDebut, 'DD/MM/YYYY'), 'jeudi': dateFns.format(e.dateFin, 'DD/MM/YYYY'), 'vendredi': '' });
        } else if (e.dateDebut.getDay() == 4) {
          periodeFeuilleEmargement.push({ 'lundi': '', 'mardi': '', 'mercredi': '', 'jeudi': dateFns.format(e.dateDebut, 'DD/MM/YYYY'), 'vendredi': dateFns.format(e.dateFin, 'DD/MM/YYYY') });
        }
      }
      if (e.dateFin.getDate() - e.dateDebut.getDate() == 2) {
        if (e.dateDebut.getDay() == 1) {
          periodeFeuilleEmargement.push({ 'lundi': dateFns.format(e.dateDebut, 'DD/MM/YYYY'), 'mardi': dateFns.format(e.dateDebut.setDate(e.dateDebut.getDate() + 1), 'DD/MM/YYYY'), 'mercredi': dateFns.format(e.dateFin, 'DD/MM/YYYY'), 'jeudi': '', 'vendredi': '' });
        } else if (e.dateDebut.getDay() == 2) {
          periodeFeuilleEmargement.push({ 'lundi': '', 'mardi': dateFns.format(e.dateDebut, 'DD/MM/YYYY'), 'mercredi': dateFns.format(e.dateDebut.setDate(e.dateDebut.getDate() + 1), 'DD/MM/YYYY'), 'jeudi': dateFns.format(e.dateFin, 'DD/MM/YYYY'), 'vendredi': '' });
        } else if (e.dateDebut.getDay() == 3) {
          periodeFeuilleEmargement.push({ 'lundi': '', 'mardi': '', 'mercredi': dateFns.format(e.dateDebut, 'DD/MM/YYYY'), 'jeudi': dateFns.format(e.dateDebut.setDate(e.dateDebut.getDate() + 1), 'DD/MM/YYYY'), 'vendredi': dateFns.format(e.dateFin, 'DD/MM/YYYY') });
        }
      }
      if (e.dateFin.getDate() - e.dateDebut.getDate() == 3) {
        if (e.dateDebut.getDay() == 1) {
          periodeFeuilleEmargement.push({ 'lundi': dateFns.format(e.dateDebut, 'DD/MM/YYYY'), 'mardi': dateFns.format(e.dateDebut.setDate(e.dateDebut.getDate() + 1), 'DD/MM/YYYY'), 'mercredi': dateFns.format(e.dateDebut.setDate(e.dateDebut.getDate() + 1), 'DD/MM/YYYY'), 'jeudi': dateFns.format(e.dateFin, 'DD/MM/YYYY'), 'vendredi': '' });
        } else if (e.dateDebut.getDay() == 2) {
          periodeFeuilleEmargement.push({ 'lundi': '', 'mardi': dateFns.format(e.dateDebut, 'DD/MM/YYYY'), 'mercredi': dateFns.format(e.dateDebut.setDate(e.dateDebut.getDate() + 1), 'DD/MM/YYYY'), 'jeudi': dateFns.format(e.dateDebut.setDate(e.dateDebut.getDate() + 1), 'DD/MM/YYYY'), 'vendredi': dateFns.format(e.dateFin, 'DD/MM/YYYY') });
        }
      }
      if (e.dateFin.getDate() - e.dateDebut.getDate() == 4) {
        periodeFeuilleEmargement.push({ 'lundi': dateFns.format(e.dateDebut, 'DD/MM/YYYY'), 'mardi': dateFns.format(e.dateDebut.setDate(e.dateDebut.getDate() + 1), 'DD/MM/YYYY'), 'mercredi': dateFns.format(e.dateDebut.setDate(e.dateDebut.getDate() + 1), 'DD/MM/YYYY'), 'jeudi': dateFns.format(e.dateDebut.setDate(e.dateDebut.getDate() + 1), 'DD/MM/YYYY'), 'vendredi': dateFns.format(e.dateFin, 'DD/MM/YYYY') });
      }
    });

    console.log(periodeFeuilleEmargement);

    console.log('====&');
    console.log(requestBody);
    // const forma =null;
    requestBody.forEach(async sta => {
      let compteContactsDevis = [];
      let compteContactsPrici = [];
      sta.contactDevis = null;

      sta.contact.anniversaire = dateFns.format(sta.contact.anniversaire, 'DD/MM/YYYY');
      sta.formation.dateDebut = dateFns.format(sta.formation.dateDebut, 'DD/MM/YYYY');
      sta.formation.dateFin = dateFns.format(sta.formation.dateFin, 'DD/MM/YYYY');
      sta.delivrerLe = dateFns.format(sta.delivrerLe, 'DD/MM/YYYY');
      console.log(sta.id);
      console.log(sta.noteCompetence);

      let listNotePratiqueMoins60 = sta.noteCompetence.filter(e => e.note < 60 && e.competence.typePratique == true);
      let listNoteTheoriqueMoins60 = sta.noteCompetence.filter(e => e.note < 60 && e.competence.typePratique == false);


      if (sta.sousTraitance) {
        if (sta.sousTraitance.compteContacts) {
          compteContactsDevis = sta.sousTraitance.compteContacts.filter(e => e.bDevis == true);
          compteContactsPrici = sta.sousTraitance.compteContacts.filter(e => e.bPrincipale == true);
        }
      }



      console.log('hi fi');
      console.log(compteContactsDevis);
      console.log(compteContactsPrici);

      if (compteContactsDevis.length || compteContactsPrici.length) {
        if (compteContactsPrici.length) {
          sta.contactDevis = compteContactsPrici[0].contact;
        }

        if (compteContactsDevis.length) {
          sta.contactDevis = compteContactsDevis[0].contact;
        }
      }

      if (!sta.contactDevis) {
        sta.contactDevis = null;
      }

      console.log(sta.contactDevis);
      // const listNotePratiqueMoins60 = await this.noteCompetenceStagiaireService.getAllPratiqueMoins60ByIdStagiaire(sta.id);
      // const listNoteTheoriqueMoins60 = await this.noteCompetenceStagiaireService.getAllTheoriqueMoins60ByIdStagiaire(sta.id);
      // console.log(listNotePratiqueMoins60);
      // console.log(listNoteTheoriqueMoins60);
      if (!listNotePratiqueMoins60.length) {
        sta.pratiqueFavorable = true;
        if (sta.pratiqueFavorable == true && sta.theoriqueFavorable == true) {
          sta.favorable = true;
        }
      }
      if (!listNoteTheoriqueMoins60.length) {
        sta.theoriqueFavorable = true;
        if (sta.pratiqueFavorable == true && sta.theoriqueFavorable == true) {
          sta.favorable = true;
        }
      }

      if (sta.pratiqueFavorable == true && sta.theoriqueFavorable == true) {
        sta.favorable = true;
      }
      // console.log(sta);
    });


    let dateFinValidite;
    if (forma.dateFin) {
      dateFinValidite = new Date(forma.dateFin);
      dateFinValidite.setMonth(forma.dateFin.getMonth() + forma.typeFormation.dureeValidite);
    }

    // todo voir quand on fera les devis intra entreprise
    // il faut pouvoir créer un produit pour une formation pour un maximun de 10 candidats
    // ce produit ne sera facturé qu'une fois (dire de laure LAVERSIN)
    let interIntra = 'inter entreprise';
    let contactEntreprise;


    if (requestBody.length) {
      for (let e of requestBody) {
        if(e){
          if (e!.contactDevis) {
            contactEntreprise = e.contactDevis;
            break;
          }
        }
        
      }
    }



    console.log('===========');
    console.log(contactEntreprise);


    if (params.text == 'conventionEntreprise') {
      let typeEntreprise;
      console.log(requestBody);

      let dataConventionParti: any = {
        'forma': forma,
        'periodeForma': periode,
        'preContact': requestBody[0]?requestBody[0].contact.prenom:'',
        'nomContact': requestBody[0]?requestBody[0].contact.nom:'',
        'interIntra': interIntra,
        'dateDebutForma': dateFns.format(forma.dateDebut, 'DD/MM/YYYY'),
        'dateFinForma': dateFns.format(forma.dateFin, 'DD/MM/YYYY'),
      }


      if(requestBody[0]){
        if (!requestBody[0].sousTraitance) {


          dataConventionParti['societe'] = 'Particulier';
          dataConventionParti['sta'] = requestBody;
  
          console.log('_________________');
          console.log(dataConventionParti);
          console.log(requestBody[0].contact.anniversaire);
          console.log('______________');
  
        } else {
          dataConventionParti['societe'] = requestBody[0].sousTraitance.raisonSociale;
          dataConventionParti['sta'] = requestBody;
        }
  
      }

      return this.generationService.generateDocx(dataConventionParti, params.text + '.docx', 'formation', 1, req.user.id, params.text + '-' + dataConventionParti['societe'] + '-' + dataConventionParti['nomContact'], req.user);
    }

    const data: any = {
      'sta': requestBody,
      'forma': forma,
      'inter_intra': interIntra,
      'dateDebutForma': dateFns.format(forma.dateDebut, 'DD/MM/YYYY'),
      'dateFinForma': dateFns.format(forma.dateFin, 'DD/MM/YYYY'),
      'periodeForma': periode,
      'dateFinValidite': dateFns.format(dateFinValidite, 'DD/MM/YYYY'),
      'periodeFeuilleEmargement': periodeFeuilleEmargement,
      'dateGenererDocument': dateFns.format(new Date(), 'DD/MM/YYYY'),
      'contactEntreprise': contactEntreprise
    }

    console.log(data);
    console.log(data.contactEntreprise);

    return this.generationService.generateDocx(data, params.text + '.docx', 'formation', 1, req.user.id, params.text, req.user);
  }

  @ApiOperation({ title: 'MàJ formation' })
  @Patch(':id')
  @Authorized()
  async partialUpdate(
    @Param('id', new ParseIntPipe())
    id: number,
    @Body() partialEntry: DeepPartial<CFormation>,
  ) {
    const prd = this.formationService.update(id, partialEntry);
    return prd;
  }


  @Get()
  @Authorized()
  async getAll(@Req() req): Promise<CFormation[]> {
    try {
      //console.log('TEST 1');
      //console.log(req.query);
      return this.formationService.getAll(req.query);
    } catch (e) {
      console.error(e);
    }
  }





  @ApiOperation({ title: 'generation document de formation demo' })
  @Get('generate/:text/:idSession')
  @Authorized()
  async generate(@Param() params, @Req() req) {
    const listStagiaire = await this.formationContactService.getAllByIdFormation(req.query, params.idSession);
    // console.log(listStagiaire);

    const dataChevalet: any = { "os": [] };
    listStagiaire.forEach(e => {
      dataChevalet.os.push({
        "formation": e.formation.typeFormation.nomFormation,
        "genre": e.contact.civilite ? e.contact.civilite.nom : 'Madame/Monsieur',
        "nom": e.contact.nom,
        "prenom": e.contact.prenom,
        "societe": e.sousTraitance.raisonSociale
      });
    });


    const data: any = {
      "os": [
        {
          "formation": "forma 1",
          "genre": "Monsieur",
          "nom": "NGUYEN",
          "prenom": "Anh Nguyen",
          "societe": "Diagamter"
        },
        {
          "formation": "forma 1",
          "genre": "Monsieur",
          "nom": "NGUYEN",
          "prenom": "Anh Nguyen",
          "societe": "Diagamter"
        },
        {
          "formation": "forma 1",
          "genre": "Monsieur",
          "nom": "NGUYEN",
          "prenom": "Anh Nguyen",
          "societe": "Diagamter"
        },
        {
          "formation": "forma 1",
          "genre": "Monsieur",
          "nom": "NGUYEN",
          "prenom": "Anh Nguyen",
          "societe": "Diagamter"
        },
        {
          "formation": "forma 1",
          "genre": "Monsieur",
          "nom": "NGUYEN",
          "prenom": "Anh Nguyen",
          "societe": "Diagamter"
        },
        {
          "formation": "forma 1",
          "genre": "Monsieur",
          "nom": "NGUYEN",
          "prenom": "Anh Nguyen",
          "societe": "Diagamter"
        },
        {
          "formation": "forma 1",
          "genre": "Monsieur",
          "nom": "NGUYEN",
          "prenom": "Anh Nguyen",
          "societe": "Diagamter"
        }
      ]
    };
    if (params.text == 'chevalet') {
      return this.generationService.generateDocx(dataChevalet, 'chevalet.docx', 'formation', 1, req.user.id, 'demo generate docx formation', req.user);
    }

    // return this.generationService.generateDocx(data,'vertical-table.docx','formation',1, req.user.id,'demo generate docx formation',req.user);
    return this.generationService.generateDocx(dataChevalet, 'w-modele.docx', 'formation', 1, req.user.id, 'demo generate docx formation', req.user);
  }

  @Get('typeFormaNull/:id')
  @Authorized()
  async getTypeFormationNull(@Body() requestBody: any, @Req() req, @Param() params) {
    const forma = await this.formationService.getTypeFormationNull(params.id);

    if (forma.id) {
      forma.typeFormation = null;
    }

    delete forma['idBureau'];
    delete forma['idSalle'];
    delete forma['idTypeFormation'];

    return this.formationService.update(forma.id, forma);

  }

  @Get('getAllByIdFranchise/:id')
  @Authorized()
  async getAllByIdFranchise(@Body() requestBody: any, @Req() req, @Param() params) {
    return this.formationService.getAllByIdFranchise(params.id, req.query);
  }

  @Get(':id')
  @Authorized()
  async getById(@Param('id') id): Promise<CFormation> {
    const foundCate = await this.formationService.getById(parseInt(id, 10));


    if (!foundCate) {
      throw new NotFoundException(`Contenu '${id}' introuvable`);
    }
    return foundCate;
  }

  @ApiOperation({ title: 'Suppression formation' })
  @Delete(':id')
  @Authorized()
  async  delete(@Param() params) {
    return await this.formationService.delete(params.id)
  }




}