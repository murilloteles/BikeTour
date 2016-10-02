import { Injectable } from '@angular/core';
import {Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Notificacao} from '../models/notificacao';


@Injectable()
export class NotificacoesService{
  urlBase : string;
  constructor(private http : Http){
    this.urlBase = "http://biketour.atspace.cc/rest/";
  }

  listar(){
    let urlListar = this.urlBase + "listar_notificacoes.php";
    return this.http.get(urlListar).map(res => res.json());
  }

  inserir(notificacao : Notificacao){
    let urlInserir = this.urlBase + "inserir_notificacao.php?";
    let parametros = "tipo_notificacao=" + notificacao.tipo_notificacao + "&latitude=" + notificacao.latitude + "&longitude="+notificacao.longitude + "&data="+notificacao.data;

    if(notificacao.descricao)
      parametros = parametros + "&descricao="+notificacao.descricao;

    let urlCompleta = urlInserir+parametros;
    return this.http.get(urlCompleta).map(res => res.json());
  }

  deletar(id){
    let urlDeletar = this.urlBase + "deletar_notificacao.php?id=" + id;
    return this.http.get(urlDeletar).map(res => res.json());
  }
}
