import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { SessionStorageService } from 'ngx-webstorage';

import { Subject } from 'rxjs';
import { CheckSessionService } from 'src/app/services/check-session.service';
import { JenisReksadanaService } from 'src/app/services/jenis-reksadana.service';
import { environment } from 'src/environments/environment';
import { Md5 } from 'ts-md5';
import { ProductReksadanaService } from '../../services/product-reksadana.service';

@Component({
  selector: 'app-product-reksadana',
  templateUrl: './product-reksadana.component.html',
  styleUrls: ['./product-reksadana.component.css']
})
export class ProductReksadanaComponent implements OnInit {
  
  @Input() title:string="";
  @Input() subtitle:string="";
  @Input() start_date:string="";
  @Input() end_date:string="";
  @Input() description:string="";
  @Input() cashback:number=0;
  @Input() target_akumulasi:number=0;
  isLogin="hidden";
  table:string='';
  addMessage:string="";
  display:string='hidden';
  loader:string="flex";
  kodePromo:string="";
  produkReksadana:any=[];
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
  nama_produk:string="";
  id_jenis_reksadana:number=0;
  minimum_pembelian:number=0;
  expense_ratio:number=0;
  total_aum:number=0;
  manager_investasi:string="";
  tingkat_resiko:string="";
  level_resiko:number=0;
  bank_kustodian:string="";
  bank_penampung:string="";
  url_vendor:string="";
  password_vendor_md5:string="";
  id_reksadana:string="";
  biaya_pembelian:number=0;
  minimum_sisa_unit:number=0;
  biaya_penjualan:number=0;
  minimal_penjualan:number=0;
  jenisReksadana:any={};
  role:string="";
  url_fund_fact:string="";
  constructor(private http:HttpClient,private jenisReksadanaService:JenisReksadanaService,private fb: FormBuilder, private reksadanaService:ProductReksadanaService,private router:Router, private session:SessionStorageService, private sessionService:CheckSessionService) {
    
  }
  
  ngOnInit(): void {
    this.checkSession();
   
    
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      
      columns:[
        
        {title:'Id Reksadana',data:'id_reksadana'},
        {title:'Nama Reksadana',data:'nama_reksadana'},
        {title:'NAB'},
        {title:'Minimum Pembelian',class:'none'},
        {title:'Expense Ratio', class: 'none'},
        {title:'Total Aum',data:'total_aum',class: 'none'},
        {title:'Manager Investasi',class:'none'},
        {title:'Resiko'},
        {title:'Level Resiko',class:'none'},
        {title:'Bank Kustodian',class:'none'},
        {title:'Bank Penampung',class:'none'},
        {title:'Kinerja Satu Minggu',class:'none'},
        {title:'Kinerja Satu Bulan',class:'none'},
        {title:'Kinerja Satu Tahun',class:'none'},
        {title:'Id Jenis Reksadana',class:'none'},
        {title:'Nama Jenis Reksadana',class:'none'},
        {title:'URL Prospektus',class:'none'},
        {title:'URL Fund Fact',class:'none'},
        {title:'Password Vendor',class:'none'},
        {title:'Biaya Pembelian',class:'none'},
        {title:'Minimum Sisa Unit',class:'none'},
        {title:'Biaya Penjualan',class:'none'},
        {title:'Minimum Penjualan',class:'none'},
        {title:'Edit'},
        
      ]
      ,responsive:true
      
    };
    
    
    
  }
  
  getProdukReksadana():void{
    
    this.reksadanaService.getProdukReksadana().subscribe(response=>{
      this.produkReksadana=response.output_schema;
      console.log(this.produkReksadana);
      
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
  
  addProdukReksadana(ngform:NgForm):void{
    
    
    if (ngform.valid  && this.biaya_pembelian>=0 && this.total_aum>=0 && this.minimum_sisa_unit>=0 &&  this.minimum_pembelian>=0 && this.biaya_penjualan>=0 && this.minimal_penjualan>=0 && this.url_fund_fact!="" && this.url_vendor!=""){
      if(confirm("Apakah Anda yakin akan Menambahkan Produk Reksadana?")){
      this.addMessage="";
      console.log(this.nama_produk,this.id_jenis_reksadana,this.minimum_pembelian,this.expense_ratio,this.total_aum,this.manager_investasi,this.tingkat_resiko,this.level_resiko
        ,this.bank_kustodian,this.bank_penampung,this.url_vendor,this.password_vendor_md5,this.biaya_pembelian);
        this.level_resiko==1?this.tingkat_resiko="Rendah":this.level_resiko==2?this.tingkat_resiko="Sedang":this.tingkat_resiko="Tinggi";
        
        this.display="hidden";
        this.loader="flex";
        this.formClass='hidden';
        const md5 = new Md5();
        var password:any=md5.appendStr(this.password_vendor_md5).end().toString();
        this.reksadanaService.addProdukReksadana(this.nama_produk,this.id_jenis_reksadana,this.minimum_pembelian,this.expense_ratio,this.total_aum,this.manager_investasi,this.tingkat_resiko,this.level_resiko
          ,this.bank_kustodian,this.bank_penampung,this.url_vendor,password,this.biaya_pembelian,this.minimum_sisa_unit,this.biaya_penjualan,this.url_fund_fact,this.minimal_penjualan).subscribe(response=>{
            console.log(response);
            if(response.error_schema.error_code=="BIT-00-000")
            {
              this.alertMessage="Berhasil Menambahkan ";
              this.alert="block alert-success";
              
              
              this.getProdukReksadana();
            }
            else{
              this.alertMessage="[ERROR: "+response.error_schema.error_code+"] Gagal Menambahkan";
              this.alert="block alert-danger";
              this.getProdukReksadana();
            }
            this.resetForm();
            
          },(err) => {
            this.resetForm();
            this.alertMessage="[ERROR: "+err.error.error_schema.error_code+"] Gagal Menambahkan";
            this.alert="block alert-danger";
            this.getProdukReksadana();
            
            console.log('-----> err', err);
          });
        }else{
          alert("Membatalkan Transaksi");
        }
        }
        else{
          this.addMessage=this.validationMessage();
        }
        
        
      }
      
      updateProdukReksadana(ngform:NgForm):void{
        
        
        if (ngform.valid  && this.biaya_pembelian>=0 && this.total_aum>=0 && this.minimum_sisa_unit>=0 && this.minimum_pembelian>=0 && this.biaya_penjualan>=0 && this.biaya_penjualan>=0 && this.minimal_penjualan>=0 && this.url_fund_fact!="" && this.url_vendor!=""){
          console.log(this.minimal_penjualan);
          
          if(confirm("Apakah Anda yakin akan Mengubah Produk Reksadana?")){
          this.addMessage="";
          this.display="hidden";
          this.loader="flex";
          this.formClass='hidden';
          this.formUpdateClass="hidden";
          this.level_resiko==1?this.tingkat_resiko="Rendah":this.level_resiko==2?this.tingkat_resiko="Sedang":this.tingkat_resiko="Tinggi";
          const md5 = new Md5();
          var password:any=md5.appendStr(this.password_vendor_md5).end().toString();
          this.reksadanaService.updateProdukReksadana(this.id_reksadana,this.nama_produk,this.id_jenis_reksadana,this.minimum_pembelian,this.expense_ratio,this.total_aum,this.manager_investasi,this.tingkat_resiko,this.level_resiko
            ,this.bank_kustodian,this.bank_penampung,this.url_vendor,password,this.biaya_pembelian,this.minimum_sisa_unit,this.biaya_penjualan,this.url_fund_fact,this.minimal_penjualan).subscribe(response=>{
              console.log(response);
              
              if(response.error_schema.error_code=="BIT-00-000")
              {
                this.alertMessage="Berhasil Mengupdate ";
                this.alert="block alert-success";
                
                
                this.getProdukReksadana();
              }
              else{
                this.alertMessage="[ERROR: "+response.error_schema.error_code+"] Gagal Mengubah";
                this.alert="block alert-danger";
                this.getProdukReksadana();
              }
              this.resetForm();
              
            },(err) => {
              this.resetForm();
              this.alertMessage="[ERROR: "+err.error.error_schema.error_code+"] Gagal Mengubah";
              this.alert="block alert-danger";
              this.formClass="hidden";
              this.formUpdateClass="hidden";
              this.getProdukReksadana();
              console.log('-----> err', err);
            });
          }else{
            alert("Membatalkan Transaksi...");
          }
          }
          else{
            this.addMessage=this.validationMessage();
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
          
          if(confirm("Apakah Anda yakin akan menonaktifkan produk reksadana?"))
          {
            this.display="hidden";
            this.loader="flex";
            this.formClass='hidden';
            
            this.reksadanaService.deactivatePromo(kodePromo).subscribe(response=>{
              console.log(response);
              if(response.error_schema.error_code=="BIT-00-000")
              {
                this.alertMessage="Berhasil Menonaktifkan";
                this.alert="block alert-success";
                this.getProdukReksadana();
              }
              else{
                this.alertMessage="[ERROR: "+response.error_schema.error_code+"] Gagal Menonaktifkan";
                this.alert="block alert-danger";
                this.getProdukReksadana();
              }
              this.resetForm();
              
            },(err) => {
              this.resetForm();
              this.alertMessage="[ERROR: "+err.error.error_schema.error_code+"] Gagal Menonaktifkan";
              this.alert="block alert-danger";
              this.getProdukReksadana();
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
          if (this.nama_produk=="")
          {
            temp+="Nama Produk - ";
          }
          
          if (this.id_jenis_reksadana==0)
          {
            temp+="Id Jenis Reksadana - ";
          }
          if (this.manager_investasi=="")
          {
            temp+="Manager Investasi - ";
          }
          
          if (this.tingkat_resiko=="")
          {
            temp+="Tingkat Resiko - ";
            
          }
          if(this.level_resiko==0)
          {
            temp+="Level Resiko -"
          }
          if (this.bank_kustodian=="")
          {
            temp+="Bank Kustodian - ";
            
          }
          if (this.bank_penampung=="")
          {
            temp+="Bank Penampung - ";
            
          }
          if (this.url_vendor=="")
          {
            temp+="URL PROSPEKTUS - ";
            
          }
          if (this.url_fund_fact=="")
          {
            temp+="URL Fund Fact - ";
            
          }
          if(temp!="")
          {
            temp+="Tidak Boleh Kosong "
          }
          
          if (this.biaya_pembelian<0 ||String(this.biaya_pembelian)==""||this.biaya_pembelian==null)
          {
            temp+="- Biaya Pembelian Tidak Boleh Minus atau Kosong";
            
          }
          if (this.biaya_penjualan<0 ||String(this.biaya_penjualan)=="" ||this.biaya_penjualan==null)
          {
            temp+="- Biaya Penjualan Tidak Boleh Minus atau Kosong";
            
          }
          if (this.minimum_sisa_unit<0 ||String(this.minimum_sisa_unit)=="" ||this.minimum_sisa_unit==null)
          {
            temp+="- Minimum Sisa Unit Tidak Boleh Minus atau Kosong";
            
          }
          if (this.minimum_pembelian<0 ||String(this.minimum_pembelian)=="" ||this.minimum_pembelian==null)
          {
            temp+="- Minimum Pembelian Tidak Boleh Minus atau Kosong";
            
          }
          if (this.minimal_penjualan<0 ||String(this.minimal_penjualan)=="" ||this.minimal_penjualan==null)
          {
            temp+="- Minimum Penjualan Tidak Boleh Minus atau Kosong";
            
          }
          return temp
        }
        
        onSelect(selectedItem: any) {
          console.log("Selected item : ", selectedItem);
          
          this.resetForm();
          this.formUpdateClass="block";
          this.formClass="hidden";
          this.id_reksadana=selectedItem.id_reksadana;
          this.nama_produk=selectedItem.nama_reksadana;
          this.id_jenis_reksadana=selectedItem.id_jenis_reksadana;
          this.minimum_pembelian=selectedItem.minimum_pembelian;
          this.expense_ratio=selectedItem.expense_ratio;
          this.total_aum=selectedItem.total_aum;
          this.manager_investasi=selectedItem.manager_investasi;
          this.tingkat_resiko=selectedItem.tingkat_resiko;
          this.level_resiko=selectedItem.level_resiko;
          this.bank_kustodian=selectedItem.bank_kustodian;
          this.bank_penampung=selectedItem.bank_penampung;
          this.url_vendor=selectedItem.url_vendor;
          this.password_vendor_md5="";
          this.biaya_pembelian=selectedItem.biaya_pembelian;
          this.minimum_sisa_unit=selectedItem.minimum_sisa_unit;
          this.biaya_penjualan=selectedItem.biaya_penjualan;
          this.url_fund_fact=selectedItem.url_fund_fact;
          this.minimal_penjualan=selectedItem.minimal_penjualan;
          window.scroll(0,0);
          
        }
        
        resetForm():void
        {
          this.nama_produk="";
          this.id_jenis_reksadana=0;
          this.minimum_pembelian=0;
          this.expense_ratio=0;
          this.total_aum=0;
          this.manager_investasi="";
          this.tingkat_resiko="";
          this.level_resiko=0;
          this.bank_kustodian="";
          this.bank_penampung="";
          this.url_vendor="";
          this.password_vendor_md5="";
          this.biaya_pembelian=0;
          this.minimum_sisa_unit=0;
          this.url_fund_fact="";
          this.biaya_penjualan=0;
          this.minimal_penjualan=0;
        }
        
        validateDate(produkReksadana:any):boolean{
          var parts=produkReksadana.start_date.split('-');
          var sf = new Date(parts[2], parts[1] - 1, parts[0]); 
          if(sf<new Date())
          {
            return false;
          }
          else{
            
            return true;
          }
        }
        
        
        getJenisReksadana():void{
          
          this.jenisReksadanaService.getJenisReksadana().subscribe((response:any)=>{
            this.jenisReksadana=response.output_schema;

            this.getProdukReksadana();
          }, (err:any) => {
            console.log('-----> err', err);
          });
        }
        
        
        uploadPropektus(event:any) {
          this.url_vendor="";
          let fileList: FileList = event.target.files;
          if(fileList.length > 0) {
            let file: File = fileList[0];
            let formData:FormData = new FormData();
            formData.append('file', file, file.name);
            let headers = new HttpHeaders({
             
              'Access-Control-Allow-Headers': 'Content-Type',
              'Access-Control-Allow-Methods': 'POST, OPTIONS, GET, PUT',
              'Access-Control-Allow-Origin': '*',
              'Identity':'ead9c8c86bab17493373b8bf4434c8ca',
              'Enctype':'multipart/form-data',
              'Accept':'application/json'
          
            });
            /** In Angular 5, including the header Content-Type can invalidate your request */
           // headers.append('Content-Type', 'multipart/form-data');
            this.http.post(environment.uploadProspektusUrl, formData, {headers:headers}).subscribe(
            (response:any)=>{
              this.url_vendor=response.output_schema.file_name
              
            },(error)=>{
              this.addMessage="Error Mengupload File Prospektus"
            }
            )
            
          }
        }
        uploadFundFact(event:any) {
          this.url_fund_fact="";
          let fileList: FileList = event.target.files;
          if(fileList.length > 0) {
            let file: File = fileList[0];
            let formData:FormData = new FormData();
            formData.append('file', file, file.name);
            let headers = new HttpHeaders({
             
              'Access-Control-Allow-Headers': 'Content-Type',
              'Access-Control-Allow-Methods': 'POST, OPTIONS, GET, PUT',
              'Access-Control-Allow-Origin': '*',
              'Identity':'ead9c8c86bab17493373b8bf4434c8ca',
              'Enctype':'multipart/form-data',
              'Accept':'application/json'
          
            });
            /** In Angular 5, including the header Content-Type can invalidate your request */
           // headers.append('Content-Type', 'multipart/form-data');
            this.http.post(environment.uploadfundFactUrl, formData, {headers:headers}).subscribe(
            (response:any)=>{
              this.url_fund_fact=response.output_schema.file_name
            },(error)=>{
              this.addMessage="Error Mengupload File Fund Fact";
            }
            )
            
          }
        }
      }
      