import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppRoutesEnum } from '../app-consts/app-constants';
import { QuestionTypesStrings, Question, QuestionTypes } from '../models/question.model';

@Component({
  selector: 'app-question-card',
  templateUrl: './question-card.component.html',
  styleUrls: ['./question-card.component.scss']
})
export class QuestionCardComponent implements OnInit {

  date: string = '';

  type: string = '';
  cardType: string = ''

  answered: string = '';

  id: string = '';

  @Input() question?: Question;

  @Input() calle?: AppRoutesEnum;

  appRouteEnum = AppRoutesEnum;

  questionTypesEnum = QuestionTypes;

  formGroup: FormGroup;

  controlsArray: FormArray = new FormArray([
    new FormControl(''), new FormControl('')
  ]);

  @Output() deleteQuestion = new EventEmitter<string>();

  constructor() {
    this.formGroup = new FormGroup({
      openAnswer: new FormControl('', Validators.required),
      question: new FormControl('', Validators.required),
      controlsArray: this.controlsArray
    });
  }

  ngOnInit(): void {
    this.setTemplateData();
  }

  setTemplateData(){
    if(this.question) {
      console.log(this.question.type)
      this.date = Question.getDateString(this.question?.creationTimestamp as number)
      this.type = Question.getQuestionTypeString(this.question?.type as QuestionTypesStrings);
      this.id = this.question?.id as string;
      this.answered = Question.isAnsweredTransform(this.question?.answered as boolean);
    }
  }

  onDeleteQuestion(){
    this.deleteQuestion.emit(this.question?.id)
  }

}
