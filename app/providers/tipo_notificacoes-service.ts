import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class TipoNotificacoesService{
  url : string;
  constructor(private http : Http){
    this.url = "http://biketour.atspace.cc/rest/listar_tipo_notificacoes.php";
  }

  listar(){
    return this.http.get(this.url).map(res => res.json());
  }
}
