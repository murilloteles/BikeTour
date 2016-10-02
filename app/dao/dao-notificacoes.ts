import {Storage, SqlStorage} from 'ionic-angular';
import {Notificacao} from '../models/notificacao';

export class DAONotificacoes{
  constructor(){
    this.initTables();
  }

  initTables(){
   this.initTableTipoNotificacao();
    this.initTableNotificacoes();
  }

  insert(notificacao: Notificacao, successCallback):void{
    let storage = new Storage(SqlStorage);
    storage.query("INSERT INTO notificacoes(idTipo,detalhamento,latitude,longitude) VALUES(?,?,?,?)", [notificacao.tipo_notificacao,"Tst" ,notificacao.latitude, notificacao.longitude]).then((data) => {
        notificacao.id = data.res.insertId;
        successCallback(notificacao);
        console.log("Inseriu notificacao dao!");
      }, (error)=>{
        console.log("Erro no insert" + JSON.stringify(error.err));
      });
  }

  initTableTipoNotificacao(){
    let storage = new Storage(SqlStorage);

    storage.query("CREATE TABLE IF NOT EXISTS tipo_notificacao(id INTEGER PRIMARY KEY, tipo TEXT)").then((data)=> {
        console.log("Tabela tipo notificacoes criada");
        storage.query("INSERT INTO tipo_notificacao(id,tipo) VALUES(?,?)", [1,"Falha Entre Ciclovias"]).then((data) => {
          console.log("Inseriu 1!");
        }, (error)=>{
          console.log("Erro no insert" + JSON.stringify(error.err));
        });
        storage.query("INSERT INTO tipo_notificacao(id,tipo) VALUES(?,?)", [2,"Objeto"]).then((data) => {
          console.log("Inseriu 2!");
        }, (error)=>{
          console.log("Erro no insert" + JSON.stringify(error.err));
        });
        storage.query("INSERT INTO tipo_notificacao(id,tipo) VALUES(?,?)", [3,"Buraco"]).then((data) => {
          console.log("Inseriu 3!");
        }, (error)=>{
          console.log("Erro no insert" + JSON.stringify(error.err));
        });
        storage.query("INSERT INTO tipo_notificacao(id,tipo) VALUES(?,?)", [4,"Iluminação"]).then((data) => {
          console.log("Inseriu 4!");
        }, (error)=>{
          console.log("Erro no insert" + JSON.stringify(error.err));
        });
        storage.query("INSERT INTO tipo_notificacao(id,tipo) VALUES(?,?)", [5,"Segurança"]).then((data) => {
          console.log("Inseriu 5!");
        }, (error)=>{
          console.log("Erro no insert" + JSON.stringify(error.err));
        });
        storage.query("INSERT INTO tipo_notificacao(id,tipo) VALUES(?,?)", [6,"Clima"]).then((data) => {
          console.log("Inseriu 6!");
        }, (error)=>{
          console.log("Erro no insert" + JSON.stringify(error.err));
        });
      }, (error)=>{
        console.log("Erro na criação" + JSON.stringify(error.err));
    });
  }

  initTableNotificacoes(){
    let storage = new Storage(SqlStorage);
    //storage.query("DROP TABLE notificacoes").then((data)=> {});
    storage.query("CREATE TABLE IF NOT EXISTS notificacoes(id INTEGER PRIMARY KEY AUTOINCREMENT, idTipo INTEGER, detalhamento TEXT, latitude TEXT, longitude TEXT)").then((data)=> {
        console.log("Tabela notificaocoes criada");
      }, (error)=>{
        console.log("Erro na criação" + JSON.stringify(error.err));
    });
  }

  getTipo(successCallback){
    let storage = new Storage(SqlStorage);
    var detalhe : string = "";
    storage.query("SELECT * FROM tipo_notificacao").then((data)=>{
      if(data.res.rows.length > 0) {
        detalhe = data.res.rows.item(0).tipo;
      }
      successCallback(detalhe);
    }, (error)=>{
      console.log("Erro na busca" + JSON.stringify(error.err));
    });
}

  getNotificacoes(successCallback){
    let storage = new Storage(SqlStorage);

    storage.query("SELECT * FROM notificacoes").then((data)=>{
      let list  = new Array<Notificacao>();

      for (var i = 0; i < data.res.rows.length; i++) {
        let item = new Notificacao();

        item.id = data.res.rows.item(i).id;
        item.tipo_notificacao = data.res.rows.item(i).idTipo;
        item.descricao = data.res.rows.item(i).detalhamento;
        item.latitude = data.res.rows.item(i).latitude;
        item.longitude = data.res.rows.item(i).longitude;

        list.push(item);
      }
      successCallback(list);

    }, (error)=>{
      console.log("Erro na busca" + JSON.stringify(error.err));
    });
  }

  excluir(notificacao, successCallback){
    let storage = new Storage(SqlStorage);

    storage.query("DELETE FROM notificacoes WHERE id = ?",[notificacao.id]).then((data)=>{
      successCallback(notificacao);
    }, (error)=>{
      console.log("Erro no delete" + JSON.stringify(error.err));
    });

  }
}
