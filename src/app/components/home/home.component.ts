import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ɵConsole } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { CheckSessionService } from 'src/app/services/check-session.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { Output, EventEmitter } from '@angular/core';
declare var jQuery: any;
declare var Chartist:any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [DatePipe]
})
export class HomeComponent implements OnInit {
  @Input() start_date:string|null;
  @Input() end_date:string|null;
  @Input() chart_type:string='daily';
  role:string="";
  xAxis:any=[];
  yAxisPembelian:any=[];
  yAxisPenjualan:any=[];
  display:string="hidden";
  user:string="";
  newUser:string="";
  jumlahInvestasi:string="";
  loader:string="flex";
  newPlanner:string="";
  nowDate = new Date();
  isLogin="hidden";
  total_penjualan=0;
  percentage_total_penjualan=0;
  iconTotalPenjualan="";
  total_asset=0;
  percentage_total_asset=0;
  iconTotalAsset="";
  promoObjective:any=[];
  promoKode:any=[];
  xAxisObjectives:any=[];
  yAxisObjectives:any=[];
  xAxisKode:any=[];
  yAxisKode:any=[];
  total_asset_periode_sebelumnya:number=0;
  constructor(private datePipe: DatePipe,private session:SessionStorageService,private router:Router, private sessionService:CheckSessionService,private dashboardService:DashboardService) {
    
    this.end_date = this.datePipe.transform(this.nowDate, 'yyyy-MM-dd');
    this.start_date=this.datePipe.transform(this.nowDate.setDate(this.nowDate.getDate()  -7 ), 'yyyy-MM-dd');
    
  }
  
  
  checkSession():void{

    this.sessionService.checkSession().subscribe(response=> {
      if(response.output_schema.session.message=="SUKSES"){
        this.role=response.output_schema.session.role;
        
        this.isLogin="block";
        this.session.store("username",response.output_schema.session.username);
        this.session.store("token",response.output_schema.session.new_token);
        
        this.renderOverview();
      }
      else{
        this.router.navigate(['/login'])
      }
    }, (error) => {
  
      this.router.navigate(['/login'])
    });
  }
  
  ngOnInit(): void {    
    this.checkSession();
  }

  resetOverview():void{
    
    this.xAxis=[];
    this.yAxisPembelian=[];
    this.yAxisPenjualan=[];
    this.loader="flex";
    this.display="hidden";``
  }
  renderOverview():void{
    this.resetOverview();
    this.dashboardService.getDashboard(this.chart_type,this.datePipe.transform(this.start_date, 'dd-MM-yyyy'),this.datePipe.transform(this.end_date, 'dd-MM-yyyy')).subscribe(response=> {
     
      this.user=response.output_schema.user;
      this.newUser=response.output_schema.new_user;
      this.jumlahInvestasi=response.output_schema.jumlah_investasi;
      this.newPlanner=response.output_schema.new_planner;
      console.log(response);
      response.output_schema.chart_pembelian!=null?response.output_schema.chart_pembelian.forEach((element:any)=> {
        this.xAxis.push(element.date);
        this.yAxisPembelian.push(element.value);
      }):null;
      response.output_schema.chart_penjualan!=null?response.output_schema.chart_penjualan.forEach((element:any)=> {
        
        this.yAxisPenjualan.push(element.value);
      }):null;
      jQuery.xAxis=this.xAxis;
      jQuery.yAxisPembelian=this.yAxisPembelian;
      jQuery.yAxisPenjualan=this.yAxisPenjualan;
      
      (function($){
        var data, options;
        // headline charts
        data = {
          labels: jQuery.xAxis,
          series: [
            jQuery.yAxisPembelian,
            jQuery.yAxisPenjualan,
            
          ]
        };
        
        options = {
          height: 300,
          showArea: false,
          showLine: true,
          showPoint: true,
          fullWidth: true,
          axisX: {
            showGrid: false
          },
          lineSmooth: false,
        };
        
        new Chartist.Line('#headline-chart', data, options);
         
      }(jQuery));  

      this.calculateDashboardOverview();

      this.display="block"
      this.loader="hidden";
      this.renderPromoChart()
    }, (error) => {
      console.log('error -->',error);
    });

    
  
  }

  reRenderOverview():void{
    this.renderOverview();
  }


  calculateDashboardOverview():void{
    var lastItemPembelian = this.yAxisPembelian.slice(-1)[0]==undefined||this.yAxisPembelian.slice(-1)[0]==null?0:this.yAxisPembelian.slice(-1)[0];
    var lastItemPenjualan = this.yAxisPenjualan.slice(-1)[0]==undefined||this.yAxisPenjualan.slice(-1)[0]==null?0:this.yAxisPenjualan.slice(-1)[0];
    var penjualanPeriodeSebelumnya=this.yAxisPembelian.slice(-2)[0]==undefined||this.yAxisPembelian.slice(-2)[0]==null?0:this.yAxisPembelian.slice(-2)[0];
    var transaksiJualPeriodeSebelumnya=this.yAxisPenjualan.slice(-2)[0]==undefined||this.yAxisPenjualan.slice(-2)[0]==null?0:this.yAxisPenjualan.slice(-2)[0];

lastItemPembelian=lastItemPembelian==undefined?0:lastItemPembelian;
lastItemPenjualan=lastItemPenjualan==undefined?0:lastItemPenjualan;

//fa fa-caret-up text-success
//fa fa-caret-down text-danger
this.total_penjualan=lastItemPembelian;


penjualanPeriodeSebelumnya=penjualanPeriodeSebelumnya==undefined||penjualanPeriodeSebelumnya==null?this.total_penjualan*100:penjualanPeriodeSebelumnya;

this.percentage_total_penjualan = (-(penjualanPeriodeSebelumnya/(this.total_penjualan==0?1:this.total_penjualan))+1)*100;
this.percentage_total_penjualan>=0?this.iconTotalPenjualan="fa fa-caret-up text-success":this.iconTotalPenjualan="fa fa-caret-down text-danger";
this.percentage_total_penjualan=Math.round(this.percentage_total_penjualan * 100) / 100

this.total_asset=lastItemPembelian-lastItemPenjualan;
console.log(this.total_asset)
this.total_asset_periode_sebelumnya=penjualanPeriodeSebelumnya-transaksiJualPeriodeSebelumnya;
this.total_asset_periode_sebelumnya==undefined||this.total_asset_periode_sebelumnya==null?this.total_asset_periode_sebelumnya=0:this.total_asset_periode_sebelumnya

this.total_asset=undefined||this.total_asset==null?this.total_asset=0:this.total_asset;
transaksiJualPeriodeSebelumnya=transaksiJualPeriodeSebelumnya==undefined||transaksiJualPeriodeSebelumnya==null?this.total_asset:transaksiJualPeriodeSebelumnya;
this.percentage_total_asset = ((this.total_asset-this.total_asset_periode_sebelumnya)/this.total_asset)*100;

this.percentage_total_asset>=0?this.iconTotalAsset="fa fa-caret-up text-success":this.iconTotalAsset="fa fa-caret-down text-danger";
this.percentage_total_asset=Math.round(this.percentage_total_asset * 100) / 100
  }

  renderPromoChart():void{
    this.dashboardService.getDashboardPromo().subscribe(response=> {
    
      this.promoObjective=response.output_schema.objectives;
      this.promoObjective=response.output_schema.promotions;

      response.output_schema.objectives!=null?response.output_schema.objectives.forEach((element:any)=> {
        this.xAxisObjectives.push(element.title);
        this.yAxisObjectives.push(element.claim_qty);
      }):null;
      response.output_schema.promotions!=null?response.output_schema.promotions.forEach((element:any)=> {
        this.xAxisKode.push(element.kode_promo);
        this.yAxisKode.push(element.use_qty);
      }):null;

      jQuery.xAxisObjectives=this.xAxisObjectives;
      jQuery.yAxisObjectives=this.yAxisObjectives;
      jQuery.xAxisKode=this.xAxisKode
      jQuery.yAxisKode=this.yAxisKode;
      this.promoObjective=response.output_schema.objectives;
      this.promoKode=response.output_schema.promotions;

      (function($){
        var data, options;
        var data2, options2;
        data = {
          labels: jQuery.xAxisObjectives,
          series: [
            jQuery.yAxisObjectives
          ]
        };
        
        options = {
          height: 300,
          axisX: {
            showGrid: false
          },
        };
        
        new Chartist.Bar('#promo-objectives', data, options);
        
        data2 = {
          labels: jQuery.xAxisKode,
          series: [
            jQuery.yAxisKode
          ]
        };
        
        options2 = {
          height: 300,
          axisX: {
            showGrid: false
          },
        };
        
        new Chartist.Bar('#promo-kode', data2, options2);
        
      })(jQuery);
    
    
    }, (error) => {
      console.log('error -->',error);
    });

    
  
  }




}