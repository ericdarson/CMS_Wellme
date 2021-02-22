import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { SessionStorageService } from 'ngx-webstorage';
import { Subject } from 'rxjs';
import { CheckSessionService } from 'src/app/services/check-session.service';
import { PromoService } from 'src/app/services/promo.service';
@Component({
  selector: 'app-promokode',
  templateUrl: './promokode.component.html',
  styleUrls: ['./promokode.component.css']
})
export class PromokodeComponent implements OnInit {
  @Input() title:string="";
  @Input() subtitle:string="";
  @Input() start_date:string="";
  @Input() end_date:string="";
  @Input() description:string="";
  @Input() cashback:number=0;
  @Input() minimum_transaksi:number=0;
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
      columns:[ {title:'ID Promo'},
      {title:'Judul'},
      {title:'Subtitle',class:'none'},
      {title:'Tanggal Mulai'},
      {title:'Tanggal Selesai'},
      {title:'Deskripsi',class:'none'},
      {title:'Cashback'},
      {title:'Minimum Transaksi'},
      {title:'Aktif Status'},
      {title:'Edit Promo'},
      {title:'Non Aktifkan'}
    ]
    ,responsive:true
  };
 
  
}

getPromoKode():void{
  
  this.promoService.getPromoKode().subscribe(response=>{
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
      this.getPromoKode();
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

addPromoKode(ngform:NgForm):void{
  

  if (ngform.valid && this.kodePromoValid() && (new Date(this.start_date)<new Date(this.end_date))){
    if(confirm("Apakah Anda yakin akan Menambahkan Promo Transaksi?")){
      this.display="hidden";
      this.loader="flex";
      this.formClass='hidden';
      
      this.promoService.addPromoKode(this.kodePromo.toUpperCase(),this.title,this.subtitle,this.start_date,this.end_date,this.description,this.cashback,this.minimum_transaksi).subscribe(response=>{
        console.log(response);
        if(response.error_schema.error_code=="BIT-00-000")
        {
          this.alertMessage="Berhasil Menambahkan ";
          this.alert="block alert-success";
          
          
          this.getPromoKode();
        }
        else{
          this.alertMessage="[ERROR: "+response.error_schema.error_code+"] Gagal Menambahkan";
          this.alert="block alert-danger";
          this.getPromoKode();
        }
        this.resetForm();
        
      },(err) => {
        this.resetForm();
        this.alertMessage="[ERROR: "+err.error.error_schema.error_code+"] Gagal Menambahkan";
        this.alert="block alert-danger";
        this.getPromoKode();
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

updatePromoKode(ngform:NgForm):void{
  
  
  if (ngform.valid && this.kodePromoValid() && (new Date(this.start_date)<new Date(this.end_date))){
    if(confirm("Apakah Anda yakin akan Mengubah Promo Transaksi?")){
      this.display="hidden";
      this.loader="flex";
      this.formClass='hidden';
      this.formUpdateClass="hidden";
      var c=this.cashback;
      var t=this.minimum_transaksi;
      this.promoService.updatePromoKode(this.kodePromo.toUpperCase(),this.title,this.subtitle,this.start_date,this.end_date,this.description,c,t).subscribe(response=>{
        console.log(response);
        
        if(response.error_schema.error_code=="BIT-00-000")
        {
          this.alertMessage="Berhasil Mengupdate ";
          this.alert="block alert-success";
          
          
          this.getPromoKode();
        }
        else{
          this.alertMessage="[ERROR: "+response.error.error_schema.error_code+"] Gagal Mengubah";
          this.alert="block alert-danger";
          this.getPromoKode();
        }
        this.resetForm();
        
      },(err) => {
        this.resetForm();
        this.alertMessage="[ERROR: "+err.error.error_schema.error_code+"] Gagal Mengubah";
        this.alert="block alert-danger";
        this.formClass="hidden";
        this.formUpdateClass="hidden";
        this.getPromoKode();
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
deactivatePromo(kodePromo:string):void{
  
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
        this.getPromoKode();
      }
      else{
        this.alertMessage="[ERROR: "+response.error_schema.error_code+"] Gagal Menonaktifkan";
        this.alert="block alert-danger";
        this.getPromoKode();
      }
      this.resetForm();
      
    },(err) => {
      this.resetForm();
      this.alertMessage="[ERROR: "+err.error.error_schema.error_code+"] Gagal Menonaktifkan";
      this.alert="block alert-danger";
      this.getPromoKode();
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
  if (this.kodePromo==""){
    temp+="Kode Promo -"
  }
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
  if (this.description=="")
  {
    temp+="Deskripsi - ";
    
  }
  if (this.minimum_transaksi==0)
  {
    temp+="Target kode - ";
    
  }
  if(temp!="")
  {
    temp+="Tidak Boleh Kosong"
  }
  
  if (new Date(this.start_date)>new Date(this.end_date))
  {
    temp+="- Tanggal Mulai Tidak Bisa Lebih Besar dari tanggal Selesai"; 
  }
  if (this.kodePromo.length>10)
  {
    temp+="- Panjang Kode Promo Tidak boleh lebih dari 10"; 
  }
  if (this.kodePromoValid()==false)
  {
    temp+="- Kode Promo Hanya Boleh Berisi Huruf dan Angka"; 
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
  this.minimum_transaksi=selectedItem.minimum_transaction;
  this.cashback=Number(selectedItem.cashback);
  this.minimum_transaksi=Number(selectedItem.minimum_transaction);
  window.scroll(0,0);
  
}

resetForm():void
{
  this.kodePromo="";
  this.title="";
  this.subtitle="";
  this.start_date="";
  this.end_date="";
  this.description="";
  this.cashback=0;
  this.minimum_transaksi=0;
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


kodePromoValid():boolean{
  if(this.kodePromo.match("^[A-Za-z0-9]+$")==null)
  {
    return false;
    
  }
  else{
    return true;
  }
}

}
