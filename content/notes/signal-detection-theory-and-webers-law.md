---
title: Signal Detection Theory and Weber's Law: d', Bias and the JND
description: Learn absolute and difference thresholds, apply Weber's law, and separate sensitivity (d') from response bias in signal detection theory, with worked numbers.
product: 6a-sensation-perception
published: 2026-10-20
related: types-of-memory-sensory-short-term-long-term, action-potential-phases-ion-channels
---

Weber's law and signal detection theory both come from psychophysics, the study of how physical stimulus intensity relates to what people report sensing. **Weber's law** says the smallest change you can notice, the just noticeable difference (JND), is a constant fraction of the starting intensity: &Delta;I / I = k. **Signal detection theory** (SDT) says that whether you report a faint stimulus depends on two separate things: how well your sensory system separates signal from noise (sensitivity, d') and how willing you are to say "yes" (your response criterion, or bias). Weber's law is about telling two stimuli apart. SDT is about deciding whether a stimulus was there at all.

## Two kinds of threshold

| Threshold | Question it answers | Defined as |
|---|---|---|
| Absolute threshold | Is anything there? | The weakest intensity detected on 50 percent of trials |
| Difference threshold (JND) | Are these two different? | The smallest change detected on 50 percent of trials |

Both are defined at 50 percent because detection does not flip from never to always at one exact intensity. As intensity rises, the proportion of "yes" responses climbs gradually along an S-shaped psychometric function. Fatigue, attention, expectation and motivation all move that curve, so a threshold is a statistical average, not a fixed wall. A stimulus below the absolute threshold is called subthreshold (or subliminal).

## Weber's law

The JND grows in proportion to the baseline:

**&Delta;I = k &times; I**

Here I is the starting intensity, &Delta;I is the JND, and k is the Weber fraction. A small k means a sharp sense, because a tiny proportional change is enough. Values vary by study and condition, but commonly quoted approximations are about 0.02 for lifted weight, about 0.08 for brightness, and about 0.10 for loudness. Weber's law fits best in the middle of a sense's range and breaks down near very weak or very intense stimuli.

### Worked example 1: weight

Use k = 0.02 for lifted weight.

1. You hold a 50 g envelope. JND = 0.02 &times; 50 = **1 g**. Add a 1 g sheet of paper and you can just tell.
2. You hold a 5 kg grocery bag (5000 g). JND = 0.02 &times; 5000 = **100 g**. The same 1 g sheet is now far below threshold.
3. To feel a change in the bag, someone must add about 100 g, a hundred times more than the envelope needed, because the baseline is a hundred times heavier.

### Worked example 2: working backward

A listener first notices a tone getting louder when its intensity goes from 40 units to 44 units. What is k, and what change is needed at 150 units?

1. k = &Delta;I / I = 4 / 40 = **0.10**.
2. At 150 units, &Delta;I = 0.10 &times; 150 = **15 units**.

The tell in Weber problems: the ratio stays fixed, so the absolute change scales with the baseline.

### Fechner and Stevens, briefly

Gustav Fechner assumed every JND is an equal step in felt sensation and derived **S = k log I**: felt magnitude tracks the log of physical intensity, so each doubling of intensity adds the same amount of sensation. S. S. Stevens later proposed a power law, **S = k I<sup>n</sup>**, which fits magnitude estimates better across senses. An exponent below 1 compresses (brightness), and an exponent above 1 expands (electric shock). The decibel scale for sound is logarithmic for a related reason: a 10 dB increase is a tenfold increase in intensity.

![Three panels: noise and signal-plus-noise distributions with a criterion line, ROC curves for d' of 0, 1 and 2.5 with three listeners plotted, and JND rising in proportion to baseline for three Weber fractions](assets/notes/signal-detection-theory-and-webers-law.png "Sensitivity is the gap between the two curves. The criterion is where you draw the line. The JND grows with the baseline.")

## Signal detection theory

Older threshold models picture detection as an on-off switch. SDT replaces the switch with a decision made under uncertainty. Your nervous system is never perfectly quiet: random neural activity and background stimulation create a fluctuating internal response even when nothing is presented. On each trial the observer has an internal response and must decide whether it came from noise alone or from signal plus noise.

Picture two overlapping bell curves. The noise-alone curve sits lower on the internal-response axis, and the signal-plus-noise curve sits higher. The observer picks a cutoff, the **criterion**, and says "yes" whenever the internal response falls above it.

### The four outcomes

| | Says "yes" | Says "no" |
|---|---|---|
| **Signal present** | Hit | Miss |
| **Signal absent** | False alarm | Correct rejection |

Because every signal trial is either a hit or a miss, the hit rate and miss rate add to 1. The false alarm rate and correct rejection rate also add to 1. So two numbers, the hit rate and the false alarm rate, describe performance completely.

### Sensitivity: d'

Sensitivity is how far apart the two curves are, measured in standard deviations:

**d' = z(hit rate) - z(false alarm rate)**

z converts a proportion to a standard normal score (z of 0.50 is 0, z of 0.84 is about +1, z of 0.16 is about -1). A d' of 0 means the curves sit on top of each other, so the observer is guessing. Larger d' means the signal stands out more. Sensitivity rises with a stronger stimulus, less noise, or more training. It does not change because an observer becomes more cautious or more eager.

### Bias: the criterion

Bias is where the observer places the cutoff.

- A **liberal** criterion (low cutoff) produces more hits and more false alarms. It is sensible when a miss is costly, such as a smoke detector or a screening test for a serious disease.
- A **conservative** criterion (high cutoff) produces fewer false alarms and fewer hits. It is sensible when false alarms are costly or the signal is rare.

Rewards, penalties, instructions and expectations shift where the cutoff sits. None of them changes how far apart the two curves are. One common way to quantify bias is c = -(z(hit) + z(false alarm))/2: c near 0 is neutral, a positive c is conservative, and a negative c is liberal.

### The ROC curve

A receiver operating characteristic (ROC) curve traces how the hit rate and false alarm rate change together as the cutoff slides from strict to lenient. The diagonal is chance (d' = 0). A curve bowed toward the upper left reflects higher sensitivity. Sliding along one curve is a change in bias; jumping to a more bowed curve is a change in sensitivity.

## Worked example 3: who has the best hearing?

Three people take a hearing test with faint tones on half the trials. Their results:

| Listener | Hit rate | False alarm rate | z(hit) | z(FA) | d' | c |
|---|---|---|---|---|---|---|
| A | 0.90 | 0.10 | +1.28 | -1.28 | **2.56** | 0.00 (neutral) |
| B | 0.60 | 0.05 | +0.25 | -1.64 | **1.90** | +0.70 (conservative) |
| C | 0.95 | 0.50 | +1.64 | 0.00 | **1.64** | -0.82 (liberal) |

Listener C has the highest hit rate, but also says "yes" on half of the silent trials. Once false alarms are counted, C has the lowest sensitivity of the three. Listener B misses many tones but almost never claims to hear one that is not there, a cautious observer with moderate sensitivity. Listener A has the best sensitivity. This is the core lesson of SDT: a hit rate means nothing without the false alarm rate beside it.

Now suppose Listener A is offered a reward for every tone detected and no penalty for false alarms. Their hit rate climbs and their false alarm rate climbs with it. If d' stays about 2.56, their hearing has not changed. Only their criterion moved.

## How the two ideas fit together

Weber's law and SDT describe different tasks, but they share one theme: perception is relative and probabilistic, not a fixed readout of physical intensity. Weber's law shows that what counts as a noticeable change depends on context, the baseline. SDT shows that what counts as a detected stimulus depends on context too, the observer's goals and expectations. Both sit at the boundary between sensation, the receptor and neural response covered in the [action potential note](action-potential-phases-ion-channels.html), and perception, the brain's interpretation. Information that clears these thresholds then enters the brief sensory store described in the [memory note](types-of-memory-sensory-short-term-long-term.html).

## Common traps

- **Treating the JND as a fixed amount.** The ratio is fixed, not the amount. A 1 g difference is noticeable on 50 g and invisible on 5 kg.
- **Confusing absolute and difference thresholds.** The absolute threshold asks whether one stimulus is detected. The JND compares two stimuli.
- **Judging an observer by hit rate alone.** Always pair it with the false alarm rate. Saying "yes" to everything gives a perfect hit rate and zero sensitivity.
- **Calling a criterion shift a sensitivity change.** If hits and false alarms rise together, suspect bias. Sensitivity changes when the gap between the curves changes.
- **Thinking a low threshold always means a better sense.** In SDT terms, a low reported threshold may only reflect a liberal criterion.
- **Assuming Weber's law holds everywhere.** It weakens at the extremes of intensity.

## One-minute recap

Absolute threshold: weakest stimulus detected 50 percent of the time. JND: smallest detectable change, 50 percent of the time. Weber's law: &Delta;I/I = k, so the needed change scales with the baseline. Fechner: felt magnitude tracks log intensity; Stevens: S = kI<sup>n</sup>. SDT: four outcomes (hit, miss, false alarm, correct rejection); d' = z(hit) - z(false alarm) measures sensitivity; the criterion measures bias, liberal or conservative. Rewards and expectations shift the cutoff and leave d' alone.

:::quiz
Q: If the Weber fraction for brightness is about 0.08, how much must a light of 300 units increase before the change is just noticeable?
A: About 0.08 × 300 = 24 units. The required change is a fixed fraction of the baseline, so a brighter starting light needs a larger absolute increase.
Q: An observer's hit rate and false alarm rate both rise after they are paid for each correct detection, and d' is unchanged. What changed?
A: Only the response criterion, which became more liberal. The gap between the two distributions, which is what d' measures, stayed the same.
Q: An observer has a hit rate of 0.70 and a false alarm rate of 0.70. What is d'?
A: d' = z(0.70) - z(0.70) = 0. The observer is saying yes equally often whether or not the signal is present, so performance is at chance.
Q: How does the absolute threshold differ from the difference threshold?
A: The absolute threshold is the weakest stimulus detected 50 percent of the time. The difference threshold, or JND, is the smallest change between two stimuli detected 50 percent of the time.
Q: A taster loses points for every false claim that a sample is spoiled, so they adopt a conservative criterion. Which two outcomes become more common?
A: Misses and correct rejections. A high cutoff means fewer yes responses, so fewer hits and false alarms and more misses and correct rejections.
:::
