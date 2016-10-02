import { Component } from '@angular/core';
import { Alert,ViewController,NavController, NavParams} from 'ionic-angular';
import { DAONotificacoes } from '../../dao/dao-notificacoes';
import {Notificacao} from '../../models/notificacao';
import {NotificacoesService} from '../../providers/notificacoes-service';

/*
  Generated class for the ModalAlertasPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/modal-alertas/modal-alertas.html',
  providers: [NotificacoesService]
})
export class ModalAlertasPage {
  public dao : DAONotificacoes;
  public notificacao : Notificacao;
  constructor(private view: ViewController,private nav: NavController, private params: NavParams, private notificacoesService : NotificacoesService) {
      this.dao = new DAONotificacoes();
      this.notificacao = params.get("parametro") || new Notificacao();
  }

  cancel(): void{
    this.view.dismiss();
  }

  insert(tipo_notificacao){
        this.notificacao.tipo_notificacao = tipo_notificacao.toString();
        var tipoAlerta = this.getNomeAleta(tipo_notificacao);
        let confirm = Alert.create({
            title: 'Inserir Aviso',
            message: "Gostaria realmente de inserir o aviso de " + tipoAlerta + "?",
            buttons: [
              {
                text: 'Sim',
                handler: () => {
                      this.notificacoesService.inserir(this.notificacao).subscribe((jsonIdInserido) => {
                          this.notificacao.id = jsonIdInserido.idInserido;
                          this.view.dismiss(this.notificacao);
                      });

                  /*this.dao.insert(this.notificacao,(data) => {
                    this.view.dismiss(data);
                  });*/
                  }
              },
              {
                text: 'Não'
              }
            ]
      });
      this.nav.present(confirm);
  }

  getNomeAleta(id): string{
    switch(id) {
      case 1:
          return 'Falha Entre Ciclovias';
      case 2:
          return 'Buraco';
      case 3:
          return 'Objeto';
      case 4:
          return 'Iluminação';
     case 5:
          return 'Segurança';
      case 6:
        return 'Clima';
    }
  }
}
