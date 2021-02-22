import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor(private http:HttpClient,private sharedService:SharedService) {
   
  }
   
   logout(token:string):Observable<any>{
     const url=environment.logoutURL;
     const request={
     }
     var httpHeader=new HttpHeaders({
        'Content-Type':'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS, GET, PUT',
        'Access-Control-Allow-Origin': '*',
        'Token':token,
        'Identity':'ead9c8c86bab17493373b8bf4434c8ca'
    
      })
    
    return this.sharedService.requestConn("post",url,{},httpHeader)
    //  return this.http.post(url,{},httpOptions);
   }
}
