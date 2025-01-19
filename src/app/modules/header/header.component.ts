import {
  Component,
  OnInit,
  HostListener,
  Renderer2,
  Inject,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import AOS from 'aos';
import GLightbox from 'glightbox';
import PureCounter from '@srexi/purecounterjs';
import Swiper from 'swiper'; // Import Swiper

@Component({
  selector: 'fourin-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.toggleScrolledClass();
    this.toggleScrollTopVisibility();
    this.updateNavmenuScrollspy();
  }

  @HostListener('window:load', [])
  onWindowLoad(): void {
    this.toggleScrolledClass();
    this.toggleScrollTopVisibility();
  }

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.initMobileNavToggle();
    this.initNavmenuScrollspy();
    this.initDropdownToggle();
    this.initScrollTop();
    this.initAOS();
    this.initGLightbox();
    // this.initPureCounter();
    this.initSwiper();
    this.removePreloaderOnLoad();
    this.correctScrollPositionOnLoad();
  }

  private toggleScrolledClass(): void {
    const body = document.querySelector('body');
    const header = document.querySelector('#header');
    if (
      header?.classList.contains('scroll-up-sticky') ||
      header?.classList.contains('sticky-top') ||
      header?.classList.contains('fixed-top')
    ) {
      window.scrollY > 100
        ? body?.classList.add('scrolled')
        : body?.classList.remove('scrolled');
    }
  }

  private initMobileNavToggle(): void {
    const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
    if (mobileNavToggleBtn) {
      mobileNavToggleBtn.addEventListener('click', () => {
        const body = document.querySelector('body');
        body?.classList.toggle('mobile-nav-active');
        mobileNavToggleBtn.classList.toggle('bi-list');
        mobileNavToggleBtn.classList.toggle('bi-x');
      });
    }
  }

  private initNavmenuScrollspy(): void {
    const navmenuLinks = document.querySelectorAll('.navmenu a');
    navmenuLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (document.querySelector('.mobile-nav-active')) {
          const mobileNavToggleBtn = document.querySelector(
            '.mobile-nav-toggle'
          ) as HTMLElement;
          mobileNavToggleBtn?.click();
        }
      });
    });
  }

  private updateNavmenuScrollspy(): void {
    const navmenuLinks = document.querySelectorAll('.navmenu a');
    navmenuLinks.forEach((link) => {
      const anchorLink = link as HTMLAnchorElement; // Cast to HTMLAnchorElement
      if (!anchorLink.hash) return;
      const section = document.querySelector(anchorLink.hash);
      if (!section) return;
      const sectionElement = section as HTMLElement; // Cast to HTMLElement
      const position = window.scrollY + 200;
      if (
        position >= sectionElement.offsetTop &&
        position <= sectionElement.offsetTop + sectionElement.offsetHeight
      ) {
        document
          .querySelectorAll('.navmenu a.active')
          .forEach((activeLink) => activeLink.classList.remove('active'));
        anchorLink.classList.add('active');
      } else {
        anchorLink.classList.remove('active');
      }
    });
  }

  private initDropdownToggle(): void {
    const dropdownToggles = document.querySelectorAll(
      '.navmenu .toggle-dropdown'
    );
    dropdownToggles.forEach((toggle) => {
      toggle.addEventListener('click', (event) => {
        event.preventDefault();
        toggle.parentElement?.classList.toggle('active');
        toggle.parentElement?.nextElementSibling?.classList.toggle(
          'dropdown-active'
        );
        event.stopImmediatePropagation();
      });
    });
  }

  private initScrollTop(): void {
    const scrollTop = document.querySelector('.scroll-top');
    scrollTop?.addEventListener('click', (event) => {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  private toggleScrollTopVisibility(): void {
    const scrollTop = document.querySelector('.scroll-top');
    if (scrollTop) {
      window.scrollY > 100
        ? scrollTop.classList.add('active')
        : scrollTop.classList.remove('active');
    }
  }

  private removePreloaderOnLoad(): void {
    const preloader = document.querySelector('#preloader');
    if (preloader) {
      window.addEventListener('load', () => preloader.remove());
    }
  }

  private correctScrollPositionOnLoad(): void {
    if (window.location.hash) {
      const section = document.querySelector(
        window.location.hash
      ) as HTMLElement;
      if (section) {
        setTimeout(() => {
          const scrollMarginTop = parseInt(
            getComputedStyle(section).scrollMarginTop
          );
          window.scrollTo({
            top: section.offsetTop - scrollMarginTop,
            behavior: 'smooth',
          });
        }, 100);
      }
    }
  }

  private initAOS(): void {
    // Replace AOS.init with its Angular-compatible initialization
    import('aos').then((AOS) =>
      AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
      })
    );
  }

  private initGLightbox(): void {
    // Replace GLightbox initialization with its Angular-compatible version
    import('glightbox').then(({ default: GLightbox }) =>
      GLightbox({ selector: '.glightbox' })
    );
  }

  // private initPureCounter(): void {
  //   // Replace PureCounter initialization with its Angular-compatible version
  //   import('@srexi/purecounterjs').then(({ PureCounter }) => new PureCounter());
  // }

  private initSwiper(): void {
    import('swiper').then(({ default: Swiper }) => {
      document.querySelectorAll('.init-swiper').forEach((swiperElement) => {
        const config = JSON.parse(
          swiperElement.querySelector('.swiper-config')!.textContent!.trim()
        );
        new Swiper(swiperElement as HTMLElement, config);
      });
    });
  }
}
