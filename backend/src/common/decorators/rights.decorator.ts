import { ReflectMetadata } from '@nestjs/common';


export function Rights(...droits: string[]);
export function Rights(droits: string[]);
export function Rights(...droitOrDroits: Array<string | string[]>) {
    const droits = Array.isArray(droitOrDroits[0]) ? (droitOrDroits[0] as string[]) : (droitOrDroits as string[]);
    return ReflectMetadata('droits', droits);
}
