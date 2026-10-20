---
title: Thin Lens and Mirror Equation: Sign Conventions for the MCAT
description: Solve any lens or mirror problem with 1/f = 1/do + 1/di and m = -di/do, using one sign convention, an image table and four worked examples.
product: 4d-light-sound-optics
published: 2026-10-20
---

One equation handles every thin lens and spherical mirror: **1/f = 1/d<sub>o</sub> + 1/d<sub>i</sub>**, with magnification **m = -d<sub>i</sub>/d<sub>o</sub>**. The sign conventions are what make it work. Converging elements (concave mirrors and convex lenses) have positive f, diverging elements (convex mirrors and concave lenses) have negative f, a positive d<sub>i</sub> means a real image, and a positive m means an upright image. Learn those four rules once and you never need separate formulas for mirrors and lenses.

## The two equations

| Equation | What it gives |
|---|---|
| 1/f = 1/d<sub>o</sub> + 1/d<sub>i</sub> | Where the image forms |
| m = -d<sub>i</sub>/d<sub>o</sub> = h<sub>i</sub>/h<sub>o</sub> | How big it is and which way up |
| f = R/2 (mirrors only) | Focal length from radius of curvature |
| P = 1/f, f in meters | Lens power in diopters (D) |

The distances d<sub>o</sub> (object distance) and d<sub>i</sub> (image distance) are measured from the mirror or lens. For a single element with a real object, d<sub>o</sub> is positive, and all the information about the image lives in the signs of d<sub>i</sub> and m.

## The sign conventions, in one table

| Quantity | Positive means | Negative means |
|---|---|---|
| f | Converging: concave mirror or convex lens | Diverging: convex mirror or concave lens |
| d<sub>i</sub> | Real image: on the reflecting side of a mirror, or on the far side of a lens | Virtual image: behind a mirror, or on the object's side of a lens |
| m | Upright image | Inverted image |
| &#124;m&#124; | Greater than 1: enlarged. Less than 1: reduced | |

Two ideas make the table memorable.

**Real images form where the light actually goes.** A mirror sends light back toward the object, so its real images sit in front of it. A lens lets light pass through, so its real images sit on the far side. A real image can be projected onto a screen. A virtual image is where light only appears to come from, like your reflection behind a bathroom mirror.

**Converging gets a plus, whatever the surface is called.** The words flip between mirrors and lenses, which is the most common source of sign errors. A concave mirror curves in like a cave and gathers light to a focus. A convex lens is thick in the middle and also gathers light. Both are converging, both get positive f. Their partners, the convex mirror and the concave lens, both spread light out and get negative f.

A quick check for a single element with a real object: a real image is always inverted, and a virtual image is always upright. If your answer has a real, upright image from one lens, a sign went wrong.

## What the image looks like, case by case

For a converging element (concave mirror or convex lens) the image depends on where the object sits relative to f and 2f:

| Object position | Image location | Type | Orientation | Size |
|---|---|---|---|---|
| Very far away | At f | Real | Inverted | Tiny |
| Beyond 2f | Between f and 2f | Real | Inverted | Reduced |
| At 2f | At 2f | Real | Inverted | Same size |
| Between f and 2f | Beyond 2f | Real | Inverted | Enlarged |
| At f | No image (rays leave parallel) | | | |
| Inside f | Same side as object (lens) or behind mirror | Virtual | Upright | Enlarged |

A diverging element is simpler: with a real object, its image is virtual, upright and smaller every time, located closer to the element than the focal point. That is why a convex security mirror shows a wide, shrunken view of a whole store.

![Two ray diagrams for a converging lens with f = 20 cm: an object at 50 cm forms a real inverted image at 33 cm, and an object at 12 cm forms a virtual upright image at 30 cm on the object side](assets/notes/thin-lens-mirror-equation-sign-conventions.png "The same lens makes a real, inverted image or a virtual, upright one depending on whether the object is outside or inside the focal length.")

## Drawing rays to check your algebra

Three principal rays locate any image. For a converging lens:

1. A ray parallel to the axis bends through the focal point on the far side.
2. A ray through the center of the lens continues in a straight line.
3. A ray through the focal point on the near side leaves parallel to the axis.

Where the outgoing rays cross, the image is real. If they spread apart, trace them backward as dashed lines; where the extensions cross, the image is virtual. For a mirror the same three rays apply with reflection instead of transmission (parallel in, out through F; through F in, out parallel; and a ray aimed at the center of curvature returns along itself). Sketching even a rough ray diagram catches most sign mistakes.

## Worked example 1: converging lens, object outside f

A convex lens has f = +20 cm. An object stands 50 cm in front of it.

1. 1/d<sub>i</sub> = 1/f - 1/d<sub>o</sub> = 1/20 - 1/50 = 5/100 - 2/100 = 3/100.
2. d<sub>i</sub> = 100/3 = **+33 cm**. Positive, so the image is real and on the far side of the lens.
3. m = -d<sub>i</sub>/d<sub>o</sub> = -33.3/50 = **-0.67**. Negative means inverted, and the image is two thirds the height of the object.

This matches the table: the object is beyond 2f (40 cm), so the image lands between f and 2f, real, inverted and reduced.

## Worked example 2: the same lens as a magnifier

Move the object to 12 cm, inside the focal length.

1. 1/d<sub>i</sub> = 1/20 - 1/12 = 3/60 - 5/60 = -2/60.
2. d<sub>i</sub> = **-30 cm**. Negative, so the image is virtual and on the same side as the object.
3. m = -(-30)/12 = **+2.5**. Upright and two and a half times larger.

This is how a handheld magnifying glass works.

## Worked example 3: a convex mirror

A convex mirror has a radius of curvature of 30 cm. A small object sits 30 cm in front of it.

1. f = R/2 = 15 cm in size, and a convex mirror diverges, so f = **-15 cm**.
2. 1/d<sub>i</sub> = -1/15 - 1/30 = -2/30 - 1/30 = -3/30, so d<sub>i</sub> = **-10 cm**: virtual, behind the mirror.
3. m = -(-10)/30 = **+0.33**: upright and one third the size.

## Worked example 4: lens power and lenses in contact

The lens from examples 1 and 2 has f = +0.20 m, so its power is P = 1/0.20 = **+5.0 D**. Place it in contact with a diverging lens of f = -50 cm (P = -2.0 D). For thin lenses in contact, powers add: P = +5.0 + (-2.0) = **+3.0 D**, so the pair acts like one converging lens with f = 1/3.0 m, about 33 cm.

Always convert to meters before taking the reciprocal. A lens with f = 20 cm has a power of 5 D, not 0.05 D.

## Common traps

- **Giving a concave lens a positive f.** Concave mirrors converge, concave lenses diverge. Decide "converging or diverging" first, then assign the sign.
- **Forgetting f = R/2 for mirrors.** A mirror with R = 40 cm has f = 20 cm.
- **Dropping the minus sign in m = -d<sub>i</sub>/d<sub>o</sub>.** Without it, every real image comes out upright, which is backward.
- **Reading a negative d<sub>i</sub> as an error.** It just means a virtual image. Report it, and say which side it is on.
- **Putting a lens's real image on the object side.** For lenses, real images are on the far side. For mirrors, real images are in front.
- **Computing diopters from centimeters.** Convert f to meters first.
- **Adding magnifications in a two-lens system.** Multiply them: m<sub>total</sub> = m<sub>1</sub> &times; m<sub>2</sub>. The image of the first lens becomes the object of the second.

## One-minute recap

Use 1/f = 1/d<sub>o</sub> + 1/d<sub>i</sub> and m = -d<sub>i</sub>/d<sub>o</sub> for both mirrors and thin lenses. Converging elements (concave mirror, convex lens) have f greater than 0; diverging ones (convex mirror, concave lens) have f less than 0. Positive d<sub>i</sub> is a real image where the light goes: in front of a mirror, behind a lens. Negative d<sub>i</sub> is virtual. Positive m is upright, negative m is inverted, and for one element real pairs with inverted. A converging element makes a virtual, enlarged image only when the object is inside f. Diverging elements always make virtual, upright, reduced images. For mirrors f = R/2; for lenses P = 1/f in diopters with f in meters, and powers of lenses in contact add.

:::quiz
Q: A concave mirror has a radius of curvature of 40 cm and an object 60 cm in front of it. Where is the image and what is it like?
A: f = +20 cm, so 1/di = 1/20 - 1/60 = 1/30 and di = +30 cm. The image is real, in front of the mirror, inverted, and half size (m = -0.5).
Q: A lens forms an image with di = -15 cm for an object at 10 cm. Is the image real or virtual, and is it upright?
A: Negative di means a virtual image on the object's side, and m = -(-15)/10 = +1.5, so it is upright and enlarged.
Q: Which two optical elements have a negative focal length?
A: The convex mirror and the concave lens. Both are diverging, so both spread parallel light and get negative f.
Q: A diverging lens has f = -25 cm. What is its power?
A: P = 1/f with f in meters, so P = 1/(-0.25) = -4.0 D.
Q: An object sits 8 cm from a converging lens with f = 10 cm. Can the image be projected on a screen?
A: No. The object is inside f, so di = -40 cm and the image is virtual, upright and enlarged, and virtual images cannot be projected.
:::
