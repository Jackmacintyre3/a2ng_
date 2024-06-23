export interface ChartData {
    round: string;
    division: string;
    outcome: 'win' | 'draw' | 'loss';
    outcomeValue: number;
    selectedTeam: string;
    selectedTeamTotalPoints: number;
    selectedTeamGoals: number;
    selectedTeamPoints: number;
    opponentTotalPoints: number;
    opponentGoals: number;
    opponentPoints: number;
    opponentTeam: string;
}
