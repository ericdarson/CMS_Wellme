import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CheckSessionService } from './check-session.service';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
httpOptions:any;
httpheader : HttpHeaders;
  constructor(private http:HttpClient, private sessionService:CheckSessionService,private sharedService:SharedService) {
    this.httpOptions=this.sessionService.getHeader();
  }
   
   getDashboard(periodic:string,start_date:string|null,end_date:string|null):Observable<any>{
    this.httpOptions=this.sessionService.getHeader();
    
    this.httpheader = this.httpOptions.headers
     const url=environment.dashboardUrl+'/'+periodic+'/'+start_date+'/'+end_date;
     console.log(url);
     const request={
     }

     
     return this.sharedService.requestConn("get",url,{},this.httpheader)
    //  return this.http.get(url,this.httpOptions);
   }

   getDashboardPromo():Observable<any>{
    this.httpOptions=this.sessionService.getHeader();
   
    this.httpheader = this.httpOptions.headers
    console.log(this.httpheader)
    const url=environment.dashboardPromoUrl;
    const request={
    }
  
    return this.sharedService.requestConn("get",url,{},this.httpheader)
    // return this.http.get(url,this.httpOptions);
  }
}
