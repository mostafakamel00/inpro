import { Component, EventEmitter, Output } from '@angular/core';
import { MemberRole } from 'src/app/shared/model/team-role';
import { MemberStatus } from 'src/app/shared/model/team-status';

@Component({
  selector: 'app-team-filter',
  templateUrl: './team-filter.component.html',
  styleUrls: ['./team-filter.component.scss']
})
export class TeamFilterComponent {
  @Output() handleFilter = new EventEmitter<any>();
  memberStatus = MemberStatus
  memberRole = MemberRole
  selectedRole: string = 'all';
  selectedStatus: string = 'all';

  onFilterChange(e: any, col: string) {
    let filterValue = { filterVal: e.value, col: col }
    this.handleFilter.emit(filterValue)
  }
}
