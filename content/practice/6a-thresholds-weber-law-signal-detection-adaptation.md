---
title: MCAT Thresholds, Weber's Law and Signal Detection Practice Questions
description: Ten free MCAT-style practice questions on absolute thresholds, the JND and Weber's law, signal detection theory, psychophysical laws and sensory adaptation, with full explanations.
aamc: 6A
category: 6a-sensation-perception
cluster: Sensory thresholds and Weber's law, Signal detection theory, Sensory adaptation, Psychophysics
product: 6a-sensation-perception
published: 2026-10-20
notes:
---

Psychophysics links the physical size of a stimulus to the sensation it produces. The absolute threshold is the weakest stimulus detected on 50 percent of trials, so it is a statistical point, not a hard wall. The difference threshold, or just noticeable difference (JND), is the smallest change between two stimuli noticed half the time. Weber's law says the JND is a constant fraction of the baseline (delta I / I = k), so heavier baselines need larger absolute changes. Fechner assumed every JND is an equal step in sensation and derived a logarithmic law. Stevens later fit a power law whose exponent differs by sense.

Signal detection theory splits a yes or no report into two parts. Sensitivity (d') is how well the observer separates signal from noise, computed from both the hit rate and the false alarm rate. The criterion is how willing the observer is to say yes, and payoffs, expectations and target rarity move it. Sensory adaptation is a drop in receptor firing to a constant stimulus, which happens at the receptor and is reversible.

Traps: a high hit rate alone says nothing about sensitivity; hits and false alarms moving in the same direction signal a criterion shift. Habituation is a central, learned drop in behavioral response, not receptor adaptation.

@@QUESTIONS

### Q1
In a weight-discrimination study, a participant holding a 250 g canister reliably notices an increase only when at least 5 g is added. Assuming Weber's law holds across this range, what is the smallest increase she would be expected to notice when holding a 900 g canister?
A) 5 g
B) 9 g
C) 18 g
D) 36 g
ANSWER: C
WHY: The Weber fraction is 5 / 250 = 0.02, and Weber's law keeps that ratio constant, so the JND at 900 g is 0.02 x 900 = 18 g. Choice A wrongly treats the JND as a fixed number of grams. Choices B and D do not follow from a constant ratio of 0.02.

### Q2
Two airport screeners each viewed 100 bags that contained a test object and 100 bags that did not.

| Screener | Hits (of 100 target bags) | False alarms (of 100 clean bags) |
|---|---|---|
| X | 69 | 7 |
| Y | 93 | 31 |

Using z(0.69) = 0.50, z(0.07) = -1.48, z(0.93) = 1.48 and z(0.31) = -0.50, which statement best compares the screeners?
A) Y is more sensitive than X because Y found more of the target bags.
B) X is more sensitive than Y because X made fewer false alarms.
C) The two have similar sensitivity, but Y uses a more conservative criterion.
D) The two have similar sensitivity, but Y uses a more liberal criterion.
ANSWER: D
WHY: d' equals z(hit rate) minus z(false alarm rate). For X that is 0.50 - (-1.48) = 1.98, and for Y it is 1.48 - (-0.50) = 1.98, so sensitivity is the same. Y says yes more often, raising both hits and false alarms, which is a liberal criterion. Choices A and B each look at only one rate, which is the classic error.

### Q3
In a hearing study using the method of constant stimuli, a tone was presented at five intensities in random order. The percent of trials on which the participant reported hearing it were as follows.

| Intensity (arbitrary units) | 2 | 4 | 6 | 8 | 10 |
|---|---|---|---|---|---|
| Percent detected | 10 | 30 | 70 | 90 | 98 |

Estimating linearly between tested points, what is the participant's absolute threshold for this tone?
A) 4 units
B) 5 units
C) 6 units
D) 10 units
ANSWER: B
WHY: The absolute threshold is the intensity detected on 50 percent of trials. Detection is 30 percent at 4 units and 70 percent at 6 units, so 50 percent falls halfway between, at about 5 units. Choice D is the intensity detected almost always, which is not how a threshold is defined.

### Q4
All of the following are examples of sensory adaptation EXCEPT
A) a toddler stops turning toward a harmless clicking sound after many repetitions, although recordings show her auditory nerve still fires normally to each click
B) olfactory receptors fire less and less during several minutes in a room with a constant coffee odor
C) a Pacinian corpuscle stops firing while steady pressure is maintained on the skin
D) rod sensitivity rises over about 20 to 30 minutes after a person enters a dark theater
ANSWER: A
WHY: Choice A describes habituation: the behavioral response fades while the receptors and sensory nerve keep responding, so the change is central and learned. Sensory adaptation is a change in the receptors themselves, as in the fading olfactory and Pacinian responses. Dark adaptation is also receptor level, because it reflects rhodopsin regeneration in rods.

### Q5
In a psychophysics experiment, researchers double the physical intensity of a light and, separately, of a mild electric current. Stevens' power law exponents are about 0.33 for brightness and about 3.5 for electric shock. By what factors should rated brightness and rated shock intensity change?
A) Brightness about 1.26 times; shock about 11 times
B) Both about 2 times
C) Brightness about 0.66 times; shock about 7 times
D) Brightness about 11 times; shock about 1.26 times
ANSWER: A
WHY: Under S = k I^n, doubling I multiplies S by 2^n. For brightness, 2^0.33 is about 1.26, a compressive change. For shock, 2^3.5 is about 11.3, an expansive change. Choice B assumes an exponent of 1, choice C multiplies the exponent by 2 instead of raising 2 to it, and choice D swaps the senses.

### Q6
An audio engineer measures listeners' loudness ratings and finds that each tenfold increase in sound power adds the same fixed number of points to the rating, whether the change is from 1 to 10 units or from 1000 to 10000 units. Which description of the stimulus and sensation relation fits these results best?
A) Weber's law, because the JND is a fixed number of power units
B) A Stevens power function with an exponent well above 1
C) Fechner's law, in which sensation is proportional to the log of intensity
D) The Young-Helmholtz trichromatic theory
ANSWER: C
WHY: Equal ratings steps for equal ratios of intensity define a logarithmic relation, S = k log I, which Fechner derived from Weber's constant-fraction rule. Weber's law concerns discrimination thresholds and does not say the JND is a fixed number of units. A power exponent well above 1 would make ratings climb faster and faster, and Young-Helmholtz is a theory of color vision.

### Q7
In a cancer-screening study, radiologists read the same set of scans twice. Before the second session they were told that missing a tumor would lead to serious harm, while a false alarm would only lead to a follow-up scan. According to signal detection theory, what change is most likely in the second session?
A) Hit rate rises and false alarm rate falls, because sensitivity improves
B) Hit rate and false alarm rate both rise, with d' about the same
C) Hit rate and false alarm rate both fall, with d' about the same
D) Hit rate falls and false alarm rate rises, because sensitivity worsens
ANSWER: B
WHY: Changing payoffs moves the criterion, not the observer's ability to separate signal from noise. Making misses costly pushes the radiologists toward a liberal criterion, so they say tumor more often on both tumor and clean scans. Opposite movements of the two rates, as in choices A and D, would indicate a change in d'.

### Q8
A researcher records from skin mechanoreceptors while a hiking pack strap presses steadily on a volunteer's shoulder for ten minutes. Which receptor type is best suited to keep signaling this sustained pressure?
A) Pacinian corpuscles
B) Meissner corpuscles
C) Hair follicle receptors
D) Merkel disks
ANSWER: D
WHY: Merkel disks are slowly adapting (tonic) receptors, so they keep firing during steady pressure and signal sustained contact. Pacinian and Meissner corpuscles are rapidly adapting and mainly signal vibration and changes in touch. Hair follicle receptors also respond mainly to movement of the hair, not to maintained pressure.

### Q9
In a visual search study, participants looked for a rare target that appeared on 2 percent of trials in one block and on 50 percent of trials in another. Misses were far more common in the 2 percent block, while d' was about the same in both blocks. What best explains the higher miss rate?
A) Sensory adaptation reduced receptor firing during the rare-target block.
B) Participants adopted a more conservative criterion when targets were rare.
C) Sensitivity fell because rare targets are physically harder to see.
D) Participants adopted a more liberal criterion when targets were rare.
ANSWER: B
WHY: When targets are rare, observers expect no target and require more evidence before saying yes, which is a conservative criterion. This raises misses and lowers false alarms without changing d'. Choice C contradicts the unchanged d', choice D would reduce misses, and nothing in the design points to receptor adaptation.

### Q10
On a tone-detection task, a participant's hit rate is 0.60 and her false alarm rate is also 0.60. What can be concluded?
A) She is highly sensitive but cautious about reporting tones.
B) Her absolute threshold must be lower than that of most listeners.
C) Her responses show adaptation to the repeated tones.
D) She cannot discriminate tone trials from noise trials, so d' is about 0.
ANSWER: D
WHY: When the hit rate equals the false alarm rate, z(hit) minus z(false alarm) is zero, so the observer says yes equally often whether or not the tone is present. That is chance discrimination. Choice A is wrong because sensitivity is zero, and nothing about thresholds or receptor adaptation can be read from equal rates.
