import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, Output, ɵConsole } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { __param } from 'tslib';
import { SharedService } from './shared.service';


@Injectable({
  providedIn: 'root'
})
export class CheckSessionService {
  @Output() login:string="";
  constructor(private http:HttpClient, private session:SessionStorageService,private router:Router,private sharedService:SharedService) { }
  
  checkSession():Observable<any> {
    const url=environment.checkSessionUrl;
      var username=this.session.retrieve("username")==undefined||this.session.retrieve("username")==null?"":this.session.retrieve("username")
      var token=this.session.retrieve("token")==undefined||this.session.retrieve("token")==null?"":this.session.retrieve("token")
      var httpHeader=new HttpHeaders({
          'Content-Type':'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS, GET, PUT',
          'Access-Control-Allow-Origin': '*',
          'Identity':'ead9c8c86bab17493373b8bf4434c8ca',
          'Username':username,
          'Token':token,

      
        })
    // console.log(httpOptions);    
    

    return this.sharedService.requestConn("post",url,{},httpHeader)
    // return this.http.post(url,{},httpOptions);
    
  }

  async isLogin():Promise<any>{

    return await new Promise((resolve, reject) => {
      this.checkSession().subscribe((response: any) => {
        resolve(response);
      }, reject);
    });
    

  }

  getHeader():any{
    const url=environment.checkSessionUrl;
    var username=this.session.retrieve("username")==undefined||this.session.retrieve("username")==null?"":this.session.retrieve("username")
    var token=this.session.retrieve("token")==undefined||this.session.retrieve("token")==null?"":this.session.retrieve("token")
    return {
      headers:new HttpHeaders({
        'Content-Type':'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS, GET, PUT',
        'Access-Control-Allow-Origin': '*',
        'Identity':'ead9c8c86bab17493373b8bf4434c8ca',
        'Username':username,
        'Token':token,
      })
    };
  }

  

  isLoginGeneral():void{

    this.checkSession().subscribe(response=> {
      if(response.output_schema.session.message=="SUKSES"){
        this.login="block";
        this.session.store("username",response.output_schema.session.username);
        this.session.store("token",response.output_schema.session.new_token);
      }
      else{
        this.router.navigate(['/login'])
      }
    }, (error) => {
  
      this.router.navigate(['/login'])
    });
  }

  isLoginPage():void{
    
    var islogin=this.isLogin().then(response=> {
      console.log(response);
        
      if(response.output_schema.session.message=="SUKSES"){
        console.log("login hit");
        this.session.store("username",response.output_schema.session.username);
        this.session.store("token",response.output_schema.session.new_token);
        this.router.navigate(['/'])
  
      }
      else{
        
      }
    }, (error) => {
  
      
    }).catch(err=>{
      console.log(err);
    });
  }
}
