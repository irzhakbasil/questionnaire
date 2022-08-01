// angular
import { Component, OnInit } from '@angular/core';
import { Question, QuestionLifecircleMode, QuestionTypes, QuestionTypesStrings } from '../models/question.model';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms'

// app
import { CONTROLS_ARRAY_MAX_LENGTH, CREATE_QUESTION_MIN_FILLED_IN_INPUTS} from '../app-consts/app-constants'

//3-rd party
import { nanoid } from 'nanoid';
import { LocalStorageService } from '../local-storage.service';
import { Router } from '@angular/router';
import { interval, take } from 'rxjs';

@Component({
  selector: 'app-add-edit-question',
  templateUrl: './add-edit-question.component.html',
  styleUrls: ['./add-edit-question.component.scss']
})

export class AddEditComponent implements OnInit {

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
    this.formGroup.get('type')?.valueChanges.subscribe(type => {
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
    this.formGroup.get('type')?.setValue(Question.getQuestionTypeString(this.editQuestionObject.type as QuestionTypesStrings));
    this.formGroup.get('question')?.setValue(this.editQuestionObject.question);
    if(this.editQuestionObject.answers) {
      if(this.editQuestionObject.answers?.length > CREATE_QUESTION_MIN_FILLED_IN_INPUTS) {
        // We add inputs if there is more then 2 answers
        const missingInputsNumber = this.editQuestionObject.answers?.length - CREATE_QUESTION_MIN_FILLED_IN_INPUTS;
        interval(0).pipe(take(missingInputsNumber)).subscribe(_=> {
          this.addQastionInput();
          this.formGroup.get('controlsArray')?.patchValue(this.editQuestionObject.answers)
        });
      } else {
        this.formGroup.get('controlsArray')?.patchValue(this.editQuestionObject.answers);
      }
    }
  }

  fillTypeNames(){
    this.questionTypeNames = Object.entries(QuestionTypes).map(([_, value]) => {
        return value;
    });
  }

  selectType(type: string) {
    this.formGroup.get('type')?.setValue(type)
  }

  addQastionInput(){
    if (this.controlsArray.length < this.controlsMaxLength) {
      this.controlsArray.push(new FormControl(''))
    }
  }

  validateInputs() {
    this.formGroup.valueChanges.subscribe(_ => {
      // Checking if 2 inputs for single and multiple choices are filled in:
      this.isInputsValid = (this.formGroup.get('controlsArray') as FormArray)
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
      question: this.formGroup.get('question')?.value,
      type: Question.getQuestionType(this.formGroup.get('type')?.value),
      id: this.isEditMode ? this.editQuestionObject.id : nanoid(),
      answers: this.selectedType !== QuestionTypes.OPEN
        ? (this.formGroup.get('controlsArray') as FormArray).value.filter((val: string) => val !== '')
        : []
    }, this.isEditMode ? QuestionLifecircleMode.UPDATE : QuestionLifecircleMode.CREATE)
    if(this.isEditMode) {
      this.localStoreService.updateQuestion(newQuestion);
    } else {
      this.localStoreService.saveQuestion(newQuestion);
    }
    this.router.navigate(['/manage-questions']);
  }
}
