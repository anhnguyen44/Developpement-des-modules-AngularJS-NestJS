import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: controlName });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  RequireIf(controlName: string, condition: boolean) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];

      // set error on matchingControl if validation fails
      if (condition && (!control.value || control.value === '' || control.value.length === 0)) {
        control.setErrors({ required: true });
      } else {
        control.setErrors(null);
      }
    };
  }

  getFormValidationErrors(formulaire: FormGroup, nomChamps?: Map<string, string>) {
    let erreurs: string[] = new Array<string>();
    Object.keys(formulaire.controls).forEach(key => {

      const controlErrors: ValidationErrors | null = formulaire!.get(key)!.errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          //console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          let text;
          let nomChamp = nomChamps && nomChamps.has(key) ? nomChamps.get(key) + ' ' : 'Le champ ' + key;
          switch (keyError) {
            case 'required': text = `${nomChamp} est obligatoire.`; break;
            case 'pattern': text = `${nomChamp} ne respecte pas le format attendu.`; break;
            case 'email': text = `${nomChamp} n'est pas un email valide.`; break;
            case 'minlength': text = `${nomChamp} n'a pas la bonne longueur. Minimum : ${controlErrors[keyError].requiredLength}`; break;
            case 'maxlength': text = `${nomChamp} n'a pas la bonne longueur. Minimum : ${controlErrors[keyError].requiredLength}`; break;
            case 'areEqual': text = `${nomChamp} doivent être identiques.`; break;
            case 'alreadyExists': text = `${nomChamp} existe déjà.`; break;
            case 'min': text = `${nomChamp} doit valoir au minimum ${controlErrors[keyError].min}.`; break;
            case 'max': text = `${nomChamp} doit valoir au maximum ${controlErrors[keyError].max}.`; break;
            case 'mustMatch': text = `${nomChamp} et ${nomChamps && nomChamps.has(controlErrors[keyError]) ? (nomChamps.get(controlErrors[keyError])!.toLowerCase()) : 'le champ ' + controlErrors[keyError]} doivent être identiques.`; break;
            default: text = `${key}: ${keyError}: ${controlErrors[keyError]}`;
          }
          erreurs.push(text);
        });
      }
    });
    return erreurs;
  }
}
