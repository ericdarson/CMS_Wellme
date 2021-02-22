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

export class PromoService {
  httpOptions:any;
  httpHeader: HttpHeaders;
  constructor(private http:HttpClient ,private sessionService:CheckSessionService,private sharedService : SharedService) {
    this.httpOptions=this.sessionService.getHeader();
  }
   
   getPromoAkumulasi():Observable<any>{
    this.httpOptions=this.sessionService.getHeader();
    this.httpHeader = this.httpOptions.headers
     const url=environment.promoAkumulasiUrl;
     console.log(url);
     const request={
     }

    
     return this.sharedService.requestConn("get",url,{},this.httpHeader)
    //  return this.http.get(url,this.httpOptions);
   }
   addPromoAkumulasi(title:string,subtitle:string,start_date:string,end_date:string,description:string,cashback:number,target_akumulasi:number):Observable<any>{
    this.httpOptions=this.sessionService.getHeader();
    this.httpHeader = this.httpOptions.headers
    const url=environment.addAkumulasi;
    var start_date_formatted = new DatePipe('en-US').transform(start_date, 'dd-MM-yyyy');
    var end_date_formatted = new DatePipe('en-US').transform(end_date, 'dd-MM-yyyy');
    
    const body={
      'title':title,
      'subtitle':subtitle,
      'start_date':start_date_formatted,
      'end_date':end_date_formatted,
      'description':description,
      'cashback':cashback,
      'target_akumulasi':target_akumulasi
    }
   console.log(body);
    return this.sharedService.requestConn("post",url,body,this.httpHeader)
    // return this.http.post(url,body,this.httpOptions);
  }

  updatePromoAkumulasi(kode_promo:string,title:string,subtitle:string,start_date:string,end_date:string,description:string,cashback:number,target_akumulasi:number):Observable<any>{
    this.httpOptions=this.sessionService.getHeader();
    this.httpHeader = this.httpOptions.headers
    const url=environment.addAkumulasi+'/'+kode_promo;
    var start_date_formatted = new DatePipe('en-US').transform(start_date, 'dd-MM-yyyy');
    var end_date_formatted = new DatePipe('en-US').transform(end_date, 'dd-MM-yyyy');
    console.log(cashback,target_akumulasi);
    const body={
      'title':title,
      'subtitle':subtitle,
      'start_date':start_date_formatted,
      'end_date':end_date_formatted,
      'description':description,
      'cashback': cashback,
      'target_akumulasi':target_akumulasi
    }
   console.log(body);
   return this.sharedService.requestConn("put",url,body,this.httpHeader)
    // return this.http.put(url,body,this.httpOptions);
  }


  getPromoKode():Observable<any>{
    this.httpOptions=this.sessionService.getHeader();
    this.httpHeader = this.httpOptions.headers
    const url=environment.promoKodeUrl;
    console.log(url);
    const request={
    }

   
    return this.sharedService.requestConn("get",url,{},this.httpHeader)
    // return this.http.get(url,this.httpOptions);
  }
  addPromoKode(kodePromo:string,title:string,subtitle:string,start_date:string,end_date:string,description:string,cashback:number,minimum_transaksi:number):Observable<any>{
    this.httpOptions=this.sessionService.getHeader();
    this.httpHeader = this.httpOptions.headers
   const url=environment.addKode;
   var start_date_formatted = new DatePipe('en-US').transform(start_date, 'dd-MM-yyyy');
   var end_date_formatted = new DatePipe('en-US').transform(end_date, 'dd-MM-yyyy');
   
   const body={
     'kode_promo':kodePromo,
     'title':title,
     'subtitle':subtitle,
     'start_date':start_date_formatted,
     'end_date':end_date_formatted,
     'description':description,
     'cashback':cashback,
     'minimum_transaction':minimum_transaksi
   }
  console.log(body);
   
  return this.sharedService.requestConn("post",url,body,this.httpHeader)
  //  return this.http.post(url,body,this.httpOptions);
 }

 updatePromoKode(kode_promo:string,title:string,subtitle:string,start_date:string,end_date:string,description:string,cashback:number,minimum_transaksi:number):Observable<any>{
  this.httpOptions=this.sessionService.getHeader();
  this.httpHeader = this.httpOptions.headers
   const url=environment.addKode+'/'+kode_promo;
   var start_date_formatted = new DatePipe('en-US').transform(start_date, 'dd-MM-yyyy');
   var end_date_formatted = new DatePipe('en-US').transform(end_date, 'dd-MM-yyyy');
   const body={
    'kode_promo':kode_promo,
    'title':title,
    'subtitle':subtitle,
    'start_date':start_date_formatted,
    'end_date':end_date_formatted,
    'description':description,
    'cashback':cashback,
    'minimum_transaction':minimum_transaksi
  }
  console.log(body);
   
  
  return this.sharedService.requestConn("put",url,body,this.httpHeader)
  //  return this.http.put(url,body,this.httpOptions);
 }


  deactivatePromo(kode_promo:string):Observable<any>{
    this.httpOptions=this.sessionService.getHeader();
    this.httpHeader = this.httpOptions.headers
    console.log(kode_promo);
    const url=environment.deletePromoUrl+'/'+kode_promo;
    console.log(url);

    return this.sharedService.requestConn("delete",url,{},this.httpHeader)
    // return this.http.delete(url,this.httpOptions);
  }
}
