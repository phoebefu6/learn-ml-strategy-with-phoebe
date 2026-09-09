# Official course map - learn-ml-strategy-with-phoebe

Built 2026-09-09. Hub bucket `ds` (Data Science), difficulty tier 3. Flips the hub's existing
`planned` entry live. Two tracks: leader 6 x 45 min, practitioner 10 x 45 min (matching
`learn-model-evaluation`, the closest sibling).

Running artifact: a **what-to-fix-next decision** for one classifier - Lanternfish's trail-camera
species classifier, 1,000 dev images, 120 wrong, 12 percent dev error. Lanternfish is a fictional
wildlife-camera startup; the classifier is Andrew Ng's cat detector moved one step sideways.

---

## The seam against sibling courses (enforced, not aspirational)

| Sibling | What it owns | What this course does instead |
|---|---|---|
| `learn-model-evaluation-with-phoebe` (ds, d3) | HOW TO SCORE: confusion matrix, threshold dial, curves and calibration, cost matrix, LLM quality metrics, the grader problem, drift | Never defines a metric. Takes "you have a metric" as given and asks what to work on next. a2 chooses between metrics (single-number, optimizing vs satisficing) without teaching any |
| `learn-ai-evals-with-phoebe` (ai, d3) | LLM eval tooling: golden sets, RAGAS, LLM-as-judge, regression suites, eval culture | Nothing LLM-specific. The one mention is a6 pointing at Hamel Husain's three levels as where this discipline lands in LLM products |
| `learn-intro-ml-with-phoebe` (ds, d2) | "Bias-variance and regularization" (b5), "The train/test split (and the leakage trap)" (b2) | Bias and variance as a DIAGNOSIS from three numbers that decides which project to fund, never as regularization technique. Dev/test sets as distribution and size decisions, never as the split mechanics |
| `learn-feature-engineering-with-phoebe` (ds, d3) | Leakage, transforms, feature stores | Not mentioned |
| `learn-experimentation-with-phoebe` (ds, d3) | A/B testing | Not mentioned; a6 names A/B testing only as Husain's third level |

---

## Verified facts (with their source tier)

**Tier 1, read from the primary source** - Andrew Ng, *Machine Learning Yearning* (draft, 58
short chapters, deeplearning.ai PDF; text extracted and quoted from the PDF itself).

- Chapter list used verbatim for a3/p3/p4 titles' concepts: 5 "Your development and test sets";
  6 "Your dev and test sets should come from the same distribution"; 7 "How large do the dev/test
  sets need to be?"; 8 "Establish a single-number evaluation metric for your team to optimize";
  9 "Optimizing and satisficing metrics"; 13 "Build your first system quickly, then iterate";
  14 "Error analysis: Look at dev set examples to evaluate ideas"; 15 "Evaluating multiple ideas
  in parallel during error analysis"; 17 "If you have a large dev set, split it into two subsets,
  only one of which you look at"; 18 "How big should the Eyeball and Blackbox dev sets be?";
  20 "Bias and Variance: The two big sources of error"; 22 "Comparing to the optimal error rate";
  25 "Techniques for reducing avoidable bias"; 27 "Techniques for reducing variance";
  28 "Diagnosing bias and variance: Learning curves"; 33 "Why we compare to human-level
  performance"; 36 "When you should train and test on different distributions"; 42 "Addressing
  data mismatch"; 44 "The Optimization Verification test"; 53 "Error analysis by parts";
  54 "Attributing error to one part"; 57 "Spotting a flawed ML pipeline"; 58 "Building a
  superhero team - Get your teammates to read this".
- **Dev set size** (ch 7): "if classifier A has an accuracy of 90.0% and classifier B has an
  accuracy of 90.1%, then a dev set of 100 examples would not be able to detect this 0.1%
  difference"; "Dev sets with sizes from 1,000 to 10,000 examples are common. With 10,000
  examples, you will have a good chance of detecting an improvement of 0.1%."
- **Optimizing vs satisficing** (ch 9): accuracy is the optimizing metric; running time "should
  take at most 100ms" is a satisficing one; with N criteria, set N-1 as satisficing.
- **Error analysis spreadsheet** (ch 15): "I usually create a spreadsheet and fill it out while
  looking through ~100 misclassified dev set images." Columns Dog / Great cat / Blurry / Comments,
  a row per image, "% of total" at the bottom; an image can tick several columns.
- **Ceiling** (ch 14): if 5 percent of errors are the category a project fixes, "5% is a
  'ceiling' (meaning maximum possible amount) for how much the proposed project could help",
  so a 90 percent accurate system improves "at best" to 90.5 percent.
- **Eyeball dev set** (ch 17): "randomly select 10% of the dev set and place that into what we'll
  call an Eyeball dev set to remind ourselves that we are looking at it with our eyes." The
  remainder is the Blackbox dev set, which you do not look at.
- **Bias decomposition** (ch 22): worked example - optimal error rate ("unavoidable bias") 14
  percent, avoidable bias 1 percent "calculated as the difference between the training error and
  the optimal error rate", variance as dev error minus training error.

**Tier 2, from Ng's *Structuring Machine Learning Projects* course (deeplearning.ai), not the
book.** Orthogonalization - one knob per problem - is course material. a4 and p5 name it as such.

**Tier 2, Hamel Husain, "Your AI Product Needs Evals" (hamel.dev).** Three levels: Level 1 unit
tests / assertions, Level 2 human and model eval, Level 3 A/B testing; "You must remove all
friction from the process of looking at data"; "keep reading logs until you feel like you aren't
learning anything new". Cited in a6 only.

**Nothing on the p10 bench models a person.** One project is a construction by definition
(rules written against 60 seen examples fix only those 60), and the widget says so.

---

## Frozen canon - the p10 what-to-fix-next bench

Computed in node from `assets/mls-live.js` before any page quoted a number. Any page citing these
must match exactly.

- **1,000 dev images, 120 wrong** (12.0 percent). Split by index parity into **Eyeball 500 / Blackbox
  500**; the random placement puts **64 errors in Eyeball (12.8 percent) and 56 in Blackbox (11.2
  percent)** - the halves are not identical, which is itself the point of having two.
- **The Eyeball spreadsheet**, share of the 64 errors and the ceiling per week each project offers:

| Category | Eyeball errors | Share | Project | Weeks | Ceiling (points of dev error) | Points per week |
|---|---|---|---|---|---|---|
| Night infrared blur | 21 | 33 percent | Infrared denoising pass (removes 60 percent) | 3 | 2.5 | 0.84 |
| Deer mistaken for elk | 12 | 19 percent | Deer-vs-elk specialist model (70) | 8 | 1.7 | **0.21** |
| Animal half out of frame | 12 | 19 percent | Occlusion augmentation (50) | 4 | 1.2 | 0.30 |
| Empty frame called animal | 10 | 16 percent | Motion-trigger filter (80) | 2 | 1.6 | 0.80 |
| Label was wrong | 9 | 14 percent | Re-label the dev set (90) | 1 | 1.6 | **1.62** |

- **Best points-per-week order** (re-label, motion filter, denoise, occlusion, specialist):
  Blackbox 11.2 -> 10.2 (wk 1) -> 9.0 (wk 3) -> **6.2 (wk 6)** -> 5.6 (wk 10) -> **3.6 (wk 18)**.
- **Most interesting first** (specialist model first): Blackbox **still 11.2 at week 6**, 9.2 at
  week 8, 8.6 at 12, 5.8 at 15, 4.6 at 17, **3.6 at week 18**. Same destination; the team lived
  with double-digit error for eight weeks longer.
- **Tune to what you looked at** (hand rules against the 60 Eyeball errors, 2 weeks): Eyeball
  **12.8 -> 3.8**, Blackbox **11.2 -> 11.2**. A 7.4-point gap that is a memorised dev set, not a
  better model.
- **Two scopes, two counts - never mix them.** The Eyeball spreadsheet is over the **64 Eyeball
  errors** (night blur 21, deer-vs-elk 12, occlusion 12, empty frame **10**, mislabel 9). Error
  analysis by parts in p9 runs over **all 120 dev errors** (night blur 42, deer-vs-elk 24,
  occlusion 22, empty frame **18**, mislabel 14), because attribution needs every error, not the
  half you read. So "ten empty-frame errors" (a5, the sheet) and "eighteen empty-frame errors"
  (p9, the whole dev set) are both correct. Any page using either number must name its scope in
  the same sentence.

- **Bias and variance side panel**, chapter 22 arithmetic: train 3, dev 12, human-level 2 ->
  unavoidable 2, avoidable bias 1, variance 9 -> work on variance.

---

## Coverage per session

`✓` = taught to working depth. `◐` = named and handed to the session or course that owns it.

### Leader track

| Session | Covers | Depth |
|---|---|---|
| a1 Strategy is deciding what not to try | Why iteration speed decides projects; build first then iterate (ch 13); the 12-percent starting point | ✓ |
| a2 One number, or two kinds | Single-number metric (ch 8), optimizing vs satisficing (ch 9), when to change the metric (ch 11) | ✓ |
| a3 Look at 100 mistakes | The spreadsheet (ch 14-15), the ceiling, the points-per-week order from canon | ✓ |
| a4 Where the error comes from | Unavoidable bias, avoidable bias, variance (ch 20-22); human-level as yardstick (ch 33); orthogonalization named as course material | ✓ |
| a5 The pipeline that hides its weakest part | Error analysis by parts (ch 53-54), spotting a flawed pipeline (ch 57) | ✓ |
| a6 Get your teammates to read this | The one-page memo (ch 58); Husain's three levels as where this lands in LLM products | ✓ |

### Practitioner track

| Session | Covers | Depth |
|---|---|---|
| p1 Dev and test sets that tell the truth | Same distribution (ch 5-6), size vs detectable difference (ch 7), the Lanternfish set built | ✓ |
| p2 First system in a week | Ch 13 as a build discipline; the 12-percent baseline | ✓ |
| p3 The error-analysis spreadsheet | Ch 14-15 done on 64 real errors; the ceiling column; canon table | ✓ |
| p4 Eyeball and Blackbox | Ch 17-18; the construction on the bench and the 7.4-point gap | ✓ |
| p5 Bias and variance from three numbers | Ch 20-27; the side panel arithmetic; which project each diagnosis funds | ✓ |
| p6 Learning curves, read honestly | Ch 28-32 | ✓ |
| p7 Different distributions and data mismatch | Ch 36-43 | ✓ |
| p8 The Optimization Verification test | Ch 44-46 | ✓ |
| p9 Error analysis by parts on a real pipeline | Ch 53-57 on a two-stage detector-then-classifier | ✓ |
| p10 The what-to-fix-next bench | The full canon, both anti-orders | ✓ |
| Metric definitions, thresholds, calibration | Pointed at `learn-model-evaluation` | ◐ |
| Regularization, dropout, the train/test split mechanics | Pointed at `learn-intro-ml` | ◐ |
| LLM golden sets and judges | Pointed at `learn-ai-evals` | ◐ |

## Not covered, by design

- **Any metric's definition.** The model-evaluation course.
- **Regularization and model-capacity technique.** Intro ML and deep learning courses.
- **LLM-specific evaluation.** The AI evals course.
- **End-to-end deep learning trade-offs** (ch 47-52). Named in a5 in one sentence, not taught.
- **Severity weighting of error categories.** Every error counts the same on the bench; a real
  spreadsheet would weight a mislabelled endangered species above a blurry deer. Named on p10.

## Re-verify before delivery

The book is a stable 2018 draft. Nothing here moves. If a learner asks for the course version of
orthogonalization, it is *Structuring Machine Learning Projects*, week 1.
