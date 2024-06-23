import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Player } from './player';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private url = 'http://localhost:3000/tap';

  constructor(private http: HttpClient) { }

  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.url);
  }

  addPlayer(player: Player): Observable<Player> {
    return this.http.post<Player>(this.url, player);
  }

  getPlayer(id: number): Observable<Player> {
    return this.http.get<Player>(`${this.url}/${id}`);
  }
}
