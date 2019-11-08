import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  currentUser;

  currentUserSubject = new Subject<any>();

  constructor() { }

  emitUser() {
    this.currentUserSubject.next(this.currentUser);
  }

  saveUser(userId: string) {
    firebase.database().ref('/users/' + userId + '/profile').set(this.currentUser);
  }

  getUser(userId: string) {
    firebase.database().ref('/users/' + userId + '/profile/').on('value', (data) => {
      this.currentUser = data.val() ? data.val() : null;
      this.emitUser();
    });
  }

  updateUser(user: any, userId: string) {
    this.currentUser = user;
    this.saveUser(userId);
  }

  uploadFile(file: File) {
    return new Promise(
      (resolve, reject) => {
        const almostUniqueId = Date.now().toString();
        const upload = firebase.storage().ref().child('images/profiles/' + almostUniqueId + file.name).put(file);
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
          () => {
            console.log('Loading...');
          },
          (error) => {
            console.log('Error ! : ' + error);
            reject();
          },
          () => {
            upload.snapshot.ref.getDownloadURL().then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      }
    );
  }

  removePhoto(photoLink: string) {
    if (photoLink) {
      const storageRef = firebase.storage().refFromURL(photoLink);
      storageRef.delete().then(
        () => {
          console.log('File deleted');
        }
      ).catch(
        (error) => {
          console.log('File not found : ' + error);
        }
      );
    }
  }

}
