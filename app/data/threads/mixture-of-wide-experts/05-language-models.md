---
title: Language Models — Interpretability and the CE Gap
date: 2026-06-22
---

Language models are the real test. They are deep, residual-stream dominated, and hard enough that architectural constraints show up in loss.

## Native interpretability rivals post-hoc SAEs

Using Tier-3 GPT scoring over $200$ residual-stream units (fixed-RoPE runs only):

| Representation | Mean correlation | Median | $> 0.5$ fraction |
|---|---:|---:|---:|
| FullMoWE native residual | $0.583$ | $0.671$ | $64\%$ |
| Dense native residual | $0.322$ | $0.325$ | $32\%$ |
| Dense + SAE | $0.542$ | $0.572$ | $58\%$ |

FullMoWE native residual directions are far more interpretable than dense native directions, and are in the same range as a post-hoc SAE trained on dense activations — without any SAE training step.

![Residual-stream monosemanticity by layer](/threads/mixture-of-wide-experts/fig8-lm-interpretability.png)

*MoWE residual dimensions stay interpretable across all layers, while dense residual dimensions collapse in mid-layers where superposition is strongest. MoWE produces SAE-like native features without a separate decomposition step.*

## The CE gap: not closed, but closing

The loss story is not finished. The dense fixed-RoPE baseline reaches CE $2.944$ at $5\text{B}$ tokens. The initial FullMoWE run reached CE $3.166$ — a significant interpretability win but a meaningful CE tax. A new stabilized FullMoWE run is tracking substantially better but still trails dense at $768d$ scale.

![Language-model CE curves](/threads/mixture-of-wide-experts/fig9-lm-ce-curves.png)

*Dense vs FullMoWE cross-entropy over training. The stabilized run (green) is a large improvement over the initial FullMoWE trajectory (blue dashed), but has not yet reached dense parity at $768d$.*

## Router stabilization

A $512d$ router-stability sweep found a promising recipe: loss-free balancing, router z-loss, and tiny auxiliary load-balancing. This combination reached dense parity at $1\text{B}$ tokens while keeping routing healthier than the no-auxiliary variant.

![512d router-stability sweep](/threads/mixture-of-wide-experts/fig10-lm-router-stability.png)

*CE loss curves for the $512d$ stability sweep. The bias+zloss+tinyaux recipe (green) reaches dense parity ($4.178$ vs $4.187$), validating the stabilization direction.*

## Current status

The mechanism is supported: MoWE routing discovers structure, Full MoWE removes cross-expert interference by construction, and LM native features are SAE-like. The main unresolved issue is optimization — closing the CE gap to dense at the full $768d$ / $5\text{B}$ token scale. The current paper shape is honest:

> MoWE trades extra parameters and routing constraints for native specialization and interpretability. It structurally removes expert-output interference, learns meaningful routing, and produces SAE-like native language-model features. The remaining research problem is closing the CE gap to dense at scale.

That is a defensible progress story and a clear technical agenda.
