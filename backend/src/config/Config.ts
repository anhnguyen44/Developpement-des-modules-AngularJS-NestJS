export class Config {
    db: ConfigDb;
    smtp: ConfigSmtp;
    site: {
        url: string;
        apiUrl: string;
    }
}


export class ConfigDb {

    host: string;
    dbuser: string;
    dbpassword: string;
    port: number;
    dbname: string;

    constructor(host, dbuser, dbpassword, port, dbname) {
        this.host = host;
        this.dbuser = dbuser;
        this.dbpassword = dbpassword;
        this.port = port;
        this.dbname = dbname;
    }
}

export class ConfigSmtp {

    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
    logger: boolean;
    debug: boolean;

    constructor(host, port, secure, auth, logger, debug = false) {
        this.host = host;
        this.port = port;
        this.secure = secure;
        this.auth = auth;
        this.logger = logger;
        this.debug = debug;
    }
}