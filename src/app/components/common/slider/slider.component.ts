import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SliderComponent implements OnInit, AfterViewInit {
  private xOffset: any;
  private yOffset: any;

  @Input() min;
  @Input() max;
  @Input() val;
  @Input() val2;
  @Input() input;
  @Input() input2;
  @Input() steps;
  @Input() callBack;
  @Input() direction;
  @Input() inverted;
  @Input() class;
  @Input() type;


  @ViewChild('sliderElementTemplate') sliderElement;

  private dragging: boolean;
  private sliderTrack: any;
  private sliderThumb: any;
  private sliderThumbRange: any;
  private element: any;

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.sliderElement = this.sliderElement.nativeElement;
    this.sliderTrack = this.sliderElement.childNodes[0];
    this.sliderThumb = this.sliderElement.childNodes[1];
    if (this.type === 'range') {
      this.sliderThumbRange = this.sliderElement.childNodes[2];
    }

    this.setThumbPos();
  }

  setThumbPos() {
    this.sliderThumb.classList.add('noTransition');
    if (this.type === 'range') {
      this.sliderThumbRange.classList.add('noTransition');
    }

    const range = this.max - this.min;
    const correctedStartValue = this.val - this.min;
    let percent = (correctedStartValue * 100) / range;

    if (this.inverted) {
      percent = 100 - percent;
    }

    if (this.direction === 'vertical') {
      this.sliderThumb.style.top = 'calc(' + percent + '% - ' + (this.sliderThumb.offsetHeight / 100 * percent) + 'px)';
    } else {
      this.sliderThumb.style.left = 'calc(' + percent + '% - ' + (this.sliderThumb.offsetWidth / 100 * percent) + 'px)';
    }

    const points = this.precision(this.steps);

    this.val = (Math.floor(this.val / this.steps) * this.steps).toFixed(points);

    this.sliderThumb.childNodes[0].innerHTML = this.val;
    setTimeout(() => {
      this.sliderThumb.classList.remove('noTransition');
    }, 300);

    if (this.type === 'range') {
      const correctedStartValue2 = this.val2 - this.min;
      let percent2 = (correctedStartValue2 * 100) / range;
      if (this.inverted) {
        percent2 = 100 - percent2;
      }
      if (this.direction === 'vertical') {
        this.sliderThumbRange.style.top = 'calc(' + percent2 + '% - ' + (this.sliderThumbRange.offsetHeight / 100 * percent2) + 'px)';
      } else {
        this.sliderThumbRange.style.left = 'calc(' + percent2 + '% - ' + (this.sliderThumbRange.offsetWidth / 100 * percent2) + 'px)';
      }

      const points2 = this.precision(this.steps);

      this.val2 = (Math.floor(this.val2 / this.steps) * this.steps).toFixed(points2);

      this.sliderThumbRange.childNodes[0].innerHTML = this.val2;
      setTimeout(() => {
        this.sliderThumbRange.classList.remove('noTransition');
      }, 300);
    }


  }

  dragStart(event) {

    if (event.target.classList.contains('sliderThumb')) {
      this.element = event.target;
    } else {
      this.element = event.target.parentNode;
    }

    if (this.type === 'range') {
      if (!this.element.classList.contains('sliderThumb')) {
        return false;
      }
    }
    this.element.parentNode.classList.add('hover');

    const viewportOffset = this.sliderElement.getBoundingClientRect();
    this.xOffset = viewportOffset.left;
    this.yOffset = viewportOffset.top;

    this.sliderThumb.classList.add('noTransition');
    if (this.type === 'range') {
      this.sliderThumbRange.classList.add('noTransition');
    } else {
      if (event.target.className.indexOf('sliderTrack') !== -1) {
        this.element = this.sliderThumb;
        this.sliderThumb.classList.remove('noTransition');
        this.dragging = true;
        this.dragGo(event);
      }
    }

    this.dragging = true;

    // tslint:disable-next-line:no-shadowed-variable
    document.addEventListener('mousemove', (event) => {
      this.dragGo(event);
    });
    // tslint:disable-next-line:no-shadowed-variable
    document.addEventListener('mouseup', (event) => {
      this.dragStop(event);
    });

  }

  dragGo(event) {
    if (this.dragging) {
      this.element.style.zIndex = 1;
      let x = event.x || event.pageX;
      let y = event.y || event.pageY;

      x = x - (this.element.offsetWidth / 2);
      y = y - (this.element.offsetHeight / 2);

      if (x - this.xOffset < 0) {
        x = 0;
      }
      if (y - this.yOffset < 0) {
        y = 0;
      }

      if (x - this.xOffset > this.sliderElement.offsetWidth - this.sliderThumb.offsetWidth) {
        x = this.xOffset + this.sliderElement.offsetWidth - this.sliderThumb.offsetWidth;
      }

      if (y - this.yOffset > this.sliderElement.offsetHeight - this.sliderThumb.offsetHeight) {
        y = this.yOffset + this.sliderElement.offsetHeight - this.sliderThumb.offsetHeight;
      }
      const points = this.precision(this.steps);

      if (this.direction === 'vertical') {
        let percent = (y - this.yOffset) / (this.sliderElement.offsetHeight - this.sliderThumb.offsetHeight) * 100;
        if (percent < 0) {
          percent = 0;
        }
        const val = ((percent * (this.max - this.min) / 100) + this.min).toFixed(points);
        if (this.type === 'range') {
          if (this.element.classList.contains('range')) {
            if (parseInt(val, 10) + 1 <= parseInt(this.val, 10)) {
              return false;
            }
          } else {
            if (parseInt(this.val2, 10) <= parseInt(val, 10) - 1) {
              return false;
            }
          }
        }
        if (this.inverted === true) {
          if (this.element.classList.contains('range')) {
            this.val2 = (this.max + this.min) - val;
          } else {
            this.val = (this.max + this.min) - val;
          }
          if (this.element.classList.contains('range')) {
            this.element.style.top = 'calc(' + (100 - ((this.val2 / this.max) * 100)) + '% - ' +
              (this.sliderThumb.offsetHeight / 100 * percent) + 'px)';
          } else {
            this.element.style.top = 'calc(' + (100 - ((this.val / this.max) * 100)) + '% - ' +
              (this.sliderThumb.offsetHeight / 100 * percent) + 'px)';
          }
        } else {
          if (this.element.classList.contains('range')) {
            this.val2 = val;
          } else {
            this.val = val;
          }
          if (this.element.classList.contains('range')) {
            this.element.style.top = 'calc(' + ((this.val2 / this.max) * 100) + '% - ' +
              (this.sliderThumb.offsetHeight / 100 * percent) + 'px)';
          } else {
            this.element.style.top = 'calc(' + ((this.val / this.max) * 100) + '% - ' +
              (this.sliderThumb.offsetHeight / 100 * percent) + 'px)';
          }
        }

      } else {

        let percent = (x - this.xOffset) / (this.sliderElement.offsetWidth - this.sliderThumb.offsetWidth) * 100;
        if (percent < 0) {
          percent = 0;
        }
        const val = ((percent * (this.max - this.min) / 100) + this.min).toFixed(points);

        if (this.type === 'range') {
          if (this.element.classList.contains('range')) {
            if (parseInt(val, 10) + 1 <= parseInt(this.val, 10)) {
              return false;
            }
          } else {
            if (parseInt(this.val2, 10) <= parseInt(val, 10) - 1) {
              return false;
            }
          }
        }

        if (this.inverted === true) {
          if (this.element.classList.contains('range')) {
            this.val2 = (this.max + this.min) - val;
          } else {
            this.val = (this.max + this.min) - val;
          }
          if (this.element.classList.contains('range')) {
            this.element.style.left = 'calc(' + (100 - (this.val2 / this.max) * 100) + '% - ' +
              (this.sliderThumb.offsetWidth / 100 * percent) + 'px)';
          } else {
            this.element.style.left = 'calc(' + (100 - (this.val / this.max) * 100) + '% - ' +
              (this.sliderThumb.offsetWidth / 100 * percent) + 'px)';
          }
        } else {
          if (this.element.classList.contains('range')) {
            this.val2 = val;
          } else {
            this.val = val;
          }

          if (this.element.classList.contains('range')) {
            this.element.style.left = 'calc(' + ((this.val2 / this.max) * 100) + '% - ' +
              (this.sliderThumb.offsetWidth / 100 * percent) + 'px)';
          } else {
            this.element.style.left = 'calc(' + ((this.val / this.max) * 100) + '% - ' +
              (this.sliderThumb.offsetWidth / 100 * percent) + 'px)';
          }
        }

      }
      if (this.element.classList.contains('range')) {
        // this.val2 = this.val2.toFixed(points);
        this.element.childNodes[0].innerHTML = this.val2;
      } else {
        // this.val = this.val.toFixed(points);
        this.element.childNodes[0].innerHTML = this.val;
      }
      this.cdr.markForCheck();
    }
  }

  dragStop(event) {
    this.element.style.zIndex = null;
    this.element.parentNode.classList.remove('hover');
    this.element.parentNode.querySelectorAll('div')
      .forEach((el) => {
        el.classList.remove('noTransition');
      });
    this.dragging = false;
  }

  precision(a) {
    if (!isFinite(a)) {
      return 0;
    }
    let e = 1;
    let p = 0;
    while (Math.round(a * e) / e !== a) {
      e *= 10;
      p++;
    }
    return p;
  }

}
