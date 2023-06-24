import { Injectable } from '@angular/core';
import { ITrade, LocalTrade } from '../models/ITrade';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Header, IHeader } from '../models/Header';
import { IPrice, Bnb } from '../models/IPrice';
import { ApiTradeRecord, IApiTrade } from '../models/IApiTrade';
import { FileService } from './file.service';
import { AuthService } from './auth.service';
import { IUser } from '../models/IUser';
import { Observable } from 'rxjs';

//====================================
// Service handling and managing the trade records CRUD ops
//
//====================================
@Injectable({
  providedIn: 'root',
})
export class TradeRecordService {
  // for raw unformatted records
  rawTradeRecords: string[] = [];
  rawHeaderFields: string[] = [];

  // for local formatted records
  localTradeRecords: ITrade[] = [];
  localHeaderFields: IHeader[] = [];

  // for api trade records
  apiTradeRecords: IApiTrade[] = [];
  apiHeaderFields: IHeader[] = [];

  // for major pair historical pricing
  priceFields: string[] = [];
  bnbPriceHistory: IPrice[] = [];
  ethPriceHistory: IPrice[] = [];
  btcPriceHistory: IPrice[] = [];

  hasInit: boolean = false;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {

  }

  private initApiHeaderFields(): void {
    const apiTrade = new ApiTradeRecord( '','','','','','','','','');
    let i = 0;
    for (const propertyName in apiTrade) {
      if (propertyName != "reportDate" && propertyName != "reportId") {
        this.apiHeaderFields.push(new Header(propertyName, i));
        i++;
      }
    }
  }

  // temp
  // private initPriceFields(): void {
  //   const apiTrade = new Bnb('','','','','');
  //   for (const propertyName in apiTrade) {
  //     this.apiHeaderFields.push(propertyName);
  //   }
  // }

  // private initBnbPrice(filePath: string) : void {
  //   this.fileService.getBnbPriceFromFile(filePath)
  //     .then(priceRecords => {
  //       this.addBnbPriceRecords(priceRecords);
  //     }).catch(err => console.log(err));
  // }


  /////////// Price

  addBnbPriceRecords(priceRecords: string[]) : void {
    priceRecords.shift(); // remove header row
    for (const record of priceRecords) {
      this.bnbPriceHistory.push(new Bnb('BNB', record[0], record[4], record[6], record[5]))
    }
  }

  ///////////////////////////////////////////////////////////

  // // coluumn / field options for the select input drop down
  // getTradeColumnOptions(): string[] {
  //   return this.tradeColumnOptions;
  // }

  // the unformatted header fields
  getRawHeaderFields(): string[] {
    return this.rawHeaderFields;
  }

  // the unformatted trade records
  getRawTradeRecords(): string[] {
    return this.rawTradeRecords;
  }

  // the local formatted / match header fields
  getLocalHeaderFields(): IHeader[] {
    return this.localHeaderFields;
  }

  // the local formatted / match header fields
  getApiHeaderFields(): IHeader[] {
    return this.apiHeaderFields;
  }

  // the local formatted trade records
  getLocalTradeRecords(): ITrade[] {
    return this.localTradeRecords;
  }

  // a singe local trade record by index
  getLocalTradeRecordByIndex(index: number): ITrade {
    return this.localTradeRecords[index];
  }

  getApiTradeRecords() : IApiTrade[] {
    return this.apiTradeRecords;
  }

  // adds one raw trade reccord to local class member
  addRawTradeRecord(rawTradeRecord: string): void {
    this.rawTradeRecords.push(rawTradeRecord);
  }

  // saves an array of raw trade records
  saveRawTradeRecords(rawTradeRecords: string[]): void {
    this.rawTradeRecords = rawTradeRecords;
  }

  // saves a string of raw header fields
  concatRawHeaderFields(rawHeaderFields: string): void {
    this.rawHeaderFields = [];
    this.rawHeaderFields = this.rawHeaderFields.concat(rawHeaderFields);
  }

  // saves a string of raw header fields
  saveRawHeaderFields(rawHeaderFields: string[]): void {
    this.rawHeaderFields = [];
    for (const field of rawHeaderFields) {
      this.rawHeaderFields.push(field);
    }
  }

  saveLocalHeaderFields(headerFields: IHeader[]): void {
    this.localHeaderFields = headerFields;
  }

  saveLocalTradeRecords(tradeRecords: ITrade[]): void {
    this.localTradeRecords = tradeRecords;
  }

  //=========== for local trade records ===============//

  // clear the local header fields array
  clearLocalHeaderFields(): void {
    this.localHeaderFields = [];
  }

  // clear the local trade record array
  clearLocalTradeRecords(): void {
    this.localTradeRecords = [];
  }

  clearAll() : void {
    this.localHeaderFields = [];
    this.localTradeRecords = [];
    this.apiHeaderFields = [];
    this.apiTradeRecords = [];
  }

  // add one local header field to local member variable
  addLocalHeaderField(headerField: IHeader): void {
    this.localHeaderFields.push(headerField);
  }

  // add one local trade record to the local member variable
  addLocalTradeRecord(localTradeRecord: ITrade): void {
    this.localTradeRecords.push(localTradeRecord);
  }

  updateLocalTradeRecordFields(
    idx: number,
    asset: string,
    orderId: string,
    date: string,
    side: string,
    unitPrice: number,
    qty: number,
    amountPaid: number,
    fee: number,
    currencyPair: string,
  ): ITrade {
    console.log(idx);
    this.localTradeRecords[idx].asset = asset;
    this.localTradeRecords[idx].orderId = orderId;
    this.localTradeRecords[idx].date = date;
    this.localTradeRecords[idx].side = side;
    this.localTradeRecords[idx].unitPrice = unitPrice;
    this.localTradeRecords[idx].qty = qty;
    this.localTradeRecords[idx].amountPaid = amountPaid;
    this.localTradeRecords[idx].fee = fee;
    this.localTradeRecords[idx].currencyPair = currencyPair;

    console.log(this.localTradeRecords[idx]);
    return this.localTradeRecords[idx];
  }


  // update the local trade record state
  private updateLocalTrade(idx: number, localTradeRecord: ITrade): ITrade {
    this.localTradeRecords[idx].asset = localTradeRecord.asset;
    this.localTradeRecords[idx].orderId = localTradeRecord.orderId;
    this.localTradeRecords[idx].date = localTradeRecord.date;
    this.localTradeRecords[idx].side = localTradeRecord.side;
    this.localTradeRecords[idx].unitPrice = localTradeRecord.unitPrice;
    this.localTradeRecords[idx].qty = localTradeRecord.qty;
    this.localTradeRecords[idx].amountPaid = localTradeRecord.amountPaid;
    this.localTradeRecords[idx].fee = localTradeRecord.fee;
    this.localTradeRecords[idx].currencyPair = localTradeRecord.currencyPair;

    console.log(localTradeRecord);
    return this.localTradeRecords[idx];
  }

  updateLocalTradeRecord(idx: number, localTradeRecord: ITrade): ITrade {
    return this.updateLocalTrade(idx, localTradeRecord);
  }

  deleteLocalTradeRecord(index: number): ITrade[] {
    this.localTradeRecords.splice(index, 1);
    return this.localTradeRecords;
  }

  //============ FOR HTTP ==============//

  private getAuthHeader() : HttpHeaders {
    return new HttpHeaders({ 
      user_id: this.authService.getIdOfUser(), 
      auth_token: this.authService.getAuthTokenOfUser() });
  }



  saveTradeRecordsToApi(): IApiTrade[] {
    const customHeader = this.getAuthHeader();

    if (customHeader) {
      console.log("created header with user, saving records");
      this.httpClient.post<IApiTrade[]>("/api/trades/records", this.localTradeRecords, {headers: customHeader} )
        .subscribe((res: any) => {
          console.log(res);
          this.localTradeRecords = [];
          return res;
        });
    }
    return [];
  }

  
  // trade records received from an api endpoint
  getTradeRecords(): ITrade[] | null {
    // todo http
    return [];
  }

  // trade records by its id; recieved from an api endpoint
  getTradeRecordById(id: string): void {
      const customHeader = this.getAuthHeader();
  
      if (customHeader) {
        this.httpClient.get(`/api/trades/records?id`, {headers: customHeader})
        .subscribe((res: any) => {
          console.log(res);
          // this.apiTradeRecords = res;
        });
      }
      
  }


  getTradeRecordsFromApi() : void {
    const customHeader = this.getAuthHeader();

    if (customHeader) {
      this.httpClient.get(`/api/trades/records`, {headers: customHeader})
      .subscribe((res: any) => {
        this.initApiHeaderFields();
        // Object.keys(res[0]).forEach((key, idx) => this.apiHeaderFields.push(new Header(key, idx)));
        // console.log(this.apiHeaderFields);
        this.apiTradeRecords = res.slice(0, 50);
      });
    }
  }

  
  // getTradeRecordsFromApi2() : void {
  //   const customHeader = this.getAuthHeader();

  //   if (customHeader) {
  //     this.httpClient.get(`/api/trades/records`, {headers: customHeader})
  //     .subscribe((res: any) => {
  //       console.log(res);
  //       this.localTradeRecords = res.slice(0, 50);
  //     });
  //   }
  // }

  getTradeRecordsReportIds() : void {
    const customHeader = this.getAuthHeader();

    if (customHeader) {
      this.httpClient.get("/api/trades/records/reports", {headers: customHeader})
      .subscribe((res: any) => {
        console.log(res)
      })
    }
  }

  
  // todo -- implement
  updateTradeRecord(tradeRecord: IApiTrade): void {
    const customHeader = this.getAuthHeader();

    if (customHeader) {
      this.httpClient.put("/api/trades/records", tradeRecord, {headers: customHeader})
      .subscribe((res: any) => {
        console.log(res)
      })
    }
  }

  deleteTradeRecord(tradeId: string): void {
    const customHeader = this.getAuthHeader();

    if (customHeader) {
      this.httpClient.delete(`/api/trades/records?trade_record_id=${tradeId}`, {headers: customHeader})
      .subscribe((res: any) => {
        console.log(res)
      })
    }
  }

  deleteReport(id: string) : void {
    
  }

  //=========== PRIVATE ================//
  // private updateTradeRecordFields(idx: number) {
  //   this.tradeRecords[idx].asset = this.editForm.get('asset')?.value;
  //   this.tradeRecords[idx].orderId = this.editForm.get('orderId')?.value
  //   this.tradeRecords[idx].date  = this.editForm.get('date')?.value
  //   this.tradeRecords[idx].side = this.editForm.get('side')?.value
  //   this.tradeRecords[idx].unitPrice = this.editForm.get('unitPrice')?.value
  //   this.tradeRecords[idx].qty = this.editForm.get('qty')?.value
  //   this.tradeRecords[idx].amountPaid = this.editForm.get('amountPaid')?.value
  //   this.tradeRecords[idx].fee = this.editForm.get('fee')?.value
  //   this.tradeRecords[idx].currencyPair = this.editForm.get('currencyPair')?.value
  // }
}
