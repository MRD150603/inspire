(function(){
  'use strict';

  /* ---------- Sticky nav ---------- */
  var nav = document.getElementById('nav');
  function onScrollNav(){
    if(window.scrollY > 40){ nav.classList.add('is-scrolled'); }
    else{ nav.classList.remove('is-scrolled'); }
  }
  document.addEventListener('scroll', onScrollNav, {passive:true});
  onScrollNav();

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById('navBurger');
  var mobileMenu = document.getElementById('mobileMenu');
  function closeMenu(){
    burger.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
    burger.setAttribute('aria-expanded','false');
    document.body.style.overflow = '';
  }
  burger.addEventListener('click', function(){
    var open = mobileMenu.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  Array.prototype.forEach.call(document.querySelectorAll('.mobile-menu__link, .mobile-menu__cta'), function(el){
    el.addEventListener('click', closeMenu);
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:0.15, rootMargin:'0px 0px -60px 0px'});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('is-visible'); });
  }

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll('.stat__num');
  function animateCounter(el){
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var duration = 1400;
    var start = null;
    function step(ts){
      if(!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if(progress < 1){ requestAnimationFrame(step); }
      else{ el.textContent = target.toLocaleString(); }
    }
    requestAnimationFrame(step);
  }
  if('IntersectionObserver' in window && counters.length){
    var counterIO = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          animateCounter(entry.target);
          counterIO.unobserve(entry.target);
        }
      });
    }, {threshold:0.5});
    counters.forEach(function(el){ counterIO.observe(el); });
  }

  /* ---------- Hero business showcase carousel ---------- */
  var heroTrack = document.getElementById('heroTrack');
  var heroPrev = document.getElementById('heroPrev');
  var heroNext = document.getElementById('heroNext');
  var heroDots = document.getElementById('heroDots');
  if(heroTrack && heroDots){
    function heroSlideStep(){
      return heroTrack.clientWidth;
    }
    function heroPageCount(){
      return Math.max(1, Math.ceil(heroTrack.scrollWidth / heroTrack.clientWidth));
    }
    function buildHeroDots(){
      heroDots.innerHTML = '';
      var pages = heroPageCount();
      for(var i=0;i<pages;i++){
        var dot = document.createElement('button');
        dot.className = 'hero__dot';
        dot.setAttribute('aria-label', 'Go to slide group ' + (i+1));
        (function(idx){
          dot.addEventListener('click', function(){
            heroTrack.scrollTo({left: idx * heroTrack.clientWidth, behavior:'smooth'});
          });
        })(i);
        heroDots.appendChild(dot);
      }
      updateHeroDots();
    }
    function updateHeroDots(){
      var dots = heroDots.querySelectorAll('.hero__dot');
      if(!dots.length) return;
      var maxScroll = heroTrack.scrollWidth - heroTrack.clientWidth;
      var pct = maxScroll > 0 ? heroTrack.scrollLeft / maxScroll : 0;
      var active = Math.round(pct * (dots.length - 1));
      dots.forEach(function(d, i){ d.classList.toggle('is-active', i === active); });
    }
    if(heroNext){
      heroNext.addEventListener('click', function(){
        heroTrack.scrollBy({left: heroSlideStep(), behavior:'smooth'});
      });
    }
    if(heroPrev){
      heroPrev.addEventListener('click', function(){
        heroTrack.scrollBy({left: -heroSlideStep(), behavior:'smooth'});
      });
    }
    heroTrack.addEventListener('scroll', updateHeroDots, {passive:true});
    window.addEventListener('resize', buildHeroDots);
    buildHeroDots();
  }

  /* ---------- Testimonials carousel ---------- */
  var testiTrack = document.getElementById('testiTrack');
  var testiPrev = document.getElementById('testiPrev');
  var testiNext = document.getElementById('testiNext');
  var testiDots = document.getElementById('testiDots');
  if(testiTrack && testiDots){
    var testiCards = testiTrack.querySelectorAll('.testi__card');
    function testiCardStep(){
      var card = testiCards[0];
      if(!card) return testiTrack.clientWidth;
      var style = window.getComputedStyle(testiTrack);
      var gap = parseFloat(style.columnGap || style.gap || 0) || 0;
      return card.getBoundingClientRect().width + gap;
    }
    function buildTestiDots(){
      testiDots.innerHTML = '';
      testiCards.forEach(function(_, i){
        var dot = document.createElement('button');
        dot.className = 'testi__dot';
        dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
        dot.addEventListener('click', function(){
          testiTrack.scrollTo({left: i * testiCardStep(), behavior:'smooth'});
        });
        testiDots.appendChild(dot);
      });
      updateTestiDots();
    }
    function updateTestiDots(){
      var dots = testiDots.querySelectorAll('.testi__dot');
      if(!dots.length) return;
      var step = testiCardStep();
      var active = step > 0 ? Math.round(testiTrack.scrollLeft / step) : 0;
      active = Math.max(0, Math.min(active, dots.length - 1));
      dots.forEach(function(d, i){ d.classList.toggle('is-active', i === active); });
    }
    if(testiNext){
      testiNext.addEventListener('click', function(){
        testiTrack.scrollBy({left: testiCardStep(), behavior:'smooth'});
      });
    }
    if(testiPrev){
      testiPrev.addEventListener('click', function(){
        testiTrack.scrollBy({left: -testiCardStep(), behavior:'smooth'});
      });
    }
    testiTrack.addEventListener('scroll', updateTestiDots, {passive:true});
    window.addEventListener('resize', buildTestiDots);
    buildTestiDots();
  }

  /* ---------- Smooth-close mobile menu on nav link click ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('.nav__link'), function(link){
    link.addEventListener('click', closeMenu);
  });

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if(yearEl){ yearEl.textContent = new Date().getFullYear(); }

  /* ---------- Ambient network canvas (hive/ecosystem look) ---------- */
  function initNetworkCanvas(canvasId, opts){
    var canvas = document.getElementById(canvasId);
    if(!canvas) return;
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w, h, points = [];
    var count = opts.count || 46;
    var linkDist = opts.linkDist || 150;
    var colorDot = opts.colorDot || 'rgba(240,191,95,0.9)';
    var colorLine = opts.colorLine || 'rgba(240,191,95,OPA)';
    var speed = opts.speed || 0.18;

    function resize(){
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr,0,0,dpr,0,0);
    }

    function makePoints(){
      points = [];
      for(var i=0;i<count;i++){
        points.push({
          x: Math.random()*w,
          y: Math.random()*h,
          vx: (Math.random()-0.5)*speed,
          vy: (Math.random()-0.5)*speed,
          r: Math.random()*1.6+1
        });
      }
    }

    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function draw(){
      ctx.clearRect(0,0,w,h);
      for(var i=0;i<points.length;i++){
        var p = points[i];
        if(!reduced){
          p.x += p.vx; p.y += p.vy;
          if(p.x < 0 || p.x > w) p.vx *= -1;
          if(p.y < 0 || p.y > h) p.vy *= -1;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = colorDot;
        ctx.fill();
      }
      for(var a=0;a<points.length;a++){
        for(var b=a+1;b<points.length;b++){
          var dx = points[a].x - points[b].x;
          var dy = points[a].y - points[b].y;
          var dist = Math.sqrt(dx*dx+dy*dy);
          if(dist < linkDist){
            var opacity = (1 - dist/linkDist) * 0.5;
            ctx.beginPath();
            ctx.moveTo(points[a].x, points[a].y);
            ctx.lineTo(points[b].x, points[b].y);
            ctx.strokeStyle = colorLine.replace('OPA', opacity.toFixed(3));
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      if(!reduced){ requestAnimationFrame(draw); }
    }

    resize();
    makePoints();
    draw();
    window.addEventListener('resize', function(){
      resize();
      makePoints();
      if(reduced){ draw(); }
    });
  }

  initNetworkCanvas('heroCanvas', {count:52, linkDist:150, colorDot:'rgba(240,191,95,0.85)', colorLine:'rgba(240,191,95,OPA)', speed:0.18});
  initNetworkCanvas('ctaCanvas', {count:40, linkDist:150, colorDot:'rgba(240,191,95,0.8)', colorLine:'rgba(240,191,95,OPA)', speed:0.16});

})();
