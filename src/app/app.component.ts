import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, repeatWhen, Subject, switchMap, takeUntil, timer} from "rxjs";
import {PollingService} from "./services/polling.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  private stopStream = new Subject();
  private startStream = new Subject();
  public observeStream$!: Observable<any>;

  constructor(private pollingService: PollingService) {
  }

  ngOnInit(): void {
    this.observeStream$ = timer(0, 10000)
      .pipe(
        switchMap(() => this.pollingService.fetchUrl()),
        takeUntil(this.stopStream),
        repeatWhen(() => this.startStream)
      )
  }

  start(): void{
    this.startStream.next(event);
    console.log('startstream')
  }

  stop(): void {
    this.stopStream.next(event);
    console.log('stopstream')
  }

  ngOnDestroy() {
    this.startStream.unsubscribe();
    this.stopStream.unsubscribe();
  }

}
