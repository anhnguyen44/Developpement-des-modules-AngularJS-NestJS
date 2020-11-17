export interface AppProperties {
  db: {
    host: string;
    dbname: string;
    port: number;
    dbuser: string;
    dbpassword: string;
    testsMayDropDb: boolean;
  };
  cors: {
    origin: string | string[];
  };
  token: {
    secret: string;
    algorithm?: string;
    expiresIn?: string;
  };
  ssl: {
    key: string;
    cert: string;
  };
  smtp?: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
    logger: boolean;
    debug: boolean;
  },
  sendmail?: {
    newline: string;
    path: number;
  },
  dkim?: {
    domainName: string,
    keySelector: string,
    privateKey: string
  }
  site: {
    url: string;
  }
}
