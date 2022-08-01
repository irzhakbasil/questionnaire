// angular
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Question, QuestionLifecircleMode, QuestionTypes, QuestionTypesStrings } from '../models/question.model';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router';

// app
import { AppRoutesEnum, CONTROLS_ARRAY_MAX_LENGTH, CREATE_QUESTION_MIN_FILLED_IN_INPUTS} from '../app-consts/app-constants'
import { LocalStorageService } from '../local-storage.service';

//3-rd party
import { nanoid } from 'nanoid';
import { finalize, interval, ReplaySubject, take, takeUntil } from 'rxjs';

enum QuestionFormKeys {
  TYPE = 'type',
  QUESTION = 'question',
  CONTROLS_ARRAY = 'controlsArray'
}
@Component({
  selector: 'app-add-edit-question',
  templateUrl: './add-edit-question.component.html',
  styleUrls: ['./add-edit-question.component.scss']
})

export class AddEditComponent implements OnInit, OnDestroy {

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  appRoutesEnum = AppRoutesEnum;

  isEditMode: boolean = false;

  editQuestionObject: Question = Question.getEmptyQuestionObject();

  isInputsValid: boolean = true;

  questionTypesEnum = QuestionTypes;

  questionTypeNames: string[] = [];

  selectedType: string = '';

  controlsArray: FormArray = new FormArray([
    new FormControl(''), new FormControl('')
  ]);

  controlsMaxLength = CONTROLS_ARRAY_MAX_LENGTH;
  
  formGroup: FormGroup;

  constructor(
    private localStoreService: LocalStorageService,
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      question: Question,
    };

    if(state?.question) {
      this.isEditMode = true;
      this.editQuestionObject = state.question;
    }

    this.formGroup = new FormGroup({
      type: new FormControl('', Validators.required),
      question: new FormControl('', Validators.required),
      controlsArray: this.controlsArray
    });
    this.formGroup.get(QuestionFormKeys.TYPE)?.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(type => {
      this.selectedType = type;
    })
    this.fillTypeNames();
  }

  ngOnInit(): void {
    this.validateInputs();
    if(this.editQuestionObject) {
      this.setEditMode();
    }
  }

  setEditMode() {
    this.formGroup.get(QuestionFormKeys.TYPE)?.setValue(Question.getQuestionTypeString(this.editQuestionObject.type as QuestionTypesStrings));
    this.formGroup.get(QuestionFormKeys.QUESTION)?.setValue(this.editQuestionObject.question);
    if(this.editQuestionObject.answers) {
      if(this.editQuestionObject.answers?.length > CREATE_QUESTION_MIN_FILLED_IN_INPUTS) {
        // We add inputs if there is more then 2 answers
        const missingInputsNumber = this.editQuestionObject.answers?.length - CREATE_QUESTION_MIN_FILLED_IN_INPUTS;
        interval(0).pipe(take(missingInputsNumber), finalize(()=> {
          this.addQastionInput();
          this.formGroup.get(QuestionFormKeys.CONTROLS_ARRAY)?.patchValue(this.editQuestionObject.answers)
        })).subscribe(_=> null);
      } else {
        this.formGroup.get(QuestionFormKeys.CONTROLS_ARRAY)?.patchValue(this.editQuestionObject.answers);
      }
    }
  }

  fillTypeNames(){
    this.questionTypeNames = Object.entries(QuestionTypes).map(([_, value]) => {
        return value;
    });
  }

  selectType(type: string) {
    this.formGroup.get(QuestionFormKeys.TYPE)?.setValue(type)
  }

  addQastionInput(){
    if (this.controlsArray.length < this.controlsMaxLength) {
      this.controlsArray.push(new FormControl(''))
    }
  }

  validateInputs() {
    this.formGroup.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(_ => {
      // Checking if 2 inputs for single and multiple choices are filled in:
      this.isInputsValid = (this.formGroup.get(QuestionFormKeys.CONTROLS_ARRAY) as FormArray)
        .value.filter((value: string) => value !== '').length >= CREATE_QUESTION_MIN_FILLED_IN_INPUTS;
        // Setting valid state if we don't need answers
        if (this.selectedType === QuestionTypes.OPEN && this.formGroup.valid) {
          this.isInputsValid = true;
        }
    });
  }

  saveQuestion() {
    const newQuestion = new Question({
      creationTimestamp: new Date().getTime(),
      answeredTimestamp: new Date().getTime(),
      answered: false,
      question: this.formGroup.get(QuestionFormKeys.QUESTION)?.value,
      type: Question.getQuestionType(this.formGroup.get(QuestionFormKeys.TYPE)?.value),
      id: this.isEditMode ? this.editQuestionObject.id : nanoid(),
      answers: this.selectedType !== QuestionTypes.OPEN
        ? (this.formGroup.get(QuestionFormKeys.CONTROLS_ARRAY) as FormArray).value.filter((val: string) => val !== '')
        : []
    }, this.isEditMode ? QuestionLifecircleMode.UPDATE : QuestionLifecircleMode.CREATE)
    if(this.isEditMode) {
      this.localStoreService.updateQuestion(newQuestion);
    } else {
      console.log(newQuestion)
      this.localStoreService.saveQuestion(newQuestion);
    }
    this.router.navigate([AppRoutesEnum.MANAGE_QUESTIONS_ROOT]);
  }
  
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
