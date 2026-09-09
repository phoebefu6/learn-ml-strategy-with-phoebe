/* mls-live.js - the what-to-fix-next bench for learn-ml-strategy-with-phoebe.

   Real arithmetic over a fixed dev set. Lanternfish's trail-camera species classifier
   is run over 1,000 dev images generated from a fixed seed; 120 are wrong, and every
   wrong one carries the category a human would write in the error-analysis spreadsheet.
   The dev set is split in half: an Eyeball half you look at, a Blackbox half you never
   do. Each candidate project costs weeks and removes a stated share of the errors in
   its category. You choose the order; the engine recomputes both halves' error rates
   after every project and keeps the running week count.

   One project is a construction and is labelled as one on the widget: "hand rules
   against the errors you looked at" removes errors ONLY in the Eyeball half, because
   that is what a rule written against 60 specific examples does. Everything else is
   counting. Exposes window.MLS_ENGINE, renders into [data-mls-bench]. */
(function (root) {
  "use strict";

  var N = 1000;
  /* category, count among the 120 errors, and the spreadsheet share */
  var CATS = [
    { id: "nightblur",  label: "Night infrared blur",        count: 42 },
    { id: "lookalike",  label: "Deer mistaken for elk",      count: 24 },
    { id: "occlusion",  label: "Animal half out of frame",   count: 22 },
    { id: "emptyframe", label: "Empty frame called animal",  count: 18 },
    { id: "mislabel",   label: "Label was wrong",            count: 14 }
  ];
  var ERRORS_TOTAL = CATS.reduce(function (s, c) { return s + c.count; }, 0); /* 120 */

  function rng(seed) {
    return function () {
      seed = (seed + 0x6D2B79F5) | 0; var t = seed;
      t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* Build the dev set: index, half (eye/box), and category if wrong */
  var DEV = (function () {
    var r = rng(20260909), items = [];
    for (var i = 0; i < N; i++) items.push({ i: i, half: i % 2 === 0 ? "eye" : "box", cat: null });
    /* place the 120 errors at random positions, category by category */
    var free = items.slice();
    CATS.forEach(function (c) {
      for (var k = 0; k < c.count; k++) {
        var j = Math.floor(r() * free.length);
        free[j].cat = c.id; free.splice(j, 1);
      }
    });
    return items;
  })();

  function errorsIn(half, cat) {
    return DEV.filter(function (d) { return d.half === half && d.cat && (!cat || d.cat === cat); });
  }

  /* Candidate projects. removes = share of that category's errors the project fixes,
     applied to the earliest-indexed errors so the arithmetic is deterministic. */
  var PROJECTS = [
    { id: "clean_labels",   label: "Re-label the dev set",              weeks: 1, cat: "mislabel",   removes: 0.9,
      blurb: "Two annotators, one afternoon each. The cheapest project on the list and the one most teams never do." },
    { id: "motion_filter",  label: "Motion-trigger filter for empty frames", weeks: 2, cat: "emptyframe", removes: 0.8,
      blurb: "Drop frames with no motion before the classifier sees them." },
    { id: "ir_denoise",     label: "Infrared denoising pass",            weeks: 3, cat: "nightblur",  removes: 0.6,
      blurb: "A preprocessing step for night captures. Biggest category, moderate cost." },
    { id: "occlusion_aug",  label: "Occlusion augmentation",             weeks: 4, cat: "occlusion",  removes: 0.5,
      blurb: "Train on randomly cropped animals so half an elk still reads as an elk." },
    { id: "lookalike_model",label: "Deer-vs-elk specialist model",       weeks: 8, cat: "lookalike",  removes: 0.7,
      blurb: "The project everybody wants to build. A second model, a new dataset, a paper-worthy problem." },
    { id: "eyeball_rules",  label: "Hand rules against the errors you looked at", weeks: 2, cat: null, removes: 0.7, eyeOnly: true,
      blurb: "Sixty examples in front of you, sixty patches. Watch which half of the dev set moves." }
  ];

  function run(order) {
    var fixed = {};                         /* index -> true */
    var weeks = 0, steps = [];
    function rate(half) {
      var n = 0; DEV.forEach(function (d) { if (d.half === half && d.cat && !fixed[d.i]) n++; });
      return n / (N / 2);
    }
    steps.push({ label: "Start", weeks: 0, eye: rate("eye"), box: rate("box") });
    order.forEach(function (id) {
      var p = PROJECTS.filter(function (x) { return x.id === id; })[0]; if (!p) return;
      var pool = DEV.filter(function (d) { return d.cat && !fixed[d.i] && (p.cat ? d.cat === p.cat : true) && (p.eyeOnly ? d.half === "eye" : true); });
      var k = Math.round(pool.length * p.removes);
      pool.slice(0, k).forEach(function (d) { fixed[d.i] = true; });
      weeks += p.weeks;
      steps.push({ label: p.label, weeks: weeks, eye: rate("eye"), box: rate("box"), removed: k });
    });
    var last = steps[steps.length - 1];
    return { steps: steps, weeks: weeks, eye: last.eye, box: last.box, gap: last.eye - last.box,
             startEye: steps[0].eye, startBox: steps[0].box };
  }

  /* ceiling per week for each project, from the Eyeball spreadsheet counts */
  function ceilings() {
    return PROJECTS.filter(function (p) { return p.cat; }).map(function (p) {
      var errs = errorsIn("eye", p.cat).length, total = errorsIn("eye").length;
      var share = errs / total;
      return { id: p.id, label: p.label, weeks: p.weeks, share: share, removes: p.removes,
               ceilingPts: share * p.removes * 100 * (total / (N / 2)), perWeek: share * p.removes * 100 * (total / (N / 2)) / p.weeks };
    }).sort(function (a, b) { return b.perWeek - a.perWeek; });
  }

  /* bias and variance from three numbers, chapter 22 arithmetic */
  function biasVariance(train, dev, human) {
    var avoidable = Math.max(0, train - human), variance = Math.max(0, dev - train);
    return { unavoidable: human, avoidable: avoidable, variance: variance,
             focus: variance > avoidable ? "variance" : (avoidable > 0 ? "bias" : "neither") };
  }

  var ORDERS = {
    roi:         ["clean_labels", "motion_filter", "ir_denoise", "occlusion_aug", "lookalike_model"],
    interesting: ["lookalike_model", "occlusion_aug", "ir_denoise", "motion_filter", "clean_labels"],
    eyeball:     ["eyeball_rules"]
  };

  root.MLS_ENGINE = { N: N, CATS: CATS, ERRORS_TOTAL: ERRORS_TOTAL, DEV: DEV, PROJECTS: PROJECTS, ORDERS: ORDERS,
                      run: run, ceilings: ceilings, biasVariance: biasVariance, errorsIn: errorsIn };
})(typeof window !== "undefined" ? window : globalThis);

/* ============================================================
   the widget - renders the bench into [data-mls-bench]
   ============================================================ */
(function () {
  "use strict";
  if (typeof document === "undefined") return;
  var E = window.MLS_ENGINE; if (!E) return;
  function el(t, c, x) { var n = document.createElement(t); if (c) n.className = c; if (x !== undefined && x !== null) n.textContent = x; return n; }
  var pct = function (v) { return (v * 100).toFixed(1) + "%"; };

  document.querySelectorAll("[data-mls-bench]").forEach(function (host) {
    var order = [];
    var wrap = el("div", "wk fx-wrap");
    var head = el("div", "wk-head");
    head.appendChild(el("b", null, "The what-to-fix-next bench"));
    head.appendChild(el("span", null, "Lanternfish species classifier · 1,000 dev images · 120 errors · Eyeball 500 / Blackbox 500"));
    wrap.appendChild(head);
    var body = el("div", "wk-body");
    body.appendChild(el("p", "hb-honesty",
      "The dev set, its 120 errors and their spreadsheet categories are fixed and identical for every learner. Each project " +
      "removes a stated share of its category's errors; the two error rates and the week count are counted, not scripted. " +
      "One project is a construction and says so: hand rules written against the errors you looked at fix only the half you looked at."));

    var reads = el("div", "fx-reads");
    function readout(cls, label) { var b = el("div", "fx-read " + cls); var big = el("b", "fx-big", "-"); b.appendChild(big); b.appendChild(el("span", "fx-rlab", label)); reads.appendChild(b); return big; }
    var outBox = readout("fx-r1", "Blackbox dev error");
    var outEye = readout("fx-r2", "Eyeball dev error");
    var outWeeks = readout("fx-r3", "weeks spent");
    body.appendChild(reads);

    /* the spreadsheet */
    body.appendChild(el("p", "fx-lab", "The error-analysis spreadsheet, Eyeball half. Share of errors, and the ceiling each project can reach per week of work."));
    var tbl = el("table", "fx-sheet");
    var th = el("tr"); ["Category", "Errors", "Share", "Project", "Weeks", "Ceiling", "Points per week"].forEach(function (h) { th.appendChild(el("th", null, h)); });
    tbl.appendChild(th);
    E.ceilings().forEach(function (c) {
      var cat = E.CATS.filter(function (x) { return x.id === E.PROJECTS.filter(function (p) { return p.id === c.id; })[0].cat; })[0];
      var tr = el("tr");
      [cat.label, String(E.errorsIn("eye", cat.id).length), Math.round(c.share * 100) + "%", c.label, String(c.weeks), c.ceilingPts.toFixed(1) + " pts", c.perWeek.toFixed(2)].forEach(function (v, i) {
        var td = el("td", i === 6 ? "fx-num" : null, v); tr.appendChild(td);
      });
      tbl.appendChild(tr);
    });
    body.appendChild(tbl);

    /* presets and project buttons */
    var presets = el("div", "fx-presets"); presets.appendChild(el("span", "fx-plab", "Orders"));
    [["Best points per week", "roi"], ["Most interesting first", "interesting"], ["Tune to what you looked at", "eyeball"], ["Clear", null]].forEach(function (p) {
      var b = el("button", "hb-btn", p[0]); b.type = "button";
      b.addEventListener("click", function () { order = p[1] ? E.ORDERS[p[1]].slice() : []; paint(); });
      presets.appendChild(b);
    });
    body.appendChild(presets);

    body.appendChild(el("p", "fx-lab", "Or fund projects one at a time, in the order you would actually run them."));
    var picks = el("div", "fx-picks");
    E.PROJECTS.forEach(function (p) {
      var b = el("button", "fx-pick" + (p.eyeOnly ? " fx-anti" : ""), p.label + " · " + p.weeks + " wk");
      b.type = "button"; b.title = p.blurb;
      b.addEventListener("click", function () { if (order.indexOf(p.id) < 0) { order.push(p.id); paint(); } });
      picks.appendChild(b);
    });
    body.appendChild(picks);

    body.appendChild(el("p", "fx-lab", "Both halves after each project. If the two lines separate, you fixed what you looked at rather than what is wrong."));
    var track = el("div", "fx-track"); body.appendChild(track);
    var notes = el("div", "fx-notes"); body.appendChild(notes);
    wrap.appendChild(body);
    var foot = el("div", "wk-foot");
    foot.appendChild(el("span", null, "Ceiling per chapter 15 of Machine Learning Yearning: the share of errors a project could remove, times the share it does remove. Nothing on this bench models a person."));
    wrap.appendChild(foot);
    host.appendChild(wrap);

    function paint() {
      var r = E.run(order);
      outBox.textContent = pct(r.box); outEye.textContent = pct(r.eye); outWeeks.textContent = String(r.weeks);
      track.textContent = "";
      r.steps.forEach(function (s, i) {
        var row = el("div", "fx-step");
        row.appendChild(el("span", "fx-wk", "wk " + s.weeks));
        row.appendChild(el("span", "fx-sl", s.label));
        var bars = el("span", "fx-bars");
        var e = el("i", "fx-bar fx-eye"); e.style.width = (s.eye * 100 * 6) + "px"; e.title = "Eyeball " + pct(s.eye);
        var b = el("i", "fx-bar fx-box"); b.style.width = (s.box * 100 * 6) + "px"; b.title = "Blackbox " + pct(s.box);
        bars.appendChild(e); bars.appendChild(b); row.appendChild(bars);
        row.appendChild(el("span", "fx-vals", pct(s.eye) + " / " + pct(s.box)));
        track.appendChild(row);
      });
      notes.textContent = "";
      if (r.gap < -0.05) notes.appendChild(el("p", "dh-verdict warn",
        "Eyeball error " + pct(r.eye) + ", Blackbox error " + pct(r.box) + ". The half you looked at improved and the half you did not stayed put. That is not a better model; it is a dev set you have memorised. Ship this and production looks like the Blackbox line."));
      if (order.length && order[0] === "lookalike_model") notes.appendChild(el("p", "dh-verdict warn",
        "Eight weeks before anything shipped, for a project with the second-largest ceiling and the lowest points per week on the sheet. The re-label job was one week and it was sitting right there."));
      if (order.length >= 5 && order.indexOf("eyeball_rules") < 0 && order[0] === "clean_labels") notes.appendChild(el("p", "dh-verdict",
        "Every category worked in ceiling-per-week order. Blackbox error " + pct(r.box) + " after " + r.weeks + " weeks, and the team was at " + pct(r.steps[3].box) + " by week " + r.steps[3].weeks + " instead of waiting until week 8 to ship anything."));
      if (!order.length) notes.appendChild(el("p", "hb-empty", "Nothing funded. 12.8 percent of the Eyeball half and 11.2 percent of the Blackbox half are wrong, and the sheet above already says what to do first."));
    }
    paint();
  });
})();
