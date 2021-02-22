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
export class BobotResikoService {
  httpOptions:any;
  httpheader : HttpHeaders;
  constructor(private http:HttpClient,private sessionService:CheckSessionService,private sharedService:SharedService) {
   this.httpOptions=sessionService.getHeader();
  }
  
  getBobotResiko():Observable<any>{
    this.httpOptions=this.sessionService.getHeader();
    this.httpheader = this.httpOptions.headers
    const url=environment.bobotResikoUrl;     

    return this.sharedService.requestConn("get",url,{},this.httpheader)
    // return this.http.get(url,this.httpOptions);
  }
  
  addBobotResiko(namaJenis:string):Observable<any>{
    this.httpOptions=this.sessionService.getHeader();
    this.httpheader = this.httpOptions.headers
    const url=environment.bobotResikoUrl;
    const body={
      'nama_jenis_reksadana':namaJenis
    }

    return this.sharedService.requestConn("post",url,body,this.httpheader)
    // return this.http.post(url,body,this.httpOptions);
  }
  
  updateBobotResiko(bobotResiko:string,persentase:any,id_jenis_reksadana:any):Observable<any>{
    this.httpOptions=this.sessionService.getHeader();
    this.httpheader = this.httpOptions.headers
    var temp=[];
    for(var i=0;i<persentase.length;i++)
    {
      temp.push({
        "bobot_resiko":Number(bobotResiko),
        "id_jenis_reksadana":Number(id_jenis_reksadana[i]),
        "persentase":Number(persentase[i])
      });
    }
    
    const url=environment.bobotResikoUrl;
    var body = {
      "input" : temp
    };
    console.log(body);
    
    return this.sharedService.requestConn("put",url,body,this.httpheader)
    // return this.http.put(url,body,this.httpOptions);
  }
  
  deactivatePromo(kode_promo:string):Observable<any>{
    this.httpOptions=this.sessionService.getHeader();
    console.log(kode_promo);
    const url=environment.deletePromoUrl+'/'+kode_promo;
    console.log(url);

    return this.sharedService.requestConn("delete",url,{},this.httpheader)
    // return this.http.delete(url,this.httpOptions);
  }

}
