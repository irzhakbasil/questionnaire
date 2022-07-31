import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Question } from './models/question.model';

const STORAGE_KEY = 'questionnaire';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  questions$ = new BehaviorSubject<Question[]>([]);

  constructor() {
    this.getData(false);
  }

  public saveData(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  public saveQuestion(question: Question) {
    let storeData = this.getData(true);
    storeData.push(question);
    this.saveData(STORAGE_KEY, JSON.stringify(storeData));
    this.getData(false);
  }

  public updateQuestion(questionEdited: Question) {
    let storeData = this.getData(true);
    storeData.map((question, index) => {
      if(question.id === questionEdited.id) {
        storeData[index] = questionEdited;
      }
    });
    this.saveData(STORAGE_KEY, JSON.stringify(storeData));
    this.getData(false);
  }

  public removeQuestion(id: string) {
    let storeData = this.getData(true);
    storeData = storeData.filter(question => {
      return question.id !== id;
    })
    this.saveData(STORAGE_KEY, JSON.stringify(storeData));
    this.getData(false);
  }

  getQuestionsObservable() {
    return this.questions$.asObservable();
  }

  setQuestionsObservable(questions: Question[]) {
    this.questions$.next(questions)
  }

  public getData(isSaveDeleteUpdateOperation: boolean): Question[] {
    const data = localStorage.getItem(STORAGE_KEY);
    let storeData;
    const questions: Question[] = [];
    if(data) {
      storeData = JSON.parse(data);
      if(storeData instanceof Array) {
        storeData.forEach((item) => {
          questions.push(new Question(item))
        })
      }
    }
    if(!isSaveDeleteUpdateOperation) {
      this.setQuestionsObservable(questions);
    }
    return questions;
  }

  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  public clearData() {
    localStorage.clear();
  }
}
