import { DatePipe } from '@angular/common';
import { stringify } from '@angular/compiler/src/util';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { SessionStorageService } from 'ngx-webstorage';

import { Subject } from 'rxjs';
import { CheckSessionService } from 'src/app/services/check-session.service';
import { LogoutService } from 'src/app/services/logout.service';
import { PromoService } from 'src/app/services/promo.service';

@Component({
  selector: 'app-promoakumulasi',
  templateUrl: './promoakumulasi.component.html',
  styleUrls: ['./promoakumulasi.component.css']
})
export class PromoakumulasiComponent implements OnInit {
  @Input() title:string="";
  @Input() subtitle:string="";
  @Input() start_date:string="";
  @Input() end_date:string="";
  @Input() description:string="";
  @Input() cashback:number=0;
  @Input() target_akumulasi:number=0;
  isLogin="hidden";
  table:string='';
  addPromoMessage:string="";
  display:string='hidden';
  loader:string="flex";
  kodePromo:string="";
  promo:any=[];
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
  constructor(private fb: FormBuilder, private promoService:PromoService,private router:Router, private session:SessionStorageService, private sessionService:CheckSessionService) {
  
  }
  
  ngOnInit(): void {
    this.checkSession();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      columns:[
  
        {title:'ID Promo'},
        {title:'Judul'},
        {title:'Subtitle',class:'none'},
        {title:'Tanggal Mulai'},
        {title:'Tanggal Selesai'},
        {title:'Deskripsi',class:'none'},
        {title:'Cashback'},
        {title:'Target Akumulasi'},
        {title:'Aktif Status'},
        {title:'Edit Promo'},
        {title:'Non Aktifkan'}

      ]
    ,responsive:true
    };
   
    
  }
  
  getPromoAkumulasi():void{
    
    this.promoService.getPromoAkumulasi().subscribe(response=>{
      this.promo=response.output_schema;
      console.log(this.promo);
      
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
      
    }, (err) => {
      this.display="block";
      this.loader="hidden";
      this.promo=err.output_schema;
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
        this.getPromoAkumulasi();
      }
      else{
        this.router.navigate(['/login'])
      }
    }, (error) => {
  
      this.router.navigate(['/login'])
    });
  }
  
  
  toggleAdd():void{
    this.formClass='block';
    this.formUpdateClass="hidden";
    this.resetForm();
    window.scroll(0,0);
  }
  
  addPromoAkumulasi(ngform:NgForm):void{
    
    
    if (ngform.valid && (new Date(this.start_date)<new Date(this.end_date))){
      if(confirm("Apakah Anda yakin akan Menambahkan Promo Akumulasi?")){
      this.display="hidden";
      this.loader="flex";
      this.formClass='hidden';
      
      this.promoService.addPromoAkumulasi(this.title,this.subtitle,this.start_date,this.end_date,this.description,this.cashback,this.target_akumulasi).subscribe(response=>{
        console.log(response);
        if(response.error_schema.error_code=="BIT-00-000")
        {
          this.alertMessage="Berhasil Menambahkan ";
          this.alert="block alert-success";
          
          
          this.getPromoAkumulasi();
        }
        else{
          this.alertMessage="[ERROR: "+response.error_schema.error_code+"] Gagal Menambahkan";
          this.alert="block alert-danger";
          this.getPromoAkumulasi();
        }
        this.resetForm();
        
      },(err) => {
        this.resetForm();
        this.alertMessage="[ERROR: "+err.error.error_schema.error_code+"] Gagal Menambahkan";
        this.alert="block alert-danger";
        this.getPromoAkumulasi();
        console.log('-----> err', err);
      });
    }
    else{
      alert("Membatalkan Transaksi...");
    }
    }
    else{
      this.addPromoMessage=this.validationMessage();
    }
    
    
  }
  
  updatePromoAkumulasi(ngform:NgForm):void{
    
    
    if (ngform.valid && (new Date(this.start_date)<new Date(this.end_date))){
      if(confirm("Apakah Anda yakin akan Mengubah Promo Akumulasi?")){
      this.display="hidden";
      this.loader="flex";
      this.formClass='hidden';
      this.formUpdateClass="hidden";
      var c=this.cashback;
      var t=this.target_akumulasi;
      this.promoService.updatePromoAkumulasi(this.kodePromo,this.title,this.subtitle,this.start_date,this.end_date,this.description,c,t).subscribe(response=>{
        console.log(response);
       
        if(response.error_schema.error_code=="BIT-00-000")
        {
          this.alertMessage="Berhasil Mengupdate ";
          this.alert="block alert-success";
          
          
          this.getPromoAkumulasi();
        }
        else{
          this.alertMessage="[ERROR: "+response.error_schema.error_code+"] Gagal Mengubah";
          this.alert="block alert-danger";
          this.getPromoAkumulasi();
        }
        this.resetForm();
        
      },(err) => {
        this.resetForm();
        this.alertMessage="[ERROR: "+err.error.error_schema.error_code+"] Gagal Mengubah";
        this.alert="block alert-danger";
        this.formClass="hidden";
        this.formUpdateClass="hidden";
        this.getPromoAkumulasi();
        console.log('-----> err', err);
      });
    }else{
      alert("Membatalkan Transaksi...");
    }
    }
    else{
      this.addPromoMessage=this.validationMessage();
    }
    
    
  }
  isActive(active:string):boolean{
    if(active=="1")
    {
      return true;
    }
    else{
      return false;
    }

  }
  deactivatePromoAkumulasi(kodePromo:string):void{

    if(confirm("Apakah Anda yakin akan menonaktifkan promo?"))
    {
      this.display="hidden";
      this.loader="flex";
      this.formClass='hidden';
      
      this.promoService.deactivatePromo(kodePromo).subscribe(response=>{
        console.log(response);
        if(response.error_schema.error_code=="BIT-00-000")
        {
          this.alertMessage="Berhasil Menonaktifkan";
          this.alert="block alert-success";
          this.getPromoAkumulasi();
        }
        else{
          this.alertMessage="[ERROR: "+response.error_schema.error_code+"] Gagal Menonaktifkan";
          this.alert="block alert-danger";
          this.getPromoAkumulasi();
        }
        this.resetForm();
        
      },(err) => {
        this.resetForm();
        this.alertMessage="[ERROR: "+err.error.error_schema.error_code+"] Gagal Menonaktifkan";
        this.alert="block alert-danger";
        this.getPromoAkumulasi();
        console.log('-----> err', err);
      });
    }
    else {
      alert("Membatalkan Transaksi..");
    }
     
    
  }

  validationMessage():string
  {
    var temp="";
    if (this.title=="")
    {
      temp+="Judul - ";
    }
    
    if (this.subtitle=="")
    {
      temp+="Subtitle - ";
    }
    if (this.start_date=="")
    {
      temp+="Tanggal Mulai Promo - ";
    }
    if (this.end_date=="")
    {
      temp+="Tanggal Akhir Promo - ";
    }
    if (this.cashback==0)
    {
      temp+="Cashback - ";
    }
    
    if (this.target_akumulasi==0)
    {
      temp+="Target Akumulasi - ";
      
    }
    if (this.description=="")
    {
      temp+="Deskripsi - ";
      
    }
    if(temp!="")
    {
      temp+="Tidak Boleh Kosong"
    }
    
    if (new Date(this.start_date)>new Date(this.end_date))
    {
      temp+="- Tanggal Mulai Tidak Bisa Lebih Besar dari tanggal Selesai"; 
    }
    return temp
  }

  onSelect(selectedItem: any) {
    console.log("Selected item : ", selectedItem);
    var parts=selectedItem.start_date.split('-');
    var parts2=selectedItem.end_date.split('-');
    var sf = new Date(parts[2], parts[1] - 1, parts[0]); 
    var ef= new Date(parts2[2], parts2[1] - 1, parts2[0]); 
    console.log(sf,ef);
    var start_date_formatted = new DatePipe('en-US').transform(sf, 'yyyy-MM-dd');
    var end_date_formatted = new DatePipe('en-US').transform(ef, 'yyyy-MM-dd');

    this.resetForm();
    this.formUpdateClass="block";
    this.formClass="hidden";
    this.kodePromo=selectedItem.kode_promo;
    this.title=selectedItem.title;
    this.subtitle=selectedItem.subtitle;
    this.start_date= start_date_formatted==null?"":start_date_formatted;
    this.end_date=end_date_formatted==null?"":end_date_formatted;
    this.description=selectedItem.description;
    this.cashback=Number(selectedItem.cashback);
    this.target_akumulasi=Number(selectedItem.target_akumulasi);
    window.scroll(0,0);
    
  }
  
  resetForm():void
  {
    this.title="";
    this.subtitle="";
    this.start_date="";
    this.end_date="";
    this.description="";
    this.cashback=0;
    this.target_akumulasi=0;
  }

  validateDate(promo:any):boolean{
    var parts=promo.start_date.split('-');
    var sf = new Date(parts[2], parts[1] - 1, parts[0]); 
    if(sf<new Date())
    {
      return false;
    }
    else{

      return true;
    }
  }
}
