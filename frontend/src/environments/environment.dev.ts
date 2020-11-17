// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --configuration=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular.json`.
import {Environment} from './environment.model';

export const environment: Environment = {
  production: false,
  api: 'https://dev.aleacontroles.com:4242/api/v1',
  siteUrl: 'https://dev.aleacontroles.com/aleaAC',
  moxman: 'https://dev.aleacontroles.com/moxman'
};
