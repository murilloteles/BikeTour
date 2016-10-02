import {Component} from '@angular/core';
import {Alert, NavController, Platform, Modal} from 'ionic-angular';
import {ModalAlertasPage} from '../modal-alertas/modal-alertas';
import {ModalPesquisarLocalPage} from '../modal-pesquisar-local/modal-pesquisar-local';
import {RastreadorLocalizacao} from '../../providers/rastreador-localizacao/rastreador-localizacao';
import {NotificacoesService} from '../../providers/notificacoes-service';
import {TipoNotificacoesService} from '../../providers/tipo_notificacoes-service';
import {Geolocation} from 'ionic-native';
import {Notificacao} from '../../models/notificacao';
import {TipoNotificacao} from '../../models/tipo_notificacao';
import { DAONotificacoes } from '../../dao/dao-notificacoes';
import {Toast} from 'ionic-native';


@Component({
  templateUrl: 'build/pages/home/home.html',
   providers: [RastreadorLocalizacao,NotificacoesService,TipoNotificacoesService]
})
export class HomePage {
  public mapa;
  public directionsDisplay;
  public directionsService;
  public posicaoAtual;
  public listNotificacao : Notificacao[];
  public listTipoNotificacao : TipoNotificacao[];
  public dao;

  constructor(private nav: NavController, private platform: Platform, private tracker: RastreadorLocalizacao, private notificacoesService : NotificacoesService, private tipoNotificacoesService : TipoNotificacoesService) {
      this.directionsService = new google.maps.DirectionsService();
      this.directionsDisplay = new google.maps.DirectionsRenderer();
      this.dao = new DAONotificacoes();
      this.carregarMapa();
      this.tracker = tracker;
      this.start();
  }

  carregarMapa(){

      this.platform.ready().then(() => {

            Geolocation.getCurrentPosition().then((resp) => {
                this.posicaoAtual = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);

                let opcoesMapa = {
                  center: this.posicaoAtual,
                  zoom: 17,
                  mapTypeId: google.maps.MapTypeId.ROADMAP,
                  zoomControl: true,
                  zoomControlOptions: {
                   position: google.maps.ControlPosition.LEFT_CENTER
                  },
                  mapTypeControl: false,
                  streetViewControl: false,
                  rotateControl: false
                };

                this.mapa = new google.maps.Map(document.getElementById('mapa'),opcoesMapa);
                this.directionsDisplay.setMap(this.mapa);
                var bikeLayer = new google.maps.BicyclingLayer();

                bikeLayer.setMap(this.mapa);
                this.getNotificacoes();
                this.getTipoNotificacoes();
          });
      });
  }

  dataHoje() {
    var d = new Date(Date.now()),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day,month,year].join('/').toString();
 }

  abrirAlertas(){
    var notificacao : Notificacao = new Notificacao();
    Geolocation.getCurrentPosition().then((resp) => {
        notificacao.latitude = resp.coords.latitude;
        notificacao.longitude = resp.coords.longitude;
    });
    notificacao.data = this.dataHoje();
    let modalAlertas = Modal.create(ModalAlertasPage, {parametro: notificacao});
    modalAlertas.onDismiss((data)=> {
      if(data){
        alert('result notifi alertas:' + data.tipo_notificacao);
        this.insertMaker(data);
      }
    });
    this.nav.present(modalAlertas);
  }

  abrirPesquisa(){
    let modalPesquisa = Modal.create(ModalPesquisarLocalPage);
    modalPesquisa.onDismiss((data) => {
      if(data){
        let request = { // Novo objeto google.maps.DirectionsRequest, contendo:
            origin: this.posicaoAtual, // origem
            destination:{'placeId': data}, // destino
            travelMode: google.maps.TravelMode.BICYCLING // meio de transporte, nesse caso, de bike
       };
        var display = this.directionsDisplay;
        display.setDirections(null);
       this.directionsService.route(request, function(result, status) {

           if (status == google.maps.DirectionsStatus.OK) { // Se deu tudo certo
                display.setDirections(result); // Renderizamos no mapa o resultado
          }
      });
    }
    });
    this.nav.present(modalPesquisa);
  }

  getNotificacoes(){
  /*  this.dao.getNotificacoes((lista) => {
      if(lista){
        this.listNotificacao = lista;
        for (var i = 0; i < this.listNotificacao.length; i++){
          this.insertMaker(this.listNotificacao[i]);
        }
      }
    });*/

    this.notificacoesService.listar().subscribe((jsonNotificacoes) => {
      this.listNotificacao = new Array<Notificacao>();
      for (var i = 0; i < jsonNotificacoes.length; i++) {
        let notificacao : Notificacao = new Notificacao();
        notificacao.id = jsonNotificacoes[i].id;
        notificacao.tipo_notificacao = jsonNotificacoes[i].tipo_notificacao;
        notificacao.descricao = jsonNotificacoes[i].descricao;
        notificacao.latitude = jsonNotificacoes[i].latitude;
        notificacao.longitude = jsonNotificacoes[i].longitude;
        notificacao.data = jsonNotificacoes[i].data;
        this.listNotificacao.push(notificacao);

        this.insertMaker(notificacao);
      }
    });
  }

  getTipoNotificacoes(){
    this.tipoNotificacoesService.listar().subscribe((jsonTipoNotificacoes) => {
      this.listTipoNotificacao = new Array<TipoNotificacao>();
      for (var i = 0; i < jsonTipoNotificacoes.length; i++) {
        let tipoNotificacao : TipoNotificacao = new TipoNotificacao();
        tipoNotificacao.id = jsonTipoNotificacoes[i].id;
        tipoNotificacao.nome = jsonTipoNotificacoes[i].nome;
        this.listTipoNotificacao.push(tipoNotificacao);
      }
    });
  }

  insertMaker(notificacao: Notificacao){
    var lat = notificacao.latitude;
    var long = notificacao.longitude;
    var latlong = new google.maps.LatLng(lat, long);
    var marker = new google.maps.Marker({
            position: latlong,
            map: this.mapa,
            icon: this.getIcon(notificacao.tipo_notificacao),
            title: 'Marco Zero - Recife/PE',
            animation: google.maps.Animation.DROP
    });

    this.mapa.setCenter(latlong);

    google.maps.event.addListener(marker, 'click', () => {
      this.infoAviso(notificacao,marker);
    });
  }

  infoAviso(notificacao: Notificacao, marker){
    var nome = this.getNomeAlerta(notificacao.tipo_notificacao);
    // Parâmetros do texto que será exibido no clique;
    var conteudo = '';

    if(notificacao.descricao){
      conteudo = '<p>'+notificacao.descricao+'</p>';
    }
      conteudo = conteudo + '<p>Data inserção: '+notificacao.data+'</p>';

      let info = Alert.create({
          title: 'Info Aviso ' + nome,
          message: conteudo,
          buttons: [
            {
              text: 'OK'
            },
            {
              text: 'Excluir',
              handler: () => {
                this.notificacoesService.deletar(notificacao.id).subscribe((data) => {
                    marker.setMap(null);
                    Toast.showShortBottom("Aviso Excluido com sucesso!").subscribe((toast) =>{
                      console.log(toast);
                    });
                });
              }
            }]
    });
    this.nav.present(info);
  }


    getIcon(tipo): string{
      	var local = './img/';
      	switch(tipo){
      		case "1":
      			return local + 'falha.png';
      		case "2":
      			return local + 'buraco.png';
      		case "3":
      			return local + 'objeto.png';
      		case "4":
      			return local + 'iluminacao.png';
      		case "5":
      			return local + 'seguranca.png';
      		case "6":
      			return local + 'clima.png';
      	}
      }

      getNomeAlerta(tipo): string{
          switch(tipo) {
            case "1":
                return 'Falha Entre Ciclovias';
            case "2":
                return 'Buraco';
            case "3":
                return 'Objeto';
            case "4":
                return 'Iluminação';
           case "5":
                return 'Segurança';
            case "6":
              return 'Clima';
          }
      }

      start() {

  this.tracker.startTracking().subscribe((position) => {
    alert(position);
  });
}

  private subscribeToPosition(positionObj): void {
    alert(positionObj);
  }

  // Error callback
  private showError(errorObj): void {
    // Handle the error.
    alert(errorObj);
  }

stop() {
  this.tracker.stopTracking();
}

getPosicaoAtual(){
  Geolocation.getCurrentPosition().then((resp) => {
      var posicaoAtual = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      this.mapa.setCenter(posicaoAtual);
  });

}
}
