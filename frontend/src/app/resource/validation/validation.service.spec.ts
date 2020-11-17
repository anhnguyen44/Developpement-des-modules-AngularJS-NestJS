import { TestBed } from '@angular/core/testing';

import { ValidationService } from './validation.service';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';

describe('ValidationService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      providers: [],
      imports: [ReactiveFormsModule]
  }));

  it('should be created', () => {
    const service: ValidationService = TestBed.get(ValidationService);
    expect(service).toBeTruthy();
  });

  /** RQUIRED */
  it('should invalidate required empty field with name', () => {
    const service: ValidationService = TestBed.get(ValidationService);
    const formBuilder: FormBuilder = TestBed.get(FormBuilder);

    let informationsForm = formBuilder.group({
      requiredEmptyField: [null, Validators.required],
    });

    let champs = new Map<string, string>([['requiredEmptyField', 'Champ vide']]);

    let erreurs = service.getFormValidationErrors(informationsForm, champs);
    expect(erreurs).toEqual(['Champ vide est obligatoire.'])
  });

  it('should invalidate required empty field without name', () => {
    const service: ValidationService = TestBed.get(ValidationService);
    const formBuilder: FormBuilder = TestBed.get(FormBuilder);

    let informationsForm = formBuilder.group({
      requiredEmptyField: [null, Validators.required],
    });

    let erreurs = service.getFormValidationErrors(informationsForm);
    expect(erreurs).toEqual(['Le champ requiredEmptyField est obligatoire.'])
  });

  it('should validate required filld field', () => {
    const service: ValidationService = TestBed.get(ValidationService);
    const formBuilder: FormBuilder = TestBed.get(FormBuilder);

    let informationsForm = formBuilder.group({
      requiredEmptyField: [null, Validators.required],
    });

    informationsForm.controls.requiredEmptyField.setValue('Mon super champ pas vide');
    let champs = new Map<string, string>([['requiredEmptyField', 'Champ vide']]);

    let erreurs = service.getFormValidationErrors(informationsForm, champs);
    let erreurs2 = service.getFormValidationErrors(informationsForm);
    expect(erreurs).toEqual([]);
    expect(erreurs2).toEqual([]);
  });

  /** PATTERN */
  it('should invalidate invalid pattern field with name', () => {
    const service: ValidationService = TestBed.get(ValidationService);
    const formBuilder: FormBuilder = TestBed.get(FormBuilder);

    let informationsForm = formBuilder.group({
      invalidPatternField: [null, Validators.pattern('[a-z]+')],
    });
    informationsForm.controls.invalidPatternField.setValue('A1');

    let champs = new Map<string, string>([['invalidPatternField', 'Champ invalide']]);

    let erreurs = service.getFormValidationErrors(informationsForm, champs);
    expect(erreurs).toEqual(['Champ invalide ne respecte pas le format attendu.']);
  });

  it('should invalidate invalid pattern field without name', () => {
    const service: ValidationService = TestBed.get(ValidationService);
    const formBuilder: FormBuilder = TestBed.get(FormBuilder);

    let informationsForm = formBuilder.group({
      invalidPatternField: [null, Validators.pattern('[a-z]+')],
    });
    informationsForm.controls.invalidPatternField.setValue('A1');

    let erreurs = service.getFormValidationErrors(informationsForm);
    expect(erreurs).toEqual(['Le champ invalidPatternField ne respecte pas le format attendu.']);
  });

  it('should validate valid pattern field', () => {
    const service: ValidationService = TestBed.get(ValidationService);
    const formBuilder: FormBuilder = TestBed.get(FormBuilder);

    let informationsForm = formBuilder.group({
      invalidPatternField: [null, Validators.pattern('[a-z]+')],
    });

    informationsForm.controls.invalidPatternField.setValue('youpi');
    let champs = new Map<string, string>([['invalidPatternField', 'Champ vide']]);

    let erreurs = service.getFormValidationErrors(informationsForm, champs);
    let erreurs2 = service.getFormValidationErrors(informationsForm);
    expect(erreurs).toEqual([]);
    expect(erreurs2).toEqual([]);
  });

  /** EMAIL */
  it('should invalidate bad email field with name', () => {
    const service: ValidationService = TestBed.get(ValidationService);
    const formBuilder: FormBuilder = TestBed.get(FormBuilder);

    let informationsForm = formBuilder.group({
      invalidPatternField: [null, Validators.email],
    });
    informationsForm.controls.invalidPatternField.setValue('lalala');

    let champs = new Map<string, string>([['invalidPatternField', 'Champ invalide']]);

    let erreurs = service.getFormValidationErrors(informationsForm, champs);
    expect(erreurs).toEqual(["Champ invalide n'est pas un email valide."]);
  });

  it('should invalidate bad email field without name', () => {
    const service: ValidationService = TestBed.get(ValidationService);
    const formBuilder: FormBuilder = TestBed.get(FormBuilder);

    let informationsForm = formBuilder.group({
      invalidPatternField: [null, Validators.email],
    });
    informationsForm.controls.invalidPatternField.setValue('lalala');

    let erreurs = service.getFormValidationErrors(informationsForm);
    expect(erreurs).toEqual(["Le champ invalidPatternField n'est pas un email valide."]);
  });

  it('should validate email field', () => {
    const service: ValidationService = TestBed.get(ValidationService);
    const formBuilder: FormBuilder = TestBed.get(FormBuilder);

    let informationsForm = formBuilder.group({
      invalidPatternField: [null, Validators.email],
    });

    informationsForm.controls.invalidPatternField.setValue('youpi@yopmail.com');
    let champs = new Map<string, string>([['invalidPatternField', 'Champ osef']]);

    let erreurs = service.getFormValidationErrors(informationsForm, champs);
    let erreurs2 = service.getFormValidationErrors(informationsForm);
    expect(erreurs).toEqual([]);
    expect(erreurs2).toEqual([]);
  });
});
