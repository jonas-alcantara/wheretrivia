var Slider = (function () {
    var selector = {
        slideContainer: '.slider',
        slider: '[data-slider]',
        slideItem: '.slider__item',
        activeSlideItem: '.slider__item.slider__item--active',
        sliderDots: '.slider__dots',
        sliderDot: '.slick__dot',
        activeSliderDot: '.slick__dot.active',
        slideItemButton: '.slideItem__button'
    };
    var settings = {
        activeSlide: "slider__item--active",
        activeDot: "active"
    };
    var gradients = {
        slide1: "linear-gradient(to bottom, #322e98 0%, #f8d9ff 89%, #fff5d9 111%)",
        slide2: "linear-gradient(to bottom, #495ac9 0%, #caf1ff 87%, #d9fff4 106%)",
        slide3: "linear-gradient(to bottom, #003643 0%, #d9ffe5 91%, #ffd9d9 111%)",
        slide4: "linear-gradient(to bottom, #c94985 0%, #ffdeca 91%, #d9ffdc 111%)",
    }
    function Slider(options) {
        this.options = Object.assign({}, {
            autoPlay: false,
            autoPlayInterval: 5000
        }, options);

        this.container = document.querySelector(selector.slideContainer)
        this.Slider = this.container.querySelector(selector.slider);
        if (this.Slider == null)
            return;
        this.slides = this.Slider.querySelectorAll(selector.slideItem);

        this.SliderDotContainer = this.container.querySelector(selector.sliderDots);
        this.SliderDots = this.SliderDotContainer.querySelectorAll(selector.sliderDot);
        this.ActiveSliderDot = this.SliderDotContainer.querySelector(selector.activeSliderDot);
        this.EventHandlers = {};
        this.EventHandlers.dotClicked = this._sliderDotClick.bind(this);
        this.EventHandlers.slideButtonFocusIn = this._stopAutoPlay.bind(this);
        this.EventHandlers.slideButtonFocusOut = this._startAutoPlay.bind(this);

        this._init();
    };
    Slider.prototype = Object.assign({}, Slider.prototype, {
        _init: function () {
            this._initAccessibility();
            this._initSliderDotsEventHandler();
            this._startAutoPlay();
        },
        _startAutoPlay: function () {
            this.autoTimeOut = null;

            this.autoTimeOut = window.setTimeout(
                function () {
                    var nextSlideIndex = this._getNextSlideIndex();
                    this._setActiveSlide(this.slides[nextSlideIndex]);
                    this._setActiveDot(this.SliderDots[nextSlideIndex]);
                }.bind(this),
                5000
            );
            this.autoplaying = true;
        },
        _stopAutoPlay: function () {
            if (!this.autoplaying && this.autoTimeOut == null)
                return;
            this.autoplaying = false;
            window.clearTimeout(this.autoTimeOut);
        },
        _getNextSlideIndex: function () {
            //actual index equals current index minus 1 so next index equals current index
            var currentIndex = this.activeSlide.getAttribute('data-slide-index');
            if (currentIndex == this.slides.length)
                return 0;

            return currentIndex;
        },
        _initAccessibility: function () {
            this._initSlidesAccessibility();
        },
        _initSlidesAccessibility: function () {
            if (this.slides == null)
                return;
            this.slides.forEach(slide => {
                if (slide.classList.contains(settings.activeSlide)) {
                    this.activeSlide = slide;
                    slide.setAttribute('aria-hidden', false);
                    this._setSlideButtonsFocus(slide, 0);
                }
                else {
                    slide.setAttribute('aria-hidden', true);
                    this._setSlideButtonsFocus(slide, -1);
                }
            });
        },
        _setSlideButtonsFocus: function (slide, focus) {
            slide.querySelectorAll(selector.slideItemButton).forEach(function (button) {
                button.setAttribute('tabIndex', focus);
                if (focus == -1) {
                    button.removeEventListener('mouseover', this.EventHandlers.slideButtonFocusIn);
                    button.removeEventListener('mouseout', this.EventHandlers.slideButtonFocusOut);
                    button.removeEventListener('focus', this.EventHandlers.slideButtonFocusIn);
                    button.removeEventListener('focusout', this.EventHandlers.slideButtonFocusOut);
                }
                else {
                    button.addEventListener('mouseover', this.EventHandlers.slideButtonFocusIn);
                    button.addEventListener('mouseout', this.EventHandlers.slideButtonFocusOut);
                    button.addEventListener('focus', this.EventHandlers.slideButtonFocusIn);
                    button.addEventListener('focusout', this.EventHandlers.slideButtonFocusOut);
                }
            }.bind(this));
        },
        _initSliderDotsEventHandler: function () {
            this.SliderDots.forEach(function (dot) {
                dot.addEventListener('click', this.EventHandlers.dotClicked);
            }.bind(this));
        },
        _sliderDotClick: function (evt) {
            evt.preventDefault();
            this._stopAutoPlay();
            var evtSource = evt.currentTarget;
            var target = evtSource.getAttribute('data-target');
            if (this.activeSlide.id == target)
                return;
            var targetSlide = this.Slider.querySelector('#' + target + selector.slideItem);

            this._setActiveSlide(targetSlide);
            this._setActiveDot(evtSource);
            this._setDocumentGradientBackground(gradients[target]);
        },
        _setDocumentGradientBackground: function (gradient) {
            document.querySelector('html').style.backgroundImage = gradient;
        },
        _setActiveDot: function (dot) {
            this.ActiveSliderDot.classList.remove(settings.activeDot);
            this.ActiveSliderDot = dot;
            this.ActiveSliderDot.classList.add(settings.activeDot);
        },
        _setActiveSlide: function (targetSlide) {
            this.activeSlide.classList.remove(settings.activeSlide);
            this.activeSlide.setAttribute('aria-hidden', true);
            this._setSlideButtonsFocus(this.activeSlide, -1);

            this._setSlideButtonsFocus(targetSlide, 0);
            this.activeSlide = targetSlide;
            this.activeSlide.classList.add(settings.activeSlide);
            this.activeSlide.setAttribute('aria-hidden', false);

            this._startAutoPlay();
        }
    });

    return Slider;
})();
var slide;
document.addEventListener('DOMContentLoaded', function () {
    slide = new Slider({
        autoPlay: true,
        autoPlayInterval: 5000
    });
});
