import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit, AfterViewInit {
  private xOffset: any;
  private yOffset: any;

  @Input() min;
  @Input() max;
  @Input() val;
  @Input() input;
  @Input() steps;
  @Input() callBack;
  @Input() direction;
  @Input() inverted;
  @Input() class;

  @ViewChild('sliderElementTemplate') sliderElement;

  private dragging: boolean;
  private sliderTrack: any;
  private sliderThumb: any;

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.sliderElement = this.sliderElement.nativeElement;
    this.sliderTrack = this.sliderElement.childNodes[0];
    this.sliderThumb = this.sliderElement.childNodes[1];
    this.setThumbPos();
  }

  setThumbPos() {
    this.sliderThumb.classList.add('noTransition');
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

    this.sliderThumb.innerHTML = this.val;
    setTimeout(() => {
      this.sliderThumb.classList.remove('noTransition');
    }, 300);
  }

  dragStart(event) {
    this.xOffset = this.sliderElement.offsetLeft;
    this.yOffset = this.sliderElement.offsetTop;
    this.sliderThumb.classList.add('noTransition');
    if (event.target.className.indexOf('sliderTrack') !== -1) {
      this.sliderThumb.classList.remove('noTransition');
      this.dragging = true;
      this.dragGo(event);
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

      let x = event.x || event.pageX;
      let y = event.y || event.pageY;

      x = x - (this.sliderThumb.offsetWidth / 2);
      y = y - (this.sliderThumb.offsetHeight / 2);

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

      if (this.direction === 'vertical') {
        const percent = (y - this.yOffset) / (this.sliderElement.offsetHeight - this.sliderThumb.offsetHeight) * 100;

        const val = (percent * (this.max - this.min) / 100) + this.min;

        const points = this.precision(this.steps);
        if (this.inverted === true) {
          this.val = ((this.max + this.min) - (Math.floor(val / this.steps) * this.steps)).toFixed(points);
        } else {
          this.val = (Math.floor(val / this.steps) * this.steps).toFixed(points);
        }

        this.sliderThumb.style.top = 'calc(' + percent + '% - ' + (this.sliderThumb.offsetHeight / 100 * percent) + 'px)';
      } else {
        const percent = (x - this.xOffset) / (this.sliderElement.offsetWidth - this.sliderThumb.offsetWidth) * 100;

        const val = (percent * (this.max - this.min) / 100) + this.min;

        const points = this.precision(this.steps);
        if (this.inverted === true) {
          this.val = ((this.max + this.min) - (Math.floor(val / this.steps) * this.steps)).toFixed(points);
        } else {
          this.val = (Math.floor(val / this.steps) * this.steps).toFixed(points);
        }

        this.sliderThumb.style.left = 'calc(' + percent + '% - ' + (this.sliderThumb.offsetWidth / 100 * percent) + 'px)';
      }

      this.sliderThumb.innerHTML = this.val;
    }
  }

  dragStop(event) {
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
