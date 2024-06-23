import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { resultDiv } from './resultDiv';

@Injectable({
  providedIn: 'root'
})
export class DivResultsService {
  private url = 'http://localhost:3000/results/1';

  constructor(private http: HttpClient) { }

  getResults(): Observable<resultDiv[]> {
    return this.http.get<resultDiv[]>(this.url);
  }

  addResult(result: resultDiv): Observable<resultDiv> {
    return this.http.post<resultDiv>(this.url, result);
  }

  getResult(id: number): Observable<resultDiv> {
    return this.http.get<resultDiv>(`${this.url}/${id}`);
  }

  deleteResult(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
