import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { AppRoutesEnum } from '../app-consts/app-constants';
import { LocalStorageService } from '../local-storage.service';
import { Question } from '../models/question.model';

@Component({
  selector: 'app-maname-questions',
  templateUrl: './manage-questions.component.html',
  styleUrls: ['./manage-questions.component.scss']
})

export class ManameQuestionsComponent implements OnInit {

  questions$: Observable<Question[]>;

  appRouteEnum = AppRoutesEnum;

  constructor(
    private localStorageService: LocalStorageService
  ) {
    this.questions$ = this.localStorageService.getQuestionsObservable();
  } 

  ngOnInit(): void {

  }

  deleteQuestion(id: string) {
    this.localStorageService.removeQuestion(id)
  }

}
