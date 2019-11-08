import { Component } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: ' app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'todoList';

  constructor() {
    const firebaseConfig = {
      apiKey: "AIzaSyCgAB_z02F49bgYlNA-hSoSftg69nwH0fc",
      authDomain: "todolist-94fbc.firebaseapp.com",
      databaseURL: "https://todolist-94fbc.firebaseio.com",
      projectId: "todolist-94fbc",
      storageBucket: "todolist-94fbc.appspot.com",
      messagingSenderId: "626186916514",
      appId: "1:626186916514:web:d73ecfda4e35534206fdfb"
    };
    firebase.initializeApp(firebaseConfig);
  }
}
