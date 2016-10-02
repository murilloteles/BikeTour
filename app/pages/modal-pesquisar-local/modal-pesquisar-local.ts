import { Component,Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ViewController,IONIC_DIRECTIVES, Searchbar} from 'ionic-angular';

/*
  Generated class for the ModalPesquisarLocalPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/modal-pesquisar-local/modal-pesquisar-local.html',
  //template:'<ion-searchbar #searchbar></ion-searchbar>',
  directives: [IONIC_DIRECTIVES]
})
export class ModalPesquisarLocalPage {
  private options = {
    types: ['establishment']
  };
  public endereco;
  public selected;
  constructor(public elementRef: ElementRef,private view: ViewController){}

  @Output() onPlaceChanged: EventEmitter<any> = new EventEmitter();

  ngAfterViewInit() {
    var input =  this.elementRef.nativeElement.querySelector('input');
    /*var searchBox = new google.maps.places.SearchBox(input);
    searchBox.addListener('places_changed', function(){

    });*/

    var acutocomplete = new google.maps.places.Autocomplete(input);
    acutocomplete.addListener('place_changed', () => {
      var place = acutocomplete.getPlace();
      if (!place.geometry) {
          alert("Não contem geolocalização para esse local.");
          return;
      }

      this.view.dismiss(place.place_id);
    });
  }

  cancel(): void{
      this.view.dismiss();
  }

}
