import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamLayoutComponent } from './shared/components/team-layout/team-layout.component';

const routes: Routes = [
  {
    path: '',
    component: TeamLayoutComponent,
    loadChildren: () => import('./view/team/team.module').then((m) => m.TeamModule)
  },
  {
    path: 'team',
    redirectTo: '',
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
