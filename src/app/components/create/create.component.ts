import { ValidationUtilService } from './../../service/validation-util.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  angForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private validation: ValidationUtilService
  ) {
    this.createForm();
  }

  ngOnInit() {
  }
  createForm() {
    this.angForm = this.fb.group({
      second: ['', Validators.required],
      minute: ['', Validators.required],
      hour: ['', Validators.required],
      dayofmonth: ['', Validators.required],
      month: ['', Validators.required],
      dayofweek: ['', Validators.required]
    });
  }

  onClickSubmit(second, minute, hour, dayofmonth, month, dayofweek){
    if (this.validation.isEmptyStr(second)) {
      second = '*';
    }
    if (this.validation.isEmptyStr(minute)) {
      minute = '*';
    }
    if (this.validation.isEmptyStr(hour)) {
      hour = '*';
    }
    if (this.validation.isEmptyStr(dayofmonth)) {
      dayofmonth = '*';
    }
    if (this.validation.isEmptyStr(month)) {
      month = '*';
    }
    if (this.validation.isEmptyStr(dayofweek)) {
      dayofweek = '*';
    }

    const timeInterval = second + minute + hour + dayofmonth + month + dayofweek;
  }
}
