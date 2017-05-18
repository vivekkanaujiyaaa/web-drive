import { Injectable } from '@angular/core';
import {Http, RequestOptionsArgs, ResponseContentType, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import {Observable} from "rxjs/Observable";


@Injectable()
export class ConnectionServiceProvider {

  private hasAuthToken: boolean = false;
  private server: string = "https://localhost:8080/";
  private headers: Headers = new Headers();

  constructor(private http: Http, private storage: Storage) {}

  public setAuthToken(token: string) {
    this.storage.set("auth_token", token).then( () => {
      this.headers.set("Authenticated", token);
      this.hasAuthToken = true;
    });
  }

  public clearAuthToken() {
    this.storage.remove("auth_token").then( () => {
      this.headers.delete("Authenticated");
      this.hasAuthToken = false;
    });
  }

  public hasAuthTokenSet(): boolean {
    return this.hasAuthToken;
  }

  public notify(endpoint: string) : Observable<string> {
    return this.http.get(this._getUrl(endpoint), this._getRequestArguments()).map(response => response.json());
  }

  public send(endpoint: string, data?: any): Observable<string> {
    return this.http.post(this._getUrl(endpoint), data, this._getRequestArguments()).map(response => response.json())
  }

  private _getUrl(endpoint: string): string {
    return (this.server + endpoint);
  }

  private _getRequestArguments(): RequestOptionsArgs {
    return {
      headers: this.headers,
      responseType: ResponseContentType.Json
    }
  }

}