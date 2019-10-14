import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class SendSmsService {

  result: any;
  constructor(private http: HttpClient) { }

  sendSms(brandName, msgType, phoneNumber, msgContent, sendTime) {
    const uri = 'http://localhost:4000/sms/send';
    const obj = {
      brandName: brandName,
      msgType: msgType,
      phoneNumber: phoneNumber,
      msgContent: msgContent,
      sendTime: sendTime
    };
    this
      .http
      .post(uri, obj)
      .subscribe(res =>
        console.log('Done'));
  }

  listSendSms() {
    const uri = 'http://localhost:4000/sms/list';
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }

  editSendSms(id) {
    const uri = 'http://localhost:4000/sms/edit/' + id;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }

  updateSendSms(name, price, id) {
    const uri = 'http://localhost:4000/sms/update/' + id;

    const obj = {
      name: name,
      price: price
    };
    this
      .http
      .post(uri, obj)
      .subscribe(res => console.log('Done'));
  }

  deleteSendSms(id) {
    const uri = 'http://localhost:4000/sms/delete/' + id;

    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
}
