/* 話しかけるデモと、スクロール表示。場面の文章は SCENES を直せば変わる */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    [].forEach.call(document.querySelectorAll('.sec:not(.demo-sec) h2, .list li, .steps li, .split img, .info, .faq > div, .desk'), function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      el.classList.add('rv'); io.observe(el);
    });
  }

  var sec = document.getElementById('demo');
  if (!sec) return;
  var SCENES = [
    { q: '冷蔵庫に卵と豆腐があります。晩ごはんは何がいい？', a: ['「豆腐の卵とじ」はいかがですか。', '10分ほどで作れます。', '作り方もお伝えしますか？'] },
    { q: 'お野菜をもらったお礼を書きたいです。', a: ['下書きを作りました。', '「新鮮なお野菜をありがとうございました。家族でおいしくいただきます。」'] },
    { q: '荷物の不在通知が届いたけれど、本物かしら？', a: ['詐欺の可能性もあります。', 'リンクは押さないでください。', '宅配会社の公式窓口か、ご家族に確認しましょう。'] }
  ];
  var q = function (s) { return sec.querySelector(s); };
  var me = q('.me'), meText = q('.me span'), dots = q('.dots'), ai = q('.ai'), phone = q('.phone'),
      status = q('.status'), play = q('.play'), how = sec.querySelectorAll('[data-how]'),
      tabs = sec.querySelectorAll('[data-scene]');
  var scene = 0, t = 0, playing = !reduce, visible = false, timer = null;
  var PRESS = 1600, CHAR = 130, THINK = 1500, LINE = 1100, HOLD = 4500, TICK = 100;

  function times() {
    var s = SCENES[scene], talk = PRESS + s.q.length * CHAR + 500, answer = talk + THINK;
    return { talk: talk, answer: answer, end: answer + s.a.length * LINE + HOLD };
  }
  function draw() {
    var s = SCENES[scene], m = times();
    var step = t < PRESS ? 0 : t < m.talk ? 1 : 2;
    var n = Math.max(0, Math.floor((t - PRESS) / CHAR));
    me.classList.toggle('off', t < PRESS);
    meText.textContent = s.q.slice(0, n);
    dots.classList.toggle('off', !(t >= m.talk && t < m.answer));
    ai.classList.toggle('off', t < m.answer);
    [].forEach.call(ai.children, function (p, i) { p.classList.toggle('wait', t < m.answer + i * LINE); });
    phone.classList.toggle('pressing', step === 0);
    phone.classList.toggle('listening', step === 1);
    status.textContent = step === 0 ? 'マイクを押します' : step === 1 ? '聞いています…' : t < m.answer ? '考えています…' : '返事が届きました';
    [].forEach.call(how, function (li, i) { li.classList.toggle('on', i === step); });
  }
  function load(i) {
    scene = i; t = 0;
    ai.textContent = '';
    SCENES[i].a.forEach(function (line) { var p = document.createElement('p'); p.textContent = line; ai.appendChild(p); });
    [].forEach.call(tabs, function (b, k) { b.setAttribute('aria-pressed', String(k === i)); });
    if (!playing) t = times().end;
    draw();
  }
  function sync() {
    var run = playing && visible && !document.hidden;
    sec.classList.toggle('paused', !playing);
    play.textContent = playing ? '一時停止' : '再生する';
    if (run && !timer) timer = setInterval(function () {
      t += TICK;
      if (t >= times().end) load((scene + 1) % SCENES.length); else draw();
    }, TICK);
    if (!run && timer) { clearInterval(timer); timer = null; }
  }
  [].forEach.call(tabs, function (b) {
    b.addEventListener('click', function () { playing = true; load(+b.getAttribute('data-scene')); sync(); });
  });
  play.addEventListener('click', function () {
    playing = !playing;
    if (playing && t >= times().end) load(scene);
    sync();
  });
  document.addEventListener('visibilitychange', sync);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { visible = es[es.length - 1].isIntersecting; sync(); }, { threshold: 0.15 }).observe(phone);
  } else visible = true;
  sec.classList.add('ready');
  load(0); sync();
})();
