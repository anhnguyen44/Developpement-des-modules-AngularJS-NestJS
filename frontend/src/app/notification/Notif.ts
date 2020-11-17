export class Notif {

    typeMessage: string;
    messages: string[];

    constructor(typeMessage, messages) {
        this.messages = messages;
        this.typeMessage = typeMessage;
    }
}
