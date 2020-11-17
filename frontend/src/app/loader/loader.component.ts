import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable, of } from 'rxjs';
import { LoaderService } from './loader.service';
import { LoaderState } from './loader';
import { delay } from 'q';
@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit, OnDestroy {
  show:boolean = false;
  private subscription: Subscription;
  constructor(private loaderService: LoaderService) { }
  ngOnInit() {
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
            this.show = state.show;

      });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}