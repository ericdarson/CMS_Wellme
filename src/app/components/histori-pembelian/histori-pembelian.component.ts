import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { SessionStorageService } from 'ngx-webstorage';
import { Subject } from 'rxjs';
import { CheckSessionService } from 'src/app/services/check-session.service';
import { HistoriTransaksiService } from 'src/app/services/histori-transaksi.service';
import { JenisReksadanaService } from 'src/app/services/jenis-reksadana.service';

@Component({
  selector: 'app-histori-pembelian',
  templateUrl: './histori-pembelian.component.html',
  styleUrls: ['./histori-pembelian.component.css']
})
export class HistoriPembelianComponent implements OnInit {
  isLogin="hidden";
  table:string='';
  submitFormMessage:string="";
  display:string='hidden';
  loader:string="flex";

  historiPembelian:any=[];
  tab:string=``;
  formClass:string='hidden';
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  isDtInitialized:boolean = false
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  alert:string="hidden";
  alertMessage:string="";
  alertClass:string="";
  formUpdateClass:string="hidden";

  idJenis:string;
  namaJenis:string;
  role:string="";
  constructor(private fb: FormBuilder,private historiTransaksiService:HistoriTransaksiService,private router:Router, private session:SessionStorageService, private sessionService:CheckSessionService) {
  
  }
  
  ngOnInit(): void {
    this.checkSession();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      columns:[
        {title:'Id Transaksi'},
        {title:'BCA Id'},
        {title:'Nama Nasabah'},
        {title:'Email Nasabah'},
        {title:'Id Produk'},
        {title:'Nama Produk'},
        {title:'Id Plan', class: 'none'},
        {title:'Nama Plan',class: 'none'},
        {title:'Status Transaksi',class:'none'},
        {title:'Kode Promo', class:'none'},
        {title:'NAB'},
        {title:'Jumlah Unit'},
        {title:'Total Nominal'},
        {title:'Tanggal Transaksi',class:'none'},
        {title:'Tanggal Verifikasi Bank',class:'none'},
        {title:'Tanggal Verifikasi Pembelian',class:'none'},
      ]
    ,
    responsive:true
      
    };
 
    
  }
  
  getHistoriPembelian():void{
    
    this.historiTransaksiService.getHistoriPembelian().subscribe((response:any)=>{
      this.historiPembelian=response.output_schema;
      console.log(this.historiPembelian);
      
      if (this.isDtInitialized) {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
      } else {
        this.isDtInitialized = true
        this.dtTrigger.next();
      }
      
      this.display="block";
      this.loader="hidden";
      this.formClass="hidden";
      this.formUpdateClass="hidden";
    }, (err:any) => {
      console.log('-----> err', err);
    });
  }
  
  checkSession():void{

    this.sessionService.checkSession().subscribe(response=> {
      if(response.output_schema.session.message=="SUKSES"){
        this.role=response.output_schema.session.role;
        this.role!="ADMIN"?this.router.navigate(['/']):null;
        this.isLogin="block";
        this.session.store("username",response.output_schema.session.username);
        this.session.store("token",response.output_schema.session.new_token);
        this.getHistoriPembelian();
      }
      else{
        this.router.navigate(['/login'])
      }
    }, (error) => {
  
      this.router.navigate(['/login'])
    });
  }
  
  
}
