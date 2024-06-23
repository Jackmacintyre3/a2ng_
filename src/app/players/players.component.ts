import { Component, NgModule } from '@angular/core';
import { PlayerService } from '../players.service';
import { Player } from '../player';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent {
  players: Player[] = [];
  allPlayers: Player[] = [];


  constructor(private playerService: PlayerService) {
    this.playerService.getPlayers().subscribe(
      (response: Player[]) => {
        this.allPlayers = response;
        this.players = [...this.allPlayers];
        console.log(response);
      },
    );
  }
  

  filterPlayers(event: Event): void {
    const teamName = (event.target as HTMLSelectElement).value;
    if (teamName === 'All') {
      this.players = [...this.allPlayers];
    } else {
      this.players = this.allPlayers.filter(player => player.teamName === teamName);
    }
  }
  
  
  uniqueTeams(): string[] {
    return [...new Set(this.allPlayers.map(player => player.teamName))];
  }
}
 