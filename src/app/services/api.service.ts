import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import * as CryptoJS from 'crypto-js';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) {
  }

  key = '8QqJaytRg1buT?RkXo^Vy@4693BYL=I8';
  url = 'https://api.owuk.co.uk';

  CryptoJSAesJson = {
    stringify(cipherParams) {
      const j = {
        ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64), iv: undefined,
        s: undefined
      };
      if (cipherParams.iv) {
        j.iv = cipherParams.iv.toString();
      }
      if (cipherParams.salt) {
        j.s = cipherParams.salt.toString();
      }
      return JSON.stringify(j);
    },
    parse(jsonStr) {
      const j = JSON.parse(jsonStr);
      const cipherParams = CryptoJS.lib.CipherParams.create({ciphertext: CryptoJS.enc.Base64.parse(j.ct)});
      if (j.iv) {
        cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv);
      }
      if (j.s) {
        cipherParams.salt = CryptoJS.enc.Hex.parse(j.s);
      }
      return cipherParams;
    }
  };

  call(url, requestType, body, token): Observable<object> {
    const httpOptions = this.headers(token);
    let data;
    if (requestType === 'get') {
      const params = new URLSearchParams(body).toString();

      data = this.http[requestType](this.url + url + (params ? '/?' + params : ''), httpOptions);
    } else {
      body = this.encrypt(JSON.stringify(body));

      data = this.http[requestType](this.url + url, body, httpOptions);
    }


    return data.pipe(map((str) => {
      return  this.decrypt(str);
    }));
  }

  encrypt(value) {
    return CryptoJS.AES.encrypt(
      value,
      this.key.trim(),
      {format: this.CryptoJSAesJson}).toString();
  }

  decrypt(value) {
    return JSON.parse(
      CryptoJS.AES.decrypt(
        value,
        this.key.trim(),
        {format: this.CryptoJSAesJson}).toString(CryptoJS.enc.Utf8)
    );
  }

  headers(token) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'text/plain',
        token
      }), responseType: 'text/plain'
    };
    return httpOptions;
  }
}
