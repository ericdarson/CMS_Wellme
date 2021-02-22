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
export class ProductReksadanaService {
  httpOptions:any;
  httpHeader : HttpHeaders;
  constructor(private http:HttpClient,private sessionService:CheckSessionService,private sharedService : SharedService) {
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
    // return this.http.get(url,this.httpOptions);
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
  
  
  
  
  getProdukReksadana():Observable<any>{
    this.httpOptions=this.sessionService.getHeader();
    this.httpHeader = this.httpOptions.headers
    const url=environment.produkReksadanaUrl;
    console.log(url);  

    return this.sharedService.requestConn("get",url,{},this.httpHeader)
    // return this.http.get(url,this.httpOptions);
  }
  addProdukReksadana(nama_produk:string,id_jenis_reksadana:number,minimum_pembelian:number,expense_ratio:number,total_aum:number,manager_investasi:string,tingkat_resiko:string,level_resiko:number
    ,bank_kustodian:string,bank_penampung:string,url_vendor:string,password_vendor_md5:string,biaya_pembelian:number,minimum_sisa_unit:number,biaya_penjualan:number,url_fund_fact:string,minimal_penjualan:number):Observable<any>{
      this.httpOptions=this.sessionService.getHeader();
      this.httpHeader = this.httpOptions.headers
      const url=environment.produkReksadanaUrl;
      const body={
        "nama_produk": nama_produk,
        "id_jenis_reksadana": Number(id_jenis_reksadana),
        "minimum_pembelian": Number(minimum_pembelian),
        "expense_ratio": Number(expense_ratio),
        "total_aum": Number(total_aum),
        "manager_investasi": manager_investasi,
        "tingkat_resiko": tingkat_resiko,
        "level_resiko": Number(level_resiko),
        "bank_kustodian": bank_kustodian,
        "bank_penampung": bank_penampung,
        "url_vendor": url_vendor,
        "password_vendor_md5": password_vendor_md5,
        "biaya_pembelian": Number(biaya_pembelian),
        "minimum_sisa_unit":Number(minimum_sisa_unit),
        "biaya_penjualan":Number(biaya_penjualan),
        "url_fund_fact":url_fund_fact,
        "minimal_penjualan":Number(minimal_penjualan)
     };
      
      console.log(body);
      return this.sharedService.requestConn("post",url,body,this.httpHeader)
      // return this.http.post(url,body,this.httpOptions);
    }
    
    updateProdukReksadana(id_produk:string,nama_produk:string,id_jenis_reksadana:number,minimum_pembelian:number,expense_ratio:number,total_aum:number,manager_investasi:string,tingkat_resiko:string,level_resiko:number
      ,bank_kustodian:string,bank_penampung:string,url_vendor:string,password_vendor_md5:string,biaya_pembelian:number,minimum_sisa_unit:number,biaya_penjualan:number,url_fund_fact:string,minimal_penjualan:number):Observable<any>{
        this.httpOptions=this.sessionService.getHeader();
        this.httpHeader = this.httpOptions.headers
        const url=environment.produkReksadanaUrl+'/'+id_produk;
        const body={
          "nama_produk": nama_produk,
          "id_jenis_reksadana": Number(id_jenis_reksadana),
          "minimum_pembelian": Number(minimum_pembelian),
          "expense_ratio": Number(expense_ratio),
          "total_aum": Number(total_aum),
          "manager_investasi": manager_investasi,
          "tingkat_resiko": tingkat_resiko,
          "level_resiko": Number(level_resiko),
          "bank_kustodian": bank_kustodian,
          "bank_penampung": bank_penampung,
          "url_vendor": url_vendor,
          "password_vendor_md5": password_vendor_md5,
          "biaya_pembelian": Number(biaya_pembelian),
          "minimum_sisa_unit": Number(minimum_sisa_unit),
          "biaya_penjualan": Number(biaya_penjualan),
          "url_fund_fact": url_fund_fact,
          "minimal_penjualan":Number(minimal_penjualan)
          
        }
        
        console.log(body);
        
        return this.sharedService.requestConn("put",url,body,this.httpHeader)
        // return this.http.put(url,body,this.httpOptions);
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
    