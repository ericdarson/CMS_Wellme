import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { CheckSessionService } from './check-session.service';
import { SharedService } from './shared.service';



@Injectable({
  providedIn: 'root'
})
export class HistoriTransaksiService {
  httpOptions:any;
  httpheader : HttpHeaders;
  constructor(private http:HttpClient,private sessionService:CheckSessionService,private sharedService:SharedService) {
    this.httpOptions=this.sessionService.getHeader();
  }
   
  getHistoriPembelian():Observable<any>{
    this.httpOptions=this.sessionService.getHeader();
    this.httpheader = this.httpOptions.headers
    const url=environment.historiPembelianUrl;   

    return this.sharedService.requestConn("get",url,{},this.httpheader)
    // return this.http.get(url,this.httpOptions);
  }
  getHistoriPenjualan():Observable<any>{
    this.httpOptions=this.sessionService.getHeader();
    this.httpheader = this.httpOptions.headers
    const url=environment.historiPenjualanUrl;   

    
    return this.sharedService.requestConn("get",url,{},this.httpheader)
    // return this.http.get(url,this.httpOptions);
  }
  getHistoriPembelianNasabah(bcaId:string):Observable<any>{
    this.httpOptions=this.sessionService.getHeader();
    this.httpheader = this.httpOptions.headers
    const url=environment.historiPembelianUrl+'/'+bcaId;  
    
    
    return this.sharedService.requestConn("get",url,{},this.httpheader)
    // return this.http.get(url,this.httpOptions);
  }
  getHistoriPenjualanNasabah(bcaId:string):Observable<any>{
    this.httpOptions=this.sessionService.getHeader();
    this.httpheader = this.httpOptions.headers
    const url=environment.historiPenjualanUrl+'/'+bcaId;   

    
    return this.sharedService.requestConn("get",url,{},this.httpheader)
    // return this.http.get(url,this.httpOptions);
  }

}
