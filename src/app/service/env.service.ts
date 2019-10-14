import { Injectable } from '@angular/core';

@Injectable()
export class EnvService {
  constructor() { }
  API_URL = 'http://127.0.0.1:3000/';
  BRAND_NAME = 'FTI';
}
