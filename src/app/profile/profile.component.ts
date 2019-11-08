import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { ProfileService } from '../services/profile.service';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profileForm: FormGroup;

  currentUser;

  userId: string;

  currentUserSubscription: Subscription;

  photoUploading = false;
  photoUploaded = false;

  constructor(
    private profileService: ProfileService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.initProfileForm();
    firebase.auth().onAuthStateChanged(
      (user) => {
        if (user) {
          this.userId = user.uid;
          this.currentUserSubscription = this.profileService.currentUserSubject.subscribe(
            (data) => {
              this.currentUser = data ? data : {
                firstname: '',
                lastname: '',
                email: '',
                photo: ''
              };
              this.profileForm.get('firstname').setValue(data.firstname ? data.firstname : '');
              this.profileForm.get('lastname').setValue(data.lastname ? data.lastname : '');
              this.profileForm.get('email').setValue(data.email ? data.email : '');
            }
          );
          this.profileService.getUser(user.uid);
        }
      }
    );
  }

  initProfileForm() {
    this.profileForm = this.formBuilder.group({
      firstname: '',
      lastname: '',
      email: ''
    });
  }

  onSubmitProfileForm() {
    const firstname = this.profileForm.get('firstname').value;
    const lastname = this.profileForm.get('lastname').value;
    const email = this.profileForm.get('email').value;
    const user = {
      firstname,
      lastname,
      email,
      photo: this.currentUser.photo ? this.currentUser.photo : ''
    };
    this.profileService.updateUser(user, this.userId);
  }

  onUploadPhoto(event) {
    this.photoUploading = true;
    if (this.currentUser.photo && this.currentUser.photo !== '') {
      this.profileService.removePhoto(this.currentUser.photo);
    }
    this.profileService.uploadFile(event.target.files[0]).then(
      (url: string) => {
        this.currentUser.photo = url;
        this.photoUploading = false;
        this.photoUploaded = true;
        this.profileService.updateUser(this.currentUser, this.userId);
      }
    );
  }

}
