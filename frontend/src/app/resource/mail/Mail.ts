import { MailFile } from '@aleaac/shared';

export class Mail {
    from: string;
    to: string[];
    subject: string;
    template: string;
    dataList: any;
    cc?: string[];
    cci?: string[];
    attachments?: MailFile[];
    contenu: string;
    idParent?: number;
    application?: string;
}

export class MailOptions {
    from: string;
    to: string[];
    subject: string;
    html: string;
    text?: string;
    cc?: string[];
    bcc?: string[];
    attachments?: MailFile[];
}
