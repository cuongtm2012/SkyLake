import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SendSmsService } from '../../service/sendSms.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  coins: any;

  constructor(private http: HttpClient, private service: SendSmsService) {}

  ngOnInit() {
    this.getListSms();
  }

  getListSms() {
    this.service.listSendSms().subscribe(res => {
      this.coins = res;
    });
  }

  deleteSms(id) {
    this.service.deleteSendSms(id).subscribe(res => {
      console.log('Deleted');
    });
  }
}
