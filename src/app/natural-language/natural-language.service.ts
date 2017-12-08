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
    let url: string = 'https://gist.githubusercontent.com/ravsa/72695271a0bc23eda07d3dab70d011ba/raw/72be94118c3ee3dd5ac2d2ed367c5bbe050236ca/response.json';
    let body: any = {};
    // Change to POST once integrated with service
    return this    .http
    .get(url, body)
    .map(this.extractData)
    .catch(this.handleError);
  }

  public getMasterTags(): Observable<any> {
    let url: string = 'https://recommender.api.prod-preview.openshift.io/api/v1/master-tags/maven';
    this.headers.set('Authorization', 'Bearer ' + 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ6RC01N29CRklNVVpzQVdxVW5Jc1Z1X3g3MVZJamQxaXJHa0dVT2lUc0w4In0.eyJqdGkiOiI1NjM2OTM3YS1lNmUyLTQ4NTEtYTcyNi02NzA1OGZhNWY3NjUiLCJleHAiOjE1MTMxNjcyOTksIm5iZiI6MCwiaWF0IjoxNTEwNTc1Mjk5LCJpc3MiOiJodHRwczovL3Nzby5wcm9kLXByZXZpZXcub3BlbnNoaWZ0LmlvL2F1dGgvcmVhbG1zL2ZhYnJpYzgiLCJhdWQiOiJmYWJyaWM4LW9ubGluZS1wbGF0Zm9ybSIsInN1YiI6ImM1NjA0MmIyLWE2MDItNDUxYi05MzY2LTcxNjVkZjRiOWEwOCIsInR5cCI6IkJlYXJlciIsImF6cCI6ImZhYnJpYzgtb25saW5lLXBsYXRmb3JtIiwiYXV0aF90aW1lIjoxNTEwNTc1MjY4LCJzZXNzaW9uX3N0YXRlIjoiYjM0Y2M5NmQtYmZkNC00OGY4LTllNWItOTdiOWQ1Y2IyZjBkIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL3Byb2QtcHJldmlldy5vcGVuc2hpZnQuaW8iLCJodHRwczovL2F1dGgucHJvZC1wcmV2aWV3Lm9wZW5zaGlmdC5pbyIsImh0dHA6Ly9jb3JlLXdpdC4xOTIuMTY4LjQyLjY5Lm5pcC5pbyIsImh0dHA6Ly9sb2NhbGhvc3Q6ODA4MCIsImh0dHBzOi8vY29yZS13aXQuMTkyLjE2OC40Mi42OS5uaXAuaW8iLCJodHRwczovL2FwaS5wcm9kLXByZXZpZXcub3BlbnNoaWZ0LmlvIiwiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwiaHR0cDovL2F1dGgtd2l0LjE5Mi4xNjguNDIuNjkubmlwLmlvIiwiaHR0cHM6Ly9hdXRoLXdpdC4xOTIuMTY4LjQyLjY5Lm5pcC5pbyIsImh0dHA6Ly9sb2NhbGhvc3Q6ODA4OSJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJicm9rZXIiOnsicm9sZXMiOlsicmVhZC10b2tlbiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwiYXBwcm92ZWQiOnRydWUsIm5hbWUiOiJBcnVua3VtYXIgUyIsImNvbXBhbnkiOiJSZWRoYXQiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzYWlsYXJ1bmt1bWFyIiwiZ2l2ZW5fbmFtZSI6IkFydW5rdW1hciIsImZhbWlseV9uYW1lIjoiUyIsImVtYWlsIjoic2FpbC5hcnVua3VtYXJAZ21haWwuY29tIn0.f4HyFUbf5pfVCXrJbq4GxDkhmVGBfgVcnscuO9GapnxpBIPzVHRZ-8mv3BIruu8M92_cEtOCg6NeSVOgz7mWeb_vTSnQHRNzhLk9SZUb-46Bv-KReLiMmK9g9R2mJ0u_lj_av2DkeVamD8JZI-AfbhtU0BKt9vdmbt7GWOq2Zbuf3i76ZK4Yo8Lfosl_mmvR2mcABKCl-mV7B4673NZ_IyHgX7Y2riHr3d39Es5qJNQWDCGHUnzg0JnXtsrJDg4jKD_0de7aV255WLecTMzW4cmQ-3G4j7v0dg2-yAltVZfpfzt7Smnpam_HfcZGtscfWzjuuM2Yie2Ks1q6xpUzxw');
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
