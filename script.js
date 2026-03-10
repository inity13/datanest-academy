/**
 * DataStack Pro — Storefront JavaScript
 * No external dependencies. Vanilla JS only.
 */

(function () {
  'use strict';

  // =========================================================================
  // Dark / Light Mode Toggle
  // =========================================================================
  const ThemeManager = {
    STORAGE_KEY: 'datastack-theme',

    init() {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      // Default to dark if nothing saved
      const theme = saved || 'dark';
      this.apply(theme);

      document.querySelectorAll('.theme-toggle').forEach((btn) => {
        btn.addEventListener('click', () => this.toggle());
      });
    },

    apply(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(this.STORAGE_KEY, theme);
    },

    toggle() {
      const current = document.documentElement.getAttribute('data-theme');
      this.apply(current === 'dark' ? 'light' : 'dark');
    },
  };

  // =========================================================================
  // Mobile Navigation Toggle
  // =========================================================================
  const MobileNav = {
    init() {
      const btn = document.getElementById('mobile-menu-btn');
      const nav = document.getElementById('mobile-nav');
      if (!btn || !nav) return;

      btn.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('active');
        btn.setAttribute('aria-expanded', isOpen);
        // Prevent body scroll when menu is open
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      // Close on link click
      nav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          nav.classList.remove('active');
          btn.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
    },
  };

  // =========================================================================
  // Smooth Scroll for Anchor Links
  // =========================================================================
  const SmoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
          const targetId = anchor.getAttribute('href');
          if (targetId === '#') return;
          const target = document.querySelector(targetId);
          if (!target) return;

          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });

          // Update URL without jumping
          history.pushState(null, null, targetId);
        });
      });
    },
  };

  // =========================================================================
  // Scroll Reveal Animations (IntersectionObserver)
  // =========================================================================
  const ScrollReveal = {
    init() {
      // Respect reduced motion preference
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px',
        }
      );

      document.querySelectorAll('.reveal').forEach((el) => {
        observer.observe(el);
      });
    },
  };

  // =========================================================================
  // Animated Counters
  // =========================================================================
  const AnimatedCounters = {
    init() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Just show final values
        document.querySelectorAll('[data-count]').forEach((el) => {
          el.textContent = el.getAttribute('data-count');
        });
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.animate(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );

      document.querySelectorAll('[data-count]').forEach((el) => {
        observer.observe(el);
      });
    },

    animate(el) {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const suffix = el.getAttribute('data-count-suffix') || '';
      const duration = 1500;
      const start = performance.now();

      const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        el.textContent = current.toLocaleString() + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    },
  };

  // =========================================================================
  // FAQ Accordion
  // =========================================================================
  const FaqAccordion = {
    init() {
      document.querySelectorAll('.faq-item').forEach((item) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (!question || !answer) return;

        question.addEventListener('click', () => {
          const isOpen = item.classList.contains('active');

          // Close all others
          document.querySelectorAll('.faq-item.active').forEach((other) => {
            if (other !== item) {
              other.classList.remove('active');
              const otherAnswer = other.querySelector('.faq-answer');
              if (otherAnswer) otherAnswer.style.maxHeight = '0';
              other
                .querySelector('.faq-question')
                ?.setAttribute('aria-expanded', 'false');
            }
          });

          // Toggle current
          if (isOpen) {
            item.classList.remove('active');
            answer.style.maxHeight = '0';
            question.setAttribute('aria-expanded', 'false');
          } else {
            item.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + 'px';
            question.setAttribute('aria-expanded', 'true');
          }
        });
      });
    },
  };

  // =========================================================================
  // Code Snippet Tab Switching
  // =========================================================================
  const CodeTabs = {
    init() {
      document.querySelectorAll('.code-tabs').forEach((tabGroup) => {
        const tabs = tabGroup.querySelectorAll('.code-tab');
        const container = tabGroup.closest('.featured-code');
        if (!container) return;
        const panels = container.querySelectorAll('.code-panel');

        tabs.forEach((tab) => {
          tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');

            // Deactivate all
            tabs.forEach((t) => {
              t.classList.remove('active');
              t.setAttribute('aria-selected', 'false');
            });
            panels.forEach((p) => p.classList.remove('active'));

            // Activate clicked
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            const targetPanel = container.querySelector(
              `[data-panel="${target}"]`
            );
            if (targetPanel) targetPanel.classList.add('active');
          });
        });
      });
    },
  };

  // =========================================================================
  // Copy to Clipboard
  // =========================================================================
  const CopyClipboard = {
    init() {
      document.querySelectorAll('.copy-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const codeBlock = btn.closest('.code-block');
          if (!codeBlock) return;

          const code = codeBlock.querySelector('code');
          if (!code) return;

          const text = code.textContent;

          navigator.clipboard
            .writeText(text)
            .then(() => {
              const original = btn.textContent;
              btn.textContent = 'Copied!';
              btn.classList.add('copied');
              setTimeout(() => {
                btn.textContent = original;
                btn.classList.remove('copied');
              }, 2000);
            })
            .catch(() => {
              // Fallback for older browsers
              const textarea = document.createElement('textarea');
              textarea.value = text;
              textarea.style.position = 'fixed';
              textarea.style.opacity = '0';
              document.body.appendChild(textarea);
              textarea.select();
              try {
                document.execCommand('copy');
                const original = btn.textContent;
                btn.textContent = 'Copied!';
                btn.classList.add('copied');
                setTimeout(() => {
                  btn.textContent = original;
                  btn.classList.remove('copied');
                }, 2000);
              } catch (_) {
                btn.textContent = 'Failed';
                setTimeout(() => {
                  btn.textContent = 'Copy';
                }, 2000);
              }
              document.body.removeChild(textarea);
            });
        });
      });
    },
  };

  // =========================================================================
  // Bundle Savings Calculator
  // =========================================================================
  const BundleCalculator = {
    init() {
      const el = document.getElementById('bundle-savings-amount');
      if (!el) return;

      // Prices in cents from config
      const prices = {
        'databricks-starter-kit': 3900,
        'pyspark-utils-library': 2900,
        'databricks-audit-toolkit': 4900,
        'medallion-architecture-guide': 1900,
        'unity-catalog-governance-pack': 3900,
        'spark-performance-masterclass': 5900,
      };

      const total = Object.values(prices).reduce((a, b) => a + b, 0);
      const discountPercent = 30;
      const bundlePrice = Math.round(total * (1 - discountPercent / 100));
      const savings = total - bundlePrice;

      el.textContent = '$' + (savings / 100).toFixed(0);
    },
  };

  // =========================================================================
  // Header scroll effect
  // =========================================================================
  const HeaderScroll = {
    init() {
      const header = document.querySelector('.site-header');
      if (!header) return;

      let ticking = false;
      window.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            if (window.scrollY > 50) {
              header.classList.add('scrolled');
            } else {
              header.classList.remove('scrolled');
            }
            ticking = false;
          });
          ticking = true;
        }
      });
    },
  };

  // =========================================================================
  // Initialize All Modules
  // =========================================================================
  function init() {
    ThemeManager.init();
    MobileNav.init();
    SmoothScroll.init();
    ScrollReveal.init();
    AnimatedCounters.init();
    FaqAccordion.init();
    CodeTabs.init();
    CopyClipboard.init();
    BundleCalculator.init();
    HeaderScroll.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
