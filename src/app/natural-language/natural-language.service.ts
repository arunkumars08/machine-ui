import { Injectable, Inject } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class NaturalLanguageService {
  private headers: Headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) {}

  public getPackages(userInput: string): Observable<any> {
    let url: string = 'https://gist.githubusercontent.com/ravsa/72695271a0bc23eda07d3dab70d011ba/raw/ed64af56c6fbddeb1b10f7d30debb172f5062bba/response.json';
    let body: any = {};
    // Change to POST once integrated with service
    return this    .http
    .get(url, body)
    .map(this.extractData)
    .catch(this.handleError);
  }

  public getMasterTags(): Observable<any> {
    let url: string = 'API_URL';
    this.headers.set('Authorization', 'Bearer ' + "ACCESS_TOKEN");
    let options = new RequestOptions({ headers: this.headers });
    return this .http
    .get(url, options)
    .map(this.extractData)
    .catch(this.handleError);
  }


  private extractData(res: Response) {
    let body = res.json() || {};
    body['statusCode'] = res.status;
    body['statusText'] = res.statusText;
    return body;
  }

  private handleError(error: Response | any) {
    let body: any = {};
    if (error instanceof Response) {
      if (error && error.status && error.statusText) {
        body = {
          status: error.status,
          statusText: error.statusText
        };
      }
    } else {
      body = {
        statusText: error.message ? error.message : error.toString()
      };
    }
    return Observable.throw(body);
  }
}
