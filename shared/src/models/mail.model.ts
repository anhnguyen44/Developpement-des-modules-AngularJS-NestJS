export class Mail {
    from: string;
    to: string[];
    subject: string;
    template: string;
    dataList: any;
    cc?: string[];
    cci?: string[];
    attachments?: MailFile[];
}

// NE pas renommer le champ filename en fileName
export class MailFile {
    filename: string;
    path: string;
    selected: boolean;
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
