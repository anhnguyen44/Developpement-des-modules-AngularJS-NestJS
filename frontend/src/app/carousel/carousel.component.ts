import { animate, AnimationBuilder, AnimationFactory, AnimationPlayer, style } from '@angular/animations';
import { AfterViewInit, Component, ContentChildren, Directive, ElementRef,
  Input, QueryList, ViewChild, ViewChildren, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CarouselItemDirective } from './carousel-item.directive';

@Directive({
  selector: '.carousel-item'
})
export class CarouselItemElement {
}

@Component({
  selector: 'carousel',
  exportAs: 'carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements AfterViewInit, OnDestroy {
  @ContentChildren(CarouselItemDirective) items: QueryList<CarouselItemDirective>;
  @ViewChildren(CarouselItemElement, { read: ElementRef }) private itemsElements: QueryList<ElementRef>;
  @ViewChild('carousel') private carousel: ElementRef;
  @Input() timing = '500ms ease-in';
  @Input() delay = 5;
  @Input() showControls = true;
  private player: AnimationPlayer;
  private itemWidth: number;
  public timer: NodeJS.Timer;
  private sens: number = 1;
  private currentSlide = 0;
  private lenght = 0;
  carouselWrapperStyle = {};

  next() {
    if (this.currentSlide + 1 === this.items.length) { return; }
    this.currentSlide = (this.currentSlide + 1) % this.items.length;
    const offset = this.currentSlide * this.itemWidth;
    const myAnimation: AnimationFactory = this.buildAnimation(offset);
    if (this.carousel.nativeElement && this.currentSlide) {
      this.player = myAnimation.create(this.carousel.nativeElement);
      this.player.play();
    }
  }

  private buildAnimation(offset) {
    return this.builder.build([
      animate(this.timing, style({ transform: `translateX(-${offset}px)` }))
    ]);
  }

  prev() {
    if (this.currentSlide === 0) { return; }

    this.currentSlide = ((this.currentSlide - 1) + this.items.length) % this.items.length;
    const offset = this.currentSlide * this.itemWidth;

    const myAnimation: AnimationFactory = this.buildAnimation(offset);
    if (this.carousel.nativeElement && this.currentSlide) {
      this.player = myAnimation.create(this.carousel.nativeElement);
      this.player.play();
    }
  }

  constructor(private builder: AnimationBuilder) {
  }

  stop() {
    clearInterval(this.timer);
  }

  ngAfterViewInit() {
    // For some reason only here I need to add setTimeout, in my local env it's working without this.
    const self = this;
    setTimeout(() => {
      this.itemWidth = this.itemsElements.first.nativeElement.getBoundingClientRect().width;
      this.carouselWrapperStyle = {
        width: `${this.itemWidth}px`,
      };
      self.lenght = self.items.length;

      let isDejaPasse = false;
      self.timer = setInterval(function () {
        if (self.currentSlide === self.lenght - 1) {
          self.sens = -1;
        } else if (isDejaPasse && self.currentSlide === 0) {
          self.sens = 1;
        }

        if (self.sens > 0) {
          isDejaPasse = true;
          self.next();
        } else {
          self.prev();
        }

      }, self.delay * 1000);
    });
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.ngAfterViewInit();
  }
}
