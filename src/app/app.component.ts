import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NavComponent } from './nav/nav.component';
import { PlayersComponent } from './players/players.component';
import { ResultsComponent } from './results/results.component';
import { StatsComponent } from './stats/stats.component';
import { TablesComponent } from './tables/tables.component';
import { TeamsComponent } from './teams/teams.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterOutlet, LoginComponent, NavComponent, PlayersComponent, 
    ResultsComponent, StatsComponent, TablesComponent, TeamsComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'a2ng';
}

