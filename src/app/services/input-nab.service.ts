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
export class InputNABService {
  httpOptions:any
  
  httpheader : HttpHeaders;
  constructor(private http:HttpClient,private sessionService:CheckSessionService,private sharedService:SharedService) {
    this.httpOptions=this.sessionService.getHeader();  
  }
   
   getDailyNab(idJenis:string):Observable<any>{
    this.httpOptions=this.sessionService.getHeader();
    this.httpheader = this.httpOptions.headers
     const url=environment.dailyNabUrl+'/'+idJenis;  
     
     
     return this.sharedService.requestConn("get",url,{},this.httpheader)
    //  return this.http.get(url,this.httpOptions);
   }
  
   addJenisReksadana(namaJenis:string):Observable<any>{
    this.httpOptions=this.sessionService.getHeader();
    this.httpheader = this.httpOptions.headers
    const url=environment.jenisReksadanaUrl;
    const body={
      'nama_jenis_reksadana':namaJenis
        }

    return this.sharedService.requestConn("post",url,body,this.httpheader)
    // return this.http.post(url,body,this.httpOptions);
  }

  updateJenisReksadana(idJenis:string,namaJenis:string):Observable<any>{
    this.httpOptions=this.sessionService.getHeader();
    this.httpheader = this.httpOptions.headers
    const url=environment.jenisReksadanaUrl+'/'+idJenis;
    const body={
      'nama_jenis_reksadana':namaJenis
        }

    return this.sharedService.requestConn("put",url,body,this.httpheader)
    // return this.http.put(url,body,this.httpOptions);
  }

  updateDailyNab(idProduk:number,nab:number):Observable<any>{
    this.httpOptions=this.sessionService.getHeader();
    this.httpheader = this.httpOptions.headers
    const url=environment.dailyNabUrl;
    const body={
      'input':[
        {
          'id_produk':Number(idProduk),
          'nab':Number(nab)
        }
      ]
        }

    return this.sharedService.requestConn("post",url,body,this.httpheader)
    // return this.http.post(url,body,this.httpOptions);
  }
}
