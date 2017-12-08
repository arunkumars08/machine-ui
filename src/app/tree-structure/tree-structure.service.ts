import { Injectable, Inject } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observer } from 'rxjs/Observer';
import {TreeNode} from 'primeng/components/common/treenode';

@Injectable()
export class TreeService {
  private headers: Headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) {}

  private extractData(res: Response) {
    let body = res.json() || {};
    body['statusCode'] = res.status;
    body['statusText'] = res.statusText;
    return body;
  }

  public getFileSystem() {
    return this.http.get('https://gist.githubusercontent.com/ravsa/16a48a68a44741c7f20dcbe7b4996b81/raw/b61db5b8f2d67aa7b66ae44206e1b157b3f034bb/temp.json', {})
      .toPromise()
      .then(res => <TreeNode[]> res.json().data);
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
