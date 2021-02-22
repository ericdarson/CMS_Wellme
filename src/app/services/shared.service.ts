import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { promise } from 'protractor';
import { observable, Observable,from } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, mergeMap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  url : string;
  body : any;
  httpHeader : HttpHeaders;
  method : string;
  token:string;

  constructor(private http:HttpClient) { }



   requestConn(method : string,url : string , body : any, httpHeader : HttpHeaders){
    this.url = url
    this.body = body
    this.httpHeader = httpHeader
    this.method = method

    return from(this.getTokenAPIGW().toPromise()).pipe(mergeMap(resp => {
      this.token = resp.token;
      return this.hitService();
    }));

  }

  hitService(): Observable<any>{
    this.httpHeader = this.httpHeader.append('Authorization',"Bearer "+this.token)
    var httpOptions = {
      headers: this.httpHeader
    }
    if(this.method == "post"){
      return this.http.post(this.url,this.body,httpOptions);
    }else if(this.method== "get"){
      return this.http.get(this.url,httpOptions);
    }else if(this.method == "put"){
      return this.http.put(this.url,this.body,httpOptions);
    }else if(this.method =="delete"){
      return this.http.delete(this.url,httpOptions);
    }else{
      return new Observable<any>()
    }
  }


  getTokenAPIGW(): Observable<any>{
    var value = btoa(environment.client_id+':'+environment.client_secret)
    var httpOptions={
      headers:new HttpHeaders({
        'Content-Type':'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS, GET, PUT',
        'Access-Control-Allow-Origin': '*',
        'Identity':'ERICIMPOSTORNYA',
        "Authorization" : "Basic " +value
      })
    };
    console.log(httpOptions)
    
    return this.http.post(environment.tokenAPIGWUrl,{},httpOptions);
    


  }
}
