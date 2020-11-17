import { ReflectMetadata } from '@nestjs/common';
import { profils } from '@aleaac/shared/src/models/profil.model';


export function Authorized(...roles: profils[]);
export function Authorized(roles: profils[]);
export function Authorized(...roleOrRoles: Array<profils | profils[]>) {
    const roles = Array.isArray(roleOrRoles[0]) ? (roleOrRoles[0] as profils[]) : (roleOrRoles as profils[]);
    return ReflectMetadata('profils', roles);
}
