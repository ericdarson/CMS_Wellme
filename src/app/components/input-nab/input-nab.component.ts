import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { SessionStorageService } from 'ngx-webstorage';
import { Subject } from 'rxjs';
import { CheckSessionService } from 'src/app/services/check-session.service';
import { InputNABService } from 'src/app/services/input-nab.service';
import { JenisReksadanaService } from 'src/app/services/jenis-reksadana.service';


@Component({
  selector: 'app-input-nab',
  templateUrl: './input-nab.component.html',
  styleUrls: ['./input-nab.component.css']
})
export class InputNABComponent implements OnInit {
  isLogin="hidden";
  table:string='';
  submitFormMessage:string="";
  display:string='hidden';
  loader:string="flex";

  jenisReksadana:any=[];
  tab:string=``;
  formClass:string='hidden';
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  isDtInitialized:boolean = false
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  alert:string="hidden";
  alertMessage:string="";
  alertClass:string="";
  formUpdateClass:string="hidden";
  dailyNab:any=[];
  idJenis:string;
  namaJenis:string;
  idProduk:number=0;
  nab:number=0;
  namaProduk:string="";
  role:string="";
  constructor(private dailyNabService:InputNABService,private fb: FormBuilder,private jenisReksadanaService:JenisReksadanaService,private router:Router, private session:SessionStorageService, private sessionService:CheckSessionService) {
  
  }
  
  ngOnInit(): void {
    this.checkSession();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      
    };
  
    
  }
  
  getDailyNab():void{
    this.display="hidden";
    this.loader="block";
    this.formClass="hidden";
    this.formUpdateClass="hidden";
    this.dailyNabService.getDailyNab(this.idJenis).subscribe((response:any)=>{
      this.dailyNab=response.output_schema;
      
      
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


  getJenisReksadana():void{
    
    this.jenisReksadanaService.getJenisReksadana().subscribe((response:any)=>{
      this.jenisReksadana=response.output_schema;
      console.log(this.jenisReksadana);
      
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
        this.getJenisReksadana();
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
  
  addJenisReksadana(ngform:NgForm):void{
    
    
    if (ngform.valid){
      this.display="hidden";
      this.loader="flex";
      this.formClass='hidden';
      
      this.jenisReksadanaService.addJenisReksadana(this.namaJenis).subscribe(response=>{
        console.log(response);
        if(response.error_schema.error_code=="BIT-00-000")
        {
          this.alertMessage="Berhasil Menambahkan ";
          this.alert="block alert-success";
          
          
          this.getJenisReksadana();
        }
        else{
          this.alertMessage="[ERROR: "+response.error_schema.error_code+"] Gagal Menambahakan";
          this.alert="block alert-danger";
          this.getJenisReksadana();
        }
        this.resetForm();
        
      },(err:any) => {
        this.resetForm();
        this.alertMessage="[ERROR: "+err.error.error_schema.error_code+"] Gagal Menambahkan";
        this.alert="block alert-danger";
        this.formClass="hidden";
        this.formUpdateClass="hidden";
        this.getJenisReksadana();
        console.log('-----> err', err);
      });
      
    }
    else{
      this.submitFormMessage=this.validationMessage();
    }
    
    
  }
  
  updateDailyNab(ngform:NgForm):void{

    
    if (ngform.valid && this.nab>=0){
      if(confirm("Apakah Anda yakin akan Menambahkan Daily NAB?")){
      this.display="hidden";
      this.loader="flex";
      this.formClass='hidden';
      console.log("hitted");
      this.dailyNabService.updateDailyNab(this.idProduk,this.nab).subscribe(response=>{
        if(response.error_schema.error_code=="BIT-00-000")
        {
          this.alertMessage="Berhasil Mengubah ";
          this.alert="block alert-success";
          this.getDailyNab();
        }
        else{
          this.alertMessage="[ERROR: "+response.error_schema.error_code+"] Gagal Mengubah";
          this.alert="block alert-danger";
          this.getDailyNab();
        }
        this.resetForm();
      },(err:any) => {
        this.resetForm();
        this.alertMessage="[ERROR: "+err.error.error_schema.error_code+"] Gagal Mengubah";
        this.alert="block alert-danger";
        this.formClass="hidden";
        this.formUpdateClass="hidden";
        this.getDailyNab();
        console.log('-----> err', err);
      });
    }
    else{
      alert("Membatalkan Transaksi");
    }
    }
    else{
      this.submitFormMessage=this.validationMessage();
    }
    
  
    
  }


  validationMessage():string
  {
    
    var temp="";
    if (this.idProduk==0){
      temp+="id Produk Tidak Boleh Kosong"
    }   
    if (this.nab==0)
    {
      temp+="- NAB tidak boleh 0"; 
    }
    if(this.nab<0)
    {
      temp+="Nab Tidak Boleh Minus (-)"
    }
    return temp
  }

  onSelect(selectedItem: any) {
  
    this.resetForm();
    this.formUpdateClass="block";
    this.formClass="hidden";
    this.idProduk=selectedItem.id_produk;
    this.namaProduk=selectedItem.nama_produk;
    
    window.scroll(0,0);
  }
  
  resetForm():void
  {
    this.idProduk=0;
    this.nab=0;
  }
}
