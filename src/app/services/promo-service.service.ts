import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CheckSessionService } from './check-session.service';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class PromoServiceService {
  
  constructor(private http:HttpClient,private sessionService:CheckSessionService,private sharedService:SharedService) {
    
  }
  
  getPromoAkumulasi():Observable<any>{
    const request={
    }
    var httpOptions=this.sessionService.getHeader();
    var httpHeader = httpOptions.headers
    const url=environment.promoAkumulasiUrl;

    return this.sharedService.requestConn("get",url,{},httpHeader)
    // return this.http.get(url,httpOptions);
  }
}
