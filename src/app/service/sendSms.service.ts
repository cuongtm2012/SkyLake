import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class SendSmsService {

  result: any;
  constructor(private http: HttpClient) { }

  listSendSms() {
    const uri = 'http://localhost:4000/sms/smslist';
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
}
