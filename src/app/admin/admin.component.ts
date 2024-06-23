import { Component, OnInit } from '@angular/core';
import { ResultsService } from '../results.service';
import { Result } from '../result';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  results: Result[] = [];
  rounds: string[] = [];
  currentRoundIndex: number = 0;
  searchTeam: string = '';

  constructor(private resultService: ResultsService) {
    this.fetchResults();

   }

  fetchResults(): void {
    this.resultService.getResults().subscribe(
      (response: Result[]) => {
        this.results = response;
        this.rounds = this.getUniqueRounds();
      },
      error => console.error('Failed to fetch results:', error)
    );
  }

  getUniqueRounds(): string[] {
    const uniqueRounds: string[] = [];
    for (let result of this.results) {
      if (!uniqueRounds.includes(String(result.division))) {
        uniqueRounds.push(String(result.division));
      }
    }
    return uniqueRounds;
  }

  get filteredResults(): Result[] {
    return this.results.filter(result => {
      return result.team1.toLowerCase().includes(this.searchTeam.toLowerCase()) ||
             result.team2.toLowerCase().includes(this.searchTeam.toLowerCase());
    });
  }

  deleteResult(result: Result): void {
    this.resultService.deleteResult(result.id).subscribe(
      response => {
        this.results = this.results.filter(r => r !== result);
      },
    );
  }

  updateResult(updateResult: Result): void {
    const [team1Goals, team1Points] = updateResult.team1Score.split('-').map(Number);
    const [team2Goals, team2Points] = updateResult.team2Score.split('-').map(Number);

    updateResult.team1Goals = team1Goals;
    updateResult.team1Points = team1Points;
    updateResult.team2Goals = team2Goals;
    updateResult.team2Points = team2Points;

    this.resultService.updateResult(updateResult.id, updateResult).subscribe({
      next: response => {
        window.location.reload();
      },
    });
  }
}
