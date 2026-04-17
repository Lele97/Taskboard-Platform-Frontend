import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {


  constructor(
    private

  readonly;
  http: HttpClient;
,
) {
}

getBoardAnalitycs();
{
  return this.http.get(this.platformId + '/analytics/board');
}


}
