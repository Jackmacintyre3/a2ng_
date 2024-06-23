import { Routes } from '@angular/router';
import { TeamsComponent } from './teams/teams.component';
import { PlayersComponent } from './players/players.component';
import { ResultsComponent } from './results/results.component';
import { TablesComponent } from './tables/tables.component';
import { StatsComponent } from './stats/stats.component';
import { LoginComponent } from './login/login.component';
import { RoutesComponent } from './routes/routes.component';
import { AdminComponent } from './admin/admin.component';


export const routes: Routes = [
    { path: '', component: RoutesComponent, title: 'Routes Page'},
    { path: 'routes', component: RoutesComponent, title: 'Routes Page' },
    { path: 'teams', component: TeamsComponent, title: 'Teams Page' },
    { path: 'players', component: PlayersComponent, title: 'Players Page' },
    { path: 'results', component: ResultsComponent, title: 'Results Page' },
    { path: 'tables', component: TablesComponent, title: 'Tables Page' },
    { path: 'stats', component: StatsComponent, title: 'Stats Page' },
    { path: 'admin', component: AdminComponent, title: 'Admin Page' },
    { path: 'login', component: LoginComponent, title: 'Login Page' },

];
