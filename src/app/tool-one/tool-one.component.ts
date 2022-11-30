import { Component, OnInit } from '@angular/core';
import Jimp from 'jimp';

@Component({
  selector: 'app-tool-one',
  templateUrl: './tool-one.component.html',
  styleUrls: ['./tool-one.component.scss'],
})
export class ToolOneComponent implements OnInit {
  constructor() {
    Jimp.read(
      'https://cdn.pixabay.com/photo/2014/06/03/19/38/road-sign-361514_1280.png'
    ).then((image: any) => {
      console.log(image);
    });
  }

  ngOnInit(): void {}
}
