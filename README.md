# Learn ML Strategy with Phoebe

Sixteen sessions on the part of machine learning that decides how fast a team moves: not which model, but what to work on next. Read from Andrew Ng's *Machine Learning Yearning* at the primary source and rebuilt around one classifier at 12 percent dev error.

**Live:** https://phoebefu6.github.io/learn-ml-strategy-with-phoebe/

Two tracks. **Leader, 6 sessions, no code:** why velocity beats model choice, one number or two kinds, looking at 100 mistakes, where the error comes from, the pipeline that hides its weakest part, and the one-page memo. **Practitioner, 10 sessions:** dev and test sets that tell the truth, the first system in a week, the error-analysis spreadsheet with its ceiling column, Eyeball and Blackbox dev sets, bias and variance from three numbers, learning curves, data mismatch, the Optimization Verification test, error analysis by parts, and a bench that scores your order of work.

- `assets/mls-live.js` holds the **what-to-fix-next bench**. Lanternfish's trail-camera species classifier gets 120 of 1,000 dev images wrong, each carrying its spreadsheet category. The dev set is split into an Eyeball half you look at and a Blackbox half you never do. Five candidate projects each cost weeks and remove a stated share of their category's errors; you choose the order and the engine recomputes both halves after every project. Nothing models a person.
- **Ceiling per week, from the spreadsheet:** re-labelling the dev set is **1.62 points per week**; the deer-vs-elk specialist model everybody wants to build is **0.21**, despite the second-largest ceiling on the sheet.
- **Order does not change where you end, only how long you live with the error:** the points-per-week order has Blackbox error at **6.2 percent by week 6**; "most interesting first" has shipped nothing by week 6 and sits at 9.2 percent at week 8. Both reach 3.6 percent at week 18.
- **The construction, labelled as one:** hand rules written against the 60 Eyeball errors take the Eyeball half from 12.8 to **3.8 percent** and leave the Blackbox half at **11.2**. A 7.4-point gap is a memorised dev set.
- **Seams enforced:** metric definitions belong to the model-evaluation course, LLM eval tooling to the AI evals course, regularization to intro ML. This course never defines a metric.
- Running artifact: a **what-to-fix-next decision** for Lanternfish, a fictional wildlife-camera startup.
- Full source map, chapter references and frozen canon: `materials/official-course-map.md`

by Phoebe Fu
