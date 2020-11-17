import {
    Body, Controller, Delete, ForbiddenException, Get, InternalServerErrorException, NotFoundException,
    Param, ParseIntPipe, Patch, Post, Put, Query, Req, UseInterceptors
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { FindManyOptions } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { apiPath } from '../api';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { Mail } from './mail.entity';
import { MailService } from './mail.service';
import {HistoriqueService} from '../historique/historique.service';
import {GenerationService} from '../generation/generation.service';


@ApiUseTags('Mails')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'mail'))
export class MailController {

    constructor(
        private readonly mailService: MailService,
        private historiqueService: HistoriqueService,
        private generationService: GenerationService
    ) { }

    @ApiOperation({ title: 'Envoie un mail' })
    @ApiResponse({
        status: 200,
        description: 'Mail envoyé.',
        type: Mail
    })
    @ApiResponse({ status: 400, description: 'Une erreur est survenue.' })
    @Post('send')
    async create(@Body() requestBody: Mail, @Req() req) {
        try {
            if (requestBody.attachments.length > 0) {
                for (const attachment of requestBody.attachments) {
                    if (attachment.filename.split('.').pop() === 'docx') {
                        const newFichier = await this.generationService.docxToPdf(attachment.path);
                        if (newFichier) {
                            attachment.filename = newFichier.nom + '.' + newFichier.extention;
                            attachment.path = './uploads/' + newFichier.keyDL;
                        }
                    }
                }
            }

            await this.mailService.sendMail(requestBody);
            if (requestBody.application && requestBody.idParent) {
                this.historiqueService.add(req.user.id, requestBody.application, requestBody.idParent, 'Email envoyé à : ' + requestBody.to)
            }
            return 'Email envoyé.'
        } catch (err) {
            if (err.message === 'Une erreur est survenue.') {
                throw new ForbiddenException(err.message);
            } else {
                throw new InternalServerErrorException(err.message);
            }
        }
    }
}