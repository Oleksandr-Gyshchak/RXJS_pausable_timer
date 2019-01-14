import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { interval, timer, Subject, of, empty, BehaviorSubject, fromEvent, merge } from 'rxjs';
import { takeUntil, switchMap, withLatestFrom, filter, map, debounceTime, mapTo, startWith, scan } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements AfterViewInit {
  @ViewChild('btnStartStop') btnStartStop: ElementRef;
  @ViewChild('btnPause') btnPause: ElementRef;
  @ViewChild('btnReset') btnReset: ElementRef;

  timerValue: Number = 0;
  resetTimer$ = new Subject();

  constructor() { }

  ngAfterViewInit() {

    const pause$ = fromEvent(this.btnPause.nativeElement, 'click')
      .pipe(
        debounceTime(300),
        mapTo('pause')
      );

    const resume$ = fromEvent(this.btnStartStop.nativeElement, 'click')
      .pipe(
        mapTo('resume')
      );

    const reset$ = fromEvent(this.btnReset.nativeElement, 'click');
    reset$.subscribe(() => {
      this.resetTimer$.next();
      this.timerValue = 0;
      this.initTimer(pause$, resume$);
    });

    this.initTimer(pause$, resume$);
  }
  private initTimer(pause$, resume$) {

    merge(pause$, resume$)
      .pipe(
        startWith(0),
        switchMap(val => {
          return (val === 'pause') ? empty() : interval(1000).pipe(mapTo(1));
        }),
        takeUntil(this.resetTimer$),
        scan((accumulator, curr) => {
          console.log(accumulator, curr);
          return accumulator + curr;
        })
      )
      .subscribe(
        timerVal => this.timerValue = timerVal
      );
  }

}



