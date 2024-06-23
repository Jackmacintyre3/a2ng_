import { Component } from '@angular/core';
import { ResultsService } from '../results.service';
import { Result } from '../result';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent {
  results: Result[] = [];
  rounds: string[] = [];
  currentRoundIndex: number = 0;
  searchTeam: string = '';
  
  constructor(private resultService: ResultsService) {
    this.resultService.getResults().subscribe(
      response => {
        this.results = response;
        this.rounds = this.getUniqueRounds();
        console.log(response);
      }
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

  goToPreviousRound() {
    if (this.currentRoundIndex > 0) {
      this.currentRoundIndex--;
    } else {
      this.currentRoundIndex = this.rounds.length - 1;
    }
  }

  goToNextRound() {
    if (this.currentRoundIndex < this.rounds.length - 1) {
      this.currentRoundIndex++;
    } else {
      this.currentRoundIndex = 0;
    }
  }

  getCurrentRound(): string {
    return this.rounds[this.currentRoundIndex];
  }

  getPreviousRound(): string {
    const prevIndex = this.currentRoundIndex === 0 ? this.rounds.length - 1 : this.currentRoundIndex - 1;
    return this.rounds[prevIndex];
  }

  getNextRound(): string {
    const nextIndex = this.currentRoundIndex === this.rounds.length - 1 ? 0 : this.currentRoundIndex + 1;
    return this.rounds[nextIndex];
  }
  
  get filteredResults(): Result[] {
    return this.results.filter(result => {
      return result.team1.toLowerCase().includes(this.searchTeam.toLowerCase()) ||
             result.team2.toLowerCase().includes(this.searchTeam.toLowerCase());
    });
  }
}
