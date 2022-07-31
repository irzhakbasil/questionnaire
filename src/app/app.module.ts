import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddEditComponent } from './add-edit-question/add-edit-question.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ManameQuestionsComponent } from './maname-questions/maname-questions.component';
import { QuestionCardComponent } from './question-card/question-card.component';
import { ListOfQuestionsComponent } from './list-of-questions/list-of-questions.component';

@NgModule({
  declarations: [
    AppComponent,
    AddEditComponent,
    PageNotFoundComponent,
    ManameQuestionsComponent,
    QuestionCardComponent,
    ListOfQuestionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
