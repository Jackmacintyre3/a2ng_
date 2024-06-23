import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Result } from './result';
import { Player } from './player';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {
  private url = 'http://localhost:3000/results';

  constructor(private http: HttpClient) { }

  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.url);
  }

  getResults(): Observable<Result[]> {
    return this.http.get<Result[]>(this.url);
  }

  updateResult(id: number, resultsToUpdate: Result): Observable<Result> {
    return this.http.put<Result>(`${this.url}/${id}`, resultsToUpdate);
  }

  deleteResult(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
