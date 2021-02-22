import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {Md5} from 'ts-md5/dist/md5';
import {environment} from 'src/environments/environment'
import { SharedService } from './shared.service';
const httpHeader=new HttpHeaders({
    'Content-Type':'application/json',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS, GET, PUT',
    'Access-Control-Allow-Origin': '*',
    'Identity': 'ead9c8c86bab17493373b8bf4434c8ca',
  })
@Injectable({
  providedIn: 'root'
})

export class LoginServicesService {
  
 constructor(private http:HttpClient,private sharedService : SharedService) {
   
 }
  
  login(username:string,password:string):Observable<any>{
    const url=environment.loginUrl;
    const md5 = new Md5();
    password=md5.appendStr(password).end().toString();
    const request={
      username:username,
      password:password
    }

    return this.sharedService.requestConn("post",url,request,httpHeader)
    // return this.http.post(url,request,httpOptions);
  }
  
}
