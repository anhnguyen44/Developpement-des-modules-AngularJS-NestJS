import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { AppProperties } from './app-properties.model';
import { Config, ConfigDb } from './Config';

export class ConfigService {
    private readonly config: Config;
    private configdb: ConfigDb;

    constructor() {
        const nodeEnv = process.env.NODE_ENV || 'development';
        const propertiesFolder = path.resolve(process.cwd(), 'properties');
        this.config = require(`${propertiesFolder}/${nodeEnv}.properties.json`);
    }

    getDb(): ConfigDb {
        if (!this.configdb) {
            this.configdb = new ConfigDb(this.config.db.host, this.config.db.dbuser, this.config.db.dbpassword,
                this.config.db.port, this.config.db.dbname)
       }
       return this.configdb;
    }
}