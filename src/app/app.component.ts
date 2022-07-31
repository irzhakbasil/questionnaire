import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutesEnum } from './app-consts/app-constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'questionnaire-app';

  constructor(private router: Router){
    this.router.navigate([AppRoutesEnum.MANAGE_QUESTIONS])
  }

  ngOnInit() {
  }
}
