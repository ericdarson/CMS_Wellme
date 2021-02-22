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
  selector: 'app-histori-penjualan',
  templateUrl: './histori-penjualan.component.html',
  styleUrls: ['./histori-penjualan.component.css']
})
export class HistoriPenjualanComponent implements OnInit {

  isLogin="hidden";
  table:string='';
  submitFormMessage:string="";
  display:string='hidden';
  loader:string="flex";

  historiPenjualan:any=[];
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
role:string="";
  idJenis:string;
  namaJenis:string;
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
        {title:'NAB'},
        {title:'Jumlah Unit'},
        {title:'Total Nominal'},
        {title:'Tanggal Transaksi',class:'none'},
        {title:'Tanggal Verifikasi Bank',class:'none'},
        {title:'Tanggal Verifikasi Penjualan',class:'none'},
      ]
    ,
    responsive:true
      
    };
    
    
  }
  
  getHistoriPenjualan():void{
    
    this.historiTransaksiService.getHistoriPenjualan().subscribe((response:any)=>{
      this.historiPenjualan=response.output_schema;
      console.log(this.historiPenjualan);
      
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
        this.getHistoriPenjualan();
      }
      else{
        this.router.navigate(['/login'])
      }
    }, (error) => {
  
      this.router.navigate(['/login'])
    });
  }
  

}
