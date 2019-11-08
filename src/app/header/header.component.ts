import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import * as firebase from 'firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  title = 'ToDo List'; // propriété (variable) title

  isLoggedIn = false;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log('Connecté');
        this.isLoggedIn = true;
      } else {
        console.log('Déconnecté');
        this.isLoggedIn = false;
      }
    });
  }

  onSignOut() {
    this.authenticationService.signoutUser();
    this.router.navigate(['signin']);
  }

}
