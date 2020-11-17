import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import {
    Body,
    Controller,
    Get,
    Param, Post, Put,
    UseInterceptors,
    Delete, Req, Patch
} from '@nestjs/common';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { TemplateVersionService } from './template-version.service';
import { TemplateVersion } from './template-version.entity';

@ApiUseTags('template-version')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'template-version'))
export class TemplateVersionController {
    constructor(private templateVersionService: TemplateVersionService) { }

    @Get('version/:idType/:idVersion')
    @Authorized()
    async findVersion(@Param() params, @Req() req): Promise<TemplateVersion> {
        const foundVersion = await this.templateVersionService.getVersion(params.idType, params.idVersion);
        return foundVersion;
    }

    @ApiOperation({ title: 'Recupération de toute les valeurs d\'une templateVersion' })
    @Get('getAll')
    @Authorized()
    async getAll() {
        return await this.templateVersionService.getAll();
    }

    @ApiOperation({ title: 'Count de toute les valeurs d\'une templateVersion' })
    @Get('countAll')
    @Authorized()
    async countAll() {
        return await this.templateVersionService.countAll();
    }

    @ApiOperation({ title: 'Get 1 valeur templateVersion en fonction de son id' })
    @Get(':idTemplateVersion')
    @Authorized()
    async get(@Param() params) {
        return await this.templateVersionService.get(params.idTemplateVersion);
    }

    @ApiOperation({ title: 'Création templateVersion' })
    @Post()
    @Authorized()
    async post(@Body() requestBody: TemplateVersion) {
        return await this.templateVersionService.create(requestBody);
    }

    @ApiOperation({ title: 'Update templateVersion' })
    @Put()
    @Authorized()
    async update(@Body() requestBody: TemplateVersion) {
        return await this.templateVersionService.update(requestBody);
    }

    @ApiOperation({ title: 'Update templateVersion' })
    @Patch(':id')
    @Authorized()
    async updatePartial(@Body() requestBody: TemplateVersion) {
        return await this.templateVersionService.update(requestBody);
    }
}
