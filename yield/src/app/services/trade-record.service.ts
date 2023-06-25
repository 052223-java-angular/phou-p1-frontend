import { Injectable } from '@angular/core';
import { ITrade } from '../models/ITrade';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Header, IHeader } from '../models/Header';
import { IPrice, Bnb } from '../models/IPrice';
import { ApiTradeRecord, IApiTrade } from '../models/IApiTrade';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { IReport, ProfitLossRecord } from '../models/IReport';

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

  // for api profit loss records
  apiProfitLossRecords: IReport[] = [];
  apiProfitLossFields: IHeader[] = [];

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

  private initApiProfitLossHeaderFields(): void {
    const plRecord = new ProfitLossRecord( '','','','','','','',0,0, 0, 0, 0);
    let i = 0;
    for (const propertyName in plRecord) {
      if (propertyName != "reportDate" && propertyName != "reportId") {
        this.apiProfitLossFields.push(new Header(propertyName, i));
        i++;
      }
    }
  }
  
  /////////// Price


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

  addBnbPriceRecords(priceRecords: string[]) : void {
    priceRecords.shift(); // remove header row
    for (const record of priceRecords) {
      this.bnbPriceHistory.push(new Bnb('BNB', record[0], record[4], record[6], record[5]))
    }
  }


  //======= CLEAR | RESET FIELD VARIABLE METHODS   =============//
  //============================================================//

  // clear the local header fields array
  clearLocalHeaderFields(): void {
    this.localHeaderFields = [];
  }

  // clear the local trade record array
  clearLocalTradeRecords(): void {
    this.localTradeRecords = [];
  }

  clearAll() : void {
    this.rawHeaderFields = [];
    this.rawTradeRecords = [];
    this.localHeaderFields = [];
    this.localTradeRecords = [];
    this.apiHeaderFields = [];
    this.apiTradeRecords = [];
    this.apiProfitLossFields = [];
    this.apiProfitLossRecords = [];
  }


  //====================   GETTER FOR FIELD METHODS   =======================//
  //============================================================//

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

  // the local formatted trade records
  getLocalTradeRecords(): ITrade[] {
    return this.localTradeRecords;
  }

  // a singe local trade record by index
  getLocalTradeRecordByIndex(index: number): ITrade {
    return this.localTradeRecords[index];
  }

  // the local formatted / match header fields
  getApiHeaderFields(): IHeader[] {
    return this.apiHeaderFields;
  }

  getApiTradeRecords() : IApiTrade[] {
    return this.apiTradeRecords;
  }

  getApiProfitLossHeaderFields() : IHeader[] {
    return this.apiProfitLossFields;
  }

  getApiProfitLossRecords() : IReport[] {
    return this.apiProfitLossRecords;
  }

  
  //=============   ADD, INSERT, UPDATE METHODS   ==============//
  //============================================================//


  // adds one raw trade reccord to local class member
  addRawTradeRecord(rawTradeRecord: string): void {
    this.rawTradeRecords.push(rawTradeRecord);
  }

  
  // add one local header field to local member variable
  addLocalHeaderField(headerField: IHeader): void {
    this.localHeaderFields.push(headerField);
  }

  // add one local trade record to the local member variable
  addLocalTradeRecord(localTradeRecord: ITrade): void {
    this.localTradeRecords.push(localTradeRecord);
  }

  // saves a string of raw header fields
  concatRawHeaderFields(rawHeaderFields: string): void {
    this.rawHeaderFields = [];
    this.rawHeaderFields = this.rawHeaderFields.concat(rawHeaderFields);
  }

  updateLocalTradeRecord(idx: number, localTradeRecord: ITrade): ITrade {
    return this.updateLocalTrade(idx, localTradeRecord);
  }

  deleteLocalTradeRecord(index: number): ITrade[] {
    this.localTradeRecords.splice(index, 1);
    return this.localTradeRecords;
  }

  deleteLocalApiTrade(id: string) : IApiTrade[] | null {
    for (let i = 0; i < this.apiTradeRecords.length; i++) {
      if (this.apiTradeRecords[i].id == id) {
        return this.apiTradeRecords.splice(i, 1);
      }
    }
    return null;
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
    this.localTradeRecords[idx].asset = asset;
    this.localTradeRecords[idx].orderId = orderId;
    this.localTradeRecords[idx].date = date;
    this.localTradeRecords[idx].side = side;
    this.localTradeRecords[idx].unitPrice = unitPrice;
    this.localTradeRecords[idx].qty = qty;
    this.localTradeRecords[idx].amountPaid = amountPaid;
    this.localTradeRecords[idx].fee = fee;
    this.localTradeRecords[idx].currencyPair = currencyPair;

    // console.log(this.localTradeRecords[idx]);
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

    // console.log(localTradeRecord);
    return this.localTradeRecords[idx];
  }


  //=============   SAVE LOCAL FIELDS METHODS   ==============//
  //============================================================//

  // saves a string of raw header fields
  saveRawHeaderFields(rawHeaderFields: string[]): void {
    this.rawHeaderFields = [];
    for (const field of rawHeaderFields) {
      this.rawHeaderFields.push(field);
    }
  }

  // saves an array of raw trade records
  saveRawTradeRecords(rawTradeRecords: string[]): void {
    this.rawTradeRecords = rawTradeRecords;
  }
  
  saveLocalHeaderFields(headerFields: IHeader[]): void {
    this.localHeaderFields = headerFields;
  }

  saveLocalTradeRecords(tradeRecords: ITrade[]): void {
    this.localTradeRecords = tradeRecords;
  }


  //=============   HTTP METHODS   =============================//
  //============================================================//


  // create an HttpHeader with user credentials
  private configAuthHeader() : HttpHeaders {
    return new HttpHeaders({ 
      user_id: this.authService.getIdOfUser(), 
      auth_token: this.authService.getAuthTokenOfUser() });
  }


  // save all trade records 
  saveTradeRecordsToApi(): void {
    const customHeader = this.configAuthHeader();

    if (customHeader) {
      console.log("created header with user, saving records");
      this.httpClient.post("/api/trades/records", this.localTradeRecords, {headers: customHeader} )
        .subscribe((res: any) => {
          this.clearAll();
          this.initApiHeaderFields();
          this.apiTradeRecords = res;
        });
    }
  }


  // NOT USEABLE, REQUIRES A SINGE RECORD VIEW
  // retrieves trade record by the id
  getTradeRecordById(id: string): void {
      const customHeader = this.configAuthHeader();
  
      if (customHeader) {
        this.httpClient.get(`/api/trades/records?id`, {headers: customHeader})
        .subscribe((res: any) => {
          console.log(res);
          // this.apiTradeRecords = res;
        });
      }
      
  }


  // retrieves trade records from be
  getTradeRecordsFromApi() : void {
    const customHeader = this.configAuthHeader();

    if (customHeader) {
      this.httpClient.get(`/api/trades/records`, {headers: customHeader})
      .subscribe((res: any) => {
        this.clearAll();
        this.initApiHeaderFields();
        this.apiTradeRecords = res.slice(0, 50);
      });
    }
  }


  // NOT USABLE UNTIL DROP DOWN IMPL
  // get a set of  trade records by the report id
  getTradeRecordsReportIds() : void {
    const customHeader = this.configAuthHeader();

    if (customHeader) {
      this.httpClient.get("/api/trades/records", {headers: customHeader})
      .subscribe((res: any) => {
        console.log(res)
          // todo implement when report ids are shown in account profile or dropdown list
      })
    }
  }

  fetchApiProfitLossRecords() : void {
    const customHeader = this.configAuthHeader();

    if (customHeader) {
      this.httpClient.get("/api/trades/reports/pl", {headers: customHeader})
      .subscribe((res: any) => {
          this.clearAll();
          this.initApiProfitLossHeaderFields();
          this.apiProfitLossRecords = res;
          // console.log(this.apiProfitLossRecords);
      })
    }
  }

  
  // NOT USED / IMPL
  // updates the trade record 
  updateApiTradeRecord(id: string, apiTradeRecord: IApiTrade): void {
    const customHeader = this.configAuthHeader();

    if (customHeader) {
      this.httpClient.put("/api/trades/records", apiTradeRecord, {headers: customHeader})
      .subscribe((res: any) => {
        console.log(res)

      })
    }
  }
  

  // deletes a trade record by its id and update the local record
  deleteApiTradeRecord(id: string, apiTradeRecord: IApiTrade): void  {
    const customHeader = this.configAuthHeader();

    if (customHeader) {
      this.httpClient.delete(`/api/trades/records?trade_record_id=${id}`, {headers: customHeader})
      .subscribe((res: any) => {
        const deleteResult: IApiTrade[] | null = this.deleteLocalApiTrade(id);
        console.log("deleted trade record = "+id + " and " + deleteResult);
      })
    }
  }


}