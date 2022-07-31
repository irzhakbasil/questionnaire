import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { interval, ReplaySubject, take, takeUntil, timeout } from 'rxjs';
import { AppRoutesEnum, CREATE_QUESTION_MIN_FILLED_IN_INPUTS } from '../app-consts/app-constants';
import { QuestionTypesStrings, Question, QuestionTypesConsts, QuestionLifecircleMode } from '../models/question.model';

interface IAnswerForm {
  openAnswer: FormControl<string>;
  singleChoice: FormControl<string>;
  multiChoiceArray: FormArray
}

enum AnswerFormKeys {
  OPEN_ANSWER = 'openAnswer',
  SINGLE_CHOICE= 'singleChoice',
  MULTI_CHICE_ARRAY = 'multiChoiceArray'

}
@Component({
  selector: 'app-question-card',
  templateUrl: './question-card.component.html',
  styleUrls: ['./question-card.component.scss']
})

export class QuestionCardComponent implements OnInit, OnDestroy {

  @Output() deleteQuestion = new EventEmitter<string>();

  @Output() submitAnswer = new EventEmitter<Question>();

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  date: string = '';

  type: string = '';
  cardType: string = ''

  answered: string = '';

  id: string = '';

  @Input() question?: Question;

  @Input() calle?: AppRoutesEnum;

  appRouteEnum = AppRoutesEnum;

  questionTypesEnum = QuestionTypesConsts;

  formGroup: FormGroup;

  multiChoiceArray: FormArray = new FormArray([
    new FormControl(''), new FormControl('') // Check this
  ]);

  isFormValid: boolean = false;

  constructor() {
      QuestionCardComponent
      this.formGroup = new FormGroup<IAnswerForm>({
        openAnswer: new FormControl('', Validators.required) as FormControl<string>,
        singleChoice: new FormControl('', Validators.required) as FormControl<string>,
        multiChoiceArray: this.multiChoiceArray
    })
  }

  ngOnInit(): void {
    this.setTemplateData();
    this.formGroup.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(_ => {
      this.checkFormValidity();
    })

    setTimeout(()=> {
      console.log(this.question)
    },2000)
  }

  setTemplateData(){

    if(this.question) {
      this.type = Question.getQuestionTypeString(this.question?.type as QuestionTypesStrings);
      if (this.calle === AppRoutesEnum.MANAGE_QUESTIONS) {
        this.date = Question.getDateString(this.question?.creationTimestamp as number)
        this.id = this.question?.id as string;
        this.answered = Question.isAnsweredTransform(this.question?.answered as boolean);
      }

      if (this.calle === AppRoutesEnum.LIST_OF_QUESTIONS && !this.question.answered) {
        if (this.question.answers) {
          const missingInputsNumber = (this.question?.answers).length - CREATE_QUESTION_MIN_FILLED_IN_INPUTS;
          console.log(missingInputsNumber)
          interval(0).pipe(take(missingInputsNumber)).subscribe(_=> {
            this.multiChoiceArray.push(new FormControl(''))
          });
        }
      }

    }
  }

  checkFormValidity(){
    switch(this.question?.type) {

      case QuestionTypesConsts.OPEN: {
        this.isFormValid = this.formGroup.get(AnswerFormKeys.OPEN_ANSWER)?.valid as boolean;
        break;
      }

      case QuestionTypesConsts.SINGLE: {
        this.isFormValid = this.formGroup.get(AnswerFormKeys.SINGLE_CHOICE)?.valid as boolean;
        break;
      }

      case QuestionTypesConsts.MULTIPLE: {
        this.isFormValid = this.formGroup.get(AnswerFormKeys.MULTI_CHICE_ARRAY)?.value.toString().includes(true.toString()) as boolean;
        break;
      }
    }
  }

  submitAnsver(){
    const updatedQuestion = new Question({...this.question as Question}, QuestionLifecircleMode.UPDATE);
    switch(this.question?.type) {
      case QuestionTypesConsts.OPEN: {
        updatedQuestion.answersChosenByUser = [this.formGroup.get(AnswerFormKeys.OPEN_ANSWER)?.value];
        updatedQuestion.answered = true;
        this.submitAnswer.next(updatedQuestion);
        break;
      }

      case QuestionTypesConsts.SINGLE: {
        if(updatedQuestion.answers) {
          const answerIndex = this.formGroup.get(AnswerFormKeys.SINGLE_CHOICE)?.value;
          updatedQuestion.answersChosenByUser = [this.question.answers?.[answerIndex] as string];
          updatedQuestion.answered = true;
          this.submitAnswer.next(updatedQuestion);
        }
        break;
      }

      case QuestionTypesConsts.MULTIPLE: {
        const multiChoiceArrayValue = this.formGroup.get(AnswerFormKeys.MULTI_CHICE_ARRAY)?.value;
        updatedQuestion.answersChosenByUser = updatedQuestion.answers?.map((answer: string, index) => {
          if(multiChoiceArrayValue[index]) {
            return answer
          } else return '';
        }).filter(question => question !== '') as string[];
        updatedQuestion.answered = true;
        this.submitAnswer.next(updatedQuestion);
        break;
      }
    }
  }

  returnToUnunswered(){
    const updatedQuestion = new Question({...this.question as Question}, QuestionLifecircleMode.UNANSWER);
    this.submitAnswer.next(updatedQuestion);
  }

  onDeleteQuestion(){
    this.deleteQuestion.emit(this.question?.id)
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
