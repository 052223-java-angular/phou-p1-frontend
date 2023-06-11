import { Component } from '@angular/core';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent {

  showModal: boolean = false;

  constructor() { }


  toggleModal() {
    this.showModal = !this.showModal;
  }

}