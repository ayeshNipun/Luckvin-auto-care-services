import { Component, OnInit } from '@angular/core';
import { AuthService } from "../shared/services/auth.service";
import { Injectable, NgZone } from '@angular/core';
import {formatDate } from '@angular/common';
import { auth, User } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { Observable } from 'rxjs';
import { License } from '../shared/license.model';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

usersCustomerId ='';
licenseref:AngularFirestoreCollection<License>;
lisense$:Observable<License[]>;
licenseref1:AngularFirestoreCollection<License>;
lisense1$:Observable<License[]>;
lengtharray=0;
InsuranceID='';
InsuranceExpiryDate=new Date();
InsuranceCompany='';
RLStartDate=new Date();
RLExpiryDate=new Date();
VETExpiryDate=new Date();
firstRlsdate=new Date();
differentRsldate=0;
jstoday='';
today= new Date();
percentageForRTL=0;
  constructor(
    
    public authService: AuthService,
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth,
    private router: Router,
    private af: AuthService,
    private firestore: AngularFirestore,
  ) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.usersCustomerId = user.uid;
        console.log(this.usersCustomerId );
        this.licenseref=this.firestore.doc('users/'+this.usersCustomerId).collection('licenses')
        this.lisense$=this.licenseref.valueChanges();
        this.lisense$.subscribe(val => {
           this.lengtharray=val.length;
           console.log(this.lengtharray)
            this.licenseref1=this.firestore.doc('users/'+this.usersCustomerId).collection('licenses',ref=>ref.where('identifier','==',this.lengtharray))
            this.lisense1$=this.licenseref1.valueChanges();
            this.lisense1$.subscribe(val => {
              console.log(val);
              this.RLStartDate=val[0].RLStartDate;
              this.RLExpiryDate=val[0].RLExpiryDate;
              this.InsuranceExpiryDate=val[0].InsuranceExpiryDate;
              this.VETExpiryDate=val[0].VETExpiryDate;

              this.jstoday = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '+0530');
              
              var oneDay = 24*60*60*1000;
              var secondDate = new Date(this.jstoday);
              var firstDate = new Date(this.RLExpiryDate);
              this.differentRsldate=Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
              this.percentageForRTL=(365-this.differentRsldate)/3.65
            });
          });
       
      } 
    })
    
   
  }


  ngOnInit() {
  
    var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    var firstDate = new Date(2008,1,12);
    var secondDate = new Date(2008,1,22);
    
    var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
    console.log(diffDays);
  }
 
  
}
