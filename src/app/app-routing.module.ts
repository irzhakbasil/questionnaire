import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutesEnum } from './app-consts/app-constants';
import { AppComponent } from './app.component';
import { AddEditComponent } from './add-edit-question/add-edit-question.component';
import { ManameQuestionsComponent } from './maname-questions/maname-questions.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ListOfQuestionsComponent } from './list-of-questions/list-of-questions.component';

const routes: Routes = [
  { path: '', component: ManameQuestionsComponent },
  { path: AppRoutesEnum.MANAGE_QUESTIONS, component: ManameQuestionsComponent },
  { path: 'manage-questions/create-question', component: AddEditComponent },
  { path: 'manage-questions/edit-question/:id', component: AddEditComponent },
  { path: 'list-of-questions', component: ListOfQuestionsComponent },
  { path: '**', pathMatch: 'full', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
