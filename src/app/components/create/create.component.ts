
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SendSmsService } from '../../service/sendSms.service';
import { EnvService } from '../../service/env.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  title = 'Send SMS';
  brandName: any;
  msgTypes = [];
  angForm: FormGroup;
  constructor(
    private service: SendSmsService,
    private fb: FormBuilder,
    private router: Router,
    private env: EnvService) {
    this.brandName = this.env.BRAND_NAME;
    this.createForm();
  }
  createForm() {
    this.angForm = this.fb.group({
      brandName: ['', Validators.required],
      msgTypes: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      msgContent: ['', Validators.required],
      sendTime: ['', Validators.required]
    });
    this.msgTypes = [{ id: 1, name: 'Customer Care' }, { id: 2, name: 'Promotion' }];
  }
  sendSms(brandName, msgType, phoneNumber, msgContent, sendTime) {
    this.service.sendSms(brandName, msgType, phoneNumber, msgContent, sendTime);
    this.router.navigate(['index']);
  }
  ngOnInit() {
  }
}
