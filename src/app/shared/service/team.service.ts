import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { member } from '../model/team';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private dataUrl = 'assets/data/team.json';

  private allMembersSubject = new BehaviorSubject<member[]>([]);
  private filterSubject = new BehaviorSubject<{ role?: string; status?: string }>({});

  public filteredMembers$: Observable<member[]> = this.filterSubject.pipe(
    map(filter => {
      const members = this.allMembersSubject.getValue();
      return members.filter(m =>
        (!filter.role || m.role === filter.role) &&
        (!filter.status || m.status === filter.status)
      );
    })
  );

  constructor(private http: HttpClient) { }

  loadTeam(): void {
    this.http.get<member[]>(this.dataUrl).subscribe(data => {
      this.allMembersSubject.next(data);
      this.filterSubject.next(this.filterSubject.getValue());
    });
  }

  setFilter(filter: { role?: string; status?: string }) {
    this.filterSubject.next(filter);
  }
}
