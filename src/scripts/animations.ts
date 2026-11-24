import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

let lenisInstance: Lenis | null = null;
let tickerCallback: ((time: number) => void) | null = null;
let splitInstances: SplitText[] = [];
let gsContext: gsap.Context | null = null;

function cleanupMotion() {
  if (gsContext) {
    gsContext.revert();
    gsContext = null;
  }

  splitInstances.forEach((s) => s.revert());
  splitInstances = [];

  ScrollTrigger.getAll().forEach((st) => st.kill());

  if (tickerCallback) {
    gsap.ticker.remove(tickerCallback);
    tickerCallback = null;
  }

  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
}

function initMotion() {
  cleanupMotion();

  lenisInstance = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenisInstance.on('scroll', ScrollTrigger.update);

  tickerCallback = (time: number) => {
    lenisInstance?.raf(time * 1000);
  };

  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(0);

  gsContext = gsap.context(() => {
    // SplitText reveals
    const headings = document.querySelectorAll<HTMLElement>('.split-reveal');
    headings.forEach((heading) => {
      const split = new SplitText(heading, {
        type: 'lines,words',
        linesClass: 'overflow-hidden',
      });
      splitInstances.push(split);

      const isImmediate = heading.dataset.revealImmediate === 'true';

      gsap.from(split.words, {
        ...(isImmediate
          ? {}
          : {
              scrollTrigger: {
                trigger: heading,
                start: 'top 88%',
                toggleActions: 'play none none none',
              },
            }),
        yPercent: 110,
        opacity: 0,
        duration: 0.9,
        ease: 'power4.out',
        stagger: 0.025,
        delay: isImmediate ? 0.08 : 0,
      });
    });

    // Subtle fade-up reveals
    const fadeEls = document.querySelectorAll<HTMLElement>('.reveal-up');
    fadeEls.forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
        y: 28,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });
    });

    // Animated metric counters on case study pages
    const counters = document.querySelectorAll<HTMLElement>('[data-counter-target]');
    counters.forEach((el) => {
      const target = Number(el.dataset.counterTarget ?? '0');
      const decimals = Number.isInteger(target) ? 0 : 1;
      const obj = { val: 0 };

      gsap.to(obj, {
        val: target,
        duration: 1.4,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          once: true,
        },
        onUpdate: () => {
          el.textContent = decimals > 0 ? obj.val.toFixed(decimals) : Math.round(obj.val).toString();
        },
      });
    });
  });

  ScrollTrigger.refresh();
}

if (typeof window !== 'undefined') {
  document.addEventListener('astro:page-load', initMotion);
  document.addEventListener('astro:before-swap', cleanupMotion);
}
