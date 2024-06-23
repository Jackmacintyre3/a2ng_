// routes.component.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css']
})
export class RoutesComponent {
  jsonData: string = '';
  
  constructor(private http: HttpClient) {}

  handleButtonClick(url: string) {
    this.http.get(url).subscribe((response: any) => {
      this.jsonData = JSON.stringify(response, null, 3);
    });
  }
}
