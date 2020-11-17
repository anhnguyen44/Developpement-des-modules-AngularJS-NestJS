export class Order {

    constructor(label, style = '', orderable = false, nom = '', order = '') {
        this.label = label;
        this.isOrderable = orderable;
        this.nom = nom;
        this.order = order;
        this.style = style;
    }

    label: string;
    isOrderable: boolean;
    nom: string;
    order: string;
    style: string;
}