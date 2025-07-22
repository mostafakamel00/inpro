import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { MemberRole } from 'src/app/shared/model/team-role';
import { MemberStatus } from 'src/app/shared/model/team-status';
import { LanguageService } from 'src/app/shared/service/language.service';
import { TeamService } from 'src/app/shared/service/team.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent implements OnInit, OnDestroy {
  private _unsubscribe$ = new Subject<void>();
  memberStatus = MemberStatus;
  memberRole = MemberRole
  displayedColumns: string[] = ['name', 'role', 'status', 'performance', 'indicator'];

  members$ = this.teamService.filteredMembers$;
  currentFilters: { role?: string; status?: string } = {};
  dir$ = this.langService.dir$

  constructor(private teamService: TeamService, private langService: LanguageService) { }

  ngOnInit(): void {
    this.teamService.loadTeam();
  }

  onFilterChange(e: { filterVal: string; col: string }) {
    const value = e.filterVal === 'all' ? undefined : e.filterVal;
    this.currentFilters = {
      ...this.currentFilters,
      [e.col]: value,
    };

    this.teamService.setFilter(this.currentFilters);
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
