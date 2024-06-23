import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Team } from './team';
import { Result } from './result';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  private url1 = "http://localhost:3000/teams/";
  private url2 = "http://localhost:3000/results/";

  constructor(private http: HttpClient){
  }

  getTeams() : Observable<Team[]>{
    return this.http.get<Team[]>(this.url1);
  }
  
  getResults() : Observable<Result[]>{
    return this.http.get<Result[]>(this.url2);
  }
}
