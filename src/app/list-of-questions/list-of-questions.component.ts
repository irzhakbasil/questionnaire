import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Observable, ReplaySubject, take, takeUntil } from 'rxjs';
import { AppRoutesEnum } from '../app-consts/app-constants';
import { LocalStorageService } from '../local-storage.service';
import { Question } from '../models/question.model';

@Component({
  selector: 'app-list-of-questions',
  templateUrl: './list-of-questions.component.html',
  styleUrls: ['./list-of-questions.component.scss']
})
export class ListOfQuestionsComponent implements OnInit, OnDestroy {

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  questions$: Observable<Question[]>;

  answeredQuestions: Question[] = [];

  unansweredQuestions: Question[] = [];

  appRoutesEnum = AppRoutesEnum;

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    this.questions$ = localStorageService.getQuestionsObservable();
  }

  ngOnInit(): void {
   this.sortQuestions();
  }

  sortQuestions() {
      this.questions$.pipe(takeUntil(this.destroyed$)).subscribe(res => {
        const sortedQuestions = Question.sortQuestionsByisAnswered(res);
        this.answeredQuestions = sortedQuestions.answeredQuestion;
        this.unansweredQuestions = sortedQuestions.unansweredQuestion;
      })
  }

  answerQuestion(question: Question){
    this.localStorageService.updateQuestion(question);
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
