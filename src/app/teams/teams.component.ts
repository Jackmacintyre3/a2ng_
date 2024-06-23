import { Component } from '@angular/core';
import { TeamsService } from '../teams.service';
import { Team } from '../team';

@Component({
  selector: 'app-teams',
  standalone: true,
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent {
  teams: Team[] = [];

  constructor(private teamService: TeamsService) {
    this.teamService.getTeams().subscribe(
      response => {
        this.teams = response;
        console.log(response);
      }
    );
  }

  formatTeamName(name: string): string {
    return `${name} (${name.substr(0, 3).toUpperCase()})`;
  }
}
