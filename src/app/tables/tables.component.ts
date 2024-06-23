import { Component } from '@angular/core';
import { DivResultsService } from '../div-results.service';
import { resultDiv } from '../resultDiv';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})
export class TablesComponent {
  results: resultDiv[] = [];
  standings: any[] = [];

  constructor(private divResultsService: DivResultsService) {
    this.divResultsService.getResults().subscribe(
      response => {
        this.results = response.filter(result => !(result.team1Goals === 0 && result.team2Goals === 0 && result.team1Points === 0 && result.team2Points === 0));
        this.calculateStandings();
      }
    );
  }

  calculateStandings() {
    const teamsMap = new Map<string, any>();

    this.results.forEach(result => {
      const team1Key = result.team1;
      const team2Key = result.team2;

      if (!teamsMap.has(team1Key)) {
        teamsMap.set(team1Key, {
          team: team1Key,
          played: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          scoresFor: 0,
          scoresAgainst: 0,
          points: 0,
          diff: 0
        });
      }

      if (!teamsMap.has(team2Key)) {
        teamsMap.set(team2Key, {
          team: team2Key,
          played: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          scoresFor: 0,
          scoresAgainst: 0,
          points: 0,
          diff: 0
        });
      }

      const team1 = teamsMap.get(team1Key);
      const team2 = teamsMap.get(team2Key);

      team1.played++;
      team2.played++;

      const team1Score = result.team1Goals * 3 + result.team1Points;
      const team2Score = result.team2Goals * 3 + result.team2Points;

      team1.scoresFor += team1Score;
      team1.scoresAgainst += team2Score;
      team2.scoresFor += team2Score;
      team2.scoresAgainst += team1Score;

      const team1TotalPoints = team1.scoresFor;
      const team2TotalPoints = team2.scoresFor;

      team1.diff += team1TotalPoints - team2TotalPoints;
      team2.diff += team2TotalPoints - team1TotalPoints;

      if (team1Score > team2Score) {
        team1.wins++;
        team1.points += 2;
        team2.losses++;
      } else if (team2Score > team1Score) {
        team2.wins++;
        team2.points += 2;
        team1.losses++;
      } else {
        team1.draws++;
        team1.points += 1;
        team2.draws++;
        team2.points += 1;
      }
    });

    this.standings = Array.from(teamsMap.values());
    this.standings.sort((a, b) => {
      if (a.points !== b.points) {
        return b.points - a.points;
      } else {
        return b.diff - a.diff;
      }
    });

    this.standings.forEach((team, index) => {
      team.position = index + 1;
    });
}

}
