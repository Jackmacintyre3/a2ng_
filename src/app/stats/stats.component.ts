import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatsService } from '../stats.service';
import { Result } from '../result';
import { Team } from '../team';
import * as d3 from 'd3';
import { ChartData } from '../chart-data';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})

export class StatsComponent {
  @ViewChild('scoresChart', { static: true }) private scoresChartContainer!: ElementRef;
  @ViewChild('formChart', { static: false }) private formChartContainer!: ElementRef;
  chartData: ChartData[] = [];
  teams: Team[] = [];
  selectedTeamId: string = '0';
  selectedTeamName: string = '';

  constructor(private statsService: StatsService) {
    this.statsService.getTeams().subscribe({
      next: teams => this.teams = teams,
    });
  }

  fetchResultsForTeam(teamId: string): void {
    this.statsService.getResults().subscribe(results => {
      this.formatResults(results, teamId);
      this.createBarChart();
      this.createFormChart();
    });
  }

  onTeamSelect(): void {
    this.selectedTeamName = this.teams.find(team => team.id.toString() === this.selectedTeamId)?.name || '';
    if (this.selectedTeamId && this.selectedTeamId !== '0') {
      this.fetchResultsForTeam(this.selectedTeamId);
    } else {
      this.clearCharts();
    }
  }

  formatResults(results: Result[], teamId: string): void {
    this.chartData = results.filter(result =>
      result.team1ID.toString() === teamId || result.team2ID.toString() === teamId
    ).map(result => {
      let isTeam1 = result.team1ID.toString() === teamId;
      let selectedTeamTotalPoints = isTeam1 ? this.calculateTotalPoints(result.team1Goals, result.team1Points) : this.calculateTotalPoints(result.team2Goals, result.team2Points);
      let opponentTotalPoints = !isTeam1 ? this.calculateTotalPoints(result.team1Goals, result.team1Points) : this.calculateTotalPoints(result.team2Goals, result.team2Points);
  
      const outcome = selectedTeamTotalPoints > opponentTotalPoints ? 'win' : selectedTeamTotalPoints === opponentTotalPoints ? 'draw' : 'loss';
      const outcomeValue = outcome === 'win' ? 2 : outcome === 'draw' ? 1 : 0;
  
      return { round: `Round ${result.round}`,
        division: result.division.toString(),
        selectedTeam: isTeam1 ? result.team1 : result.team2,
        selectedTeamTotalPoints,
        selectedTeamGoals: isTeam1 ? result.team1Goals : result.team2Goals,
        selectedTeamPoints: isTeam1 ? result.team1Points : result.team2Points,
        opponentTotalPoints,
        opponentGoals: !isTeam1 ? result.team1Goals : result.team2Goals,
        opponentPoints: !isTeam1 ? result.team1Points : result.team2Points,
        opponentTeam: isTeam1 ? result.team2 : result.team1,
        outcome,
        outcomeValue

      };
    });
    console.log('Processed chartData:', this.chartData);
  }
  
  calculateTotalPoints(goals: number, points: number): number {
    return goals * 3 + points;
  }

  calculateMax(data: ChartData[]): number {
    let max = 0; 
    data.forEach(d => {
        if (d.selectedTeamTotalPoints > max) {
            max = d.selectedTeamTotalPoints; 
        }
        if (d.opponentTotalPoints > max) {
            max = d.opponentTotalPoints;
        }
    });
    return max;
  }

  createBarChart(): void {
    if (this.chartData.length === 0 || !this.scoresChartContainer) {
      return; 
    }
  
    d3.select(this.scoresChartContainer.nativeElement).select('svg').remove();
  
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const width = this.scoresChartContainer.nativeElement.offsetWidth - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;
  
    const svg = d3.select(this.scoresChartContainer.nativeElement)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
  
    const rounds = this.chartData.map((d, i) => 'Round ' + (i + 1));
    const x0 = d3.scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.1)
      .domain(rounds);
  
    const x1 = d3.scaleBand()
      .padding(0.2)
      .domain(['selectedTeam', 'opponentTeam'])
      .rangeRound([0, x0.bandwidth()]);
  
    const y = d3.scaleLinear()
      .domain([0, this.calculateMax(this.chartData)])
      .range([height, 0]).nice();
  
    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x0));
  
    svg.append('g')
      .attr('class', 'y axis')
      .call(d3.axisLeft(y));
  
    const roundG = svg.selectAll(".round")
      .data(this.chartData)
      .enter().append("g")
      .attr("class", "g")
      .attr("transform", (d, i) => `translate(${x0(rounds[i])},0)`);
  
    roundG.selectAll(".selectedTeamBar")
      .data(d => [d])
      .enter().append("rect")
      .attr("class", "selectedTeamBar")
      .attr("x", x1('selectedTeam') ?? 0)
      .attr("y", d => y(d.selectedTeamTotalPoints))
      .attr("width", x1.bandwidth())
      .attr("height", d => height - y(d.selectedTeamTotalPoints))
      .attr("fill", "rgb(0,0,255)");
  
    roundG.selectAll(".opponentBar")
      .data(d => [d])
      .enter().append("rect")
      .attr("class", "opponentBar")
      .attr("x", x1('opponentTeam') ?? 0)
      .attr("y", d => y(d.opponentTotalPoints))
      .attr("width", x1.bandwidth())
      .attr("height", d => height - y(d.opponentTotalPoints))
      .attr("fill", "rgb(255,0,0)");
  
    roundG.selectAll(".dataLabel")
      .data(d => [d])
      .enter().append("text")
      .attr("class", "dataLabel")
      .attr("x", d => x1('selectedTeam')! + x1.bandwidth() / 2)
      .attr("y", d => y(d.selectedTeamTotalPoints) + 20)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .text(d => `${d.selectedTeamGoals}-${d.selectedTeamPoints}`);
  
    roundG.selectAll(".opponentDataLabel")
      .data(d => [d])
      .enter().append("text")
      .attr("class", "opponentDataLabel")
      .attr("x", d => x1('opponentTeam')! + x1.bandwidth() / 2)
      .attr("y", d => y(d.opponentTotalPoints) + 20)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .text(d => `${d.opponentGoals}-${d.opponentPoints}`);
  }
  
  createFormChart(): void {
    if (this.chartData.length === 0 || !this.formChartContainer) {
      return;
    }
  
    d3.select(this.formChartContainer.nativeElement).select('svg').remove();
  
    const margin = { top: 40, right: 40, bottom: 50, left: 40 };
    const width = 960 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;
  
    const svg = d3.select(this.formChartContainer.nativeElement)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
  
    const x = d3.scaleLinear()
      .domain([0, 3]) 
      .range([0, width]);
  
    const y = d3.scaleLinear()
      .domain([0, 14])
      .range([height, 0]);
  
    svg.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y).ticks(15));
  
    let cumulativeOutcome = 0;
    this.chartData.slice(0, 4).forEach((d: ChartData, i: number) => {
      cumulativeOutcome += (d.outcome === 'win' ? 2 : d.outcome === 'draw' ? 1 : 0);
  
      const circleX = x(i);
  
      svg.append("circle")
        .attr("class", "dot")
        .attr("cx", circleX)
        .attr("cy", y(cumulativeOutcome))
        .attr("r", 10)
        .attr("fill", d.outcome === 'win' ? 'blue' : d.outcome === 'draw' ? 'yellow' : 'red');
  
      svg.append("text")
        .attr("x", circleX)
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .text(`Rd ${d.division}: ${d.opponentTeam}`);
    });
  
    const xAxisScale = d3.scaleBand()
      .domain(this.chartData.slice(0, 4).map((_, i) => `Round ${i + 1}`))
      .range([0, width])
      .padding(0.1);
  
    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xAxisScale));
  }
  
  clearCharts(): void {
    d3.select(this.scoresChartContainer.nativeElement).select('svg').remove();
    d3.select(this.formChartContainer.nativeElement).select('svg').remove();
  }
}