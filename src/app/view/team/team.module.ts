import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamRoutingModule } from './team-routing.module';
import { TeamComponent } from './team/team.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TeamFilterComponent } from './team-filter/team-filter.component';
import { NgxStarsModule } from 'ngx-stars';


@NgModule({
  declarations: [
    TeamComponent,
    TeamFilterComponent
  ],
  imports: [
    CommonModule,
    TeamRoutingModule,
    SharedModule,
    NgxStarsModule
  ]
})
export class TeamModule { }
