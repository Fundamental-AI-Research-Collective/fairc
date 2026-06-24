# Current results summary

## One-line thesis

MoWE is a structured-sparsity architecture: each expert reads the whole residual stream, but writes only to its own residual slice. This turns expert specialization into a geometric constraint rather than a post-hoc hope: co-active experts no longer sum into the same coordinates, so cross-expert interference is zero by construction.

## Why this is different from MoE

| Architecture | Expert read | Expert write | Co-active expert interaction | Main failure mode |
|---|---|---|---|---|
| Dense FFN | all neurons read all input | all neurons write full residual | everything always mixed | global superposition / no conditional specialization |
| MoE | expert reads full residual | expert writes full residual | expert outputs are summed in shared residual coordinates | inter-expert interference; experts must coordinate conventions |
| Half-MoWE / sparse MLP | grouped hidden slices | shared dense readout to full residual | selected slices are summed through a shared readout | mathematically MoE-like; not the core claim |
| Full MoWE | expert reads full residual | expert writes disjoint residual slice | no output-coordinate overlap between experts | residual capacity partitioning; requires enough layers/data to exploit |

MoE can reduce interference inside each expert, but because all active experts write into the same residual coordinates, it still has inter-expert interference. Full MoWE moves the problem: inter-expert interference is structurally removed, and any remaining superposition is local within each expert’s own slice.

## Toy sparse-feature results

Source: [`experiments/toy_models2/RESULTS.md`](../experiments/toy_models2/RESULTS.md)

Key results:

- On clustered sparse features, MoWE discovers the cluster structure from reconstruction loss alone.
- At medium scale (`N=200`, `G_feat=20`), MoWE reaches a target accuracy with fewer active neurons than MoE.
- At high within-cluster correlation (`p_within=1.0`), MoWE routing becomes nearly diagonal: one model group per data cluster.
- In the within-group superposition sweep, MoWE beats MoE on the measured off-diagonal interference metric in 4/5 settings, with the clearest gap at high correlation.

Figures:

![Toy routing alignment](figures/toy_routing_alignment_transparent.png)

![Toy accuracy advantage](figures/toy_accuracy_advantage_transparent.png)

## CIFAR-10 and domain specialization

Source: [`experiments/cifar10/RESULTS.md`](../experiments/cifar10/RESULTS.md)

Early 4-domain augmented CIFAR-10:

- Domains: color, grayscale, rotated 12°, Gaussian-blurred.
- With `G=4, k=1`, the rotated domain strongly avoids one group: Group 2 gets only 3.9% of rotated examples vs 25% uniform.
- Class routing also becomes semantically non-random:
  - Group 2 is enriched for transport classes such as airplane, ship, and truck.
  - Group 0 is enriched for animals such as cat and dog.

Large-`G` CIFAR scaling:

- MoWE accuracy stays roughly flat at ~47–48% from `G=512` to `G=4096` with fixed active neurons.
- MoE collapses as `G` grows: 35.6% at `G=512`, 35.3% at `G=1024`, 29.1% at `G=2048`.
- Dense still wins absolute CIFAR accuracy at this simple one-layer setting: Dense-4096 reaches 50.31% vs MoWE `G=4096,k=2048` at 48.03%.
- Interpretation: MoWE handles extreme expert fragmentation much better than MoE, but CIFAR-10 with shallow MLPs is not yet an absolute accuracy win over dense.

Figures:

![CIFAR domain routing](figures/cifar_domain_routing_transparent.png)

![CIFAR class routing](figures/cifar_class_routing_transparent.png)

![CIFAR large-G specialization](figures/cifar_large_g_specialisation_transparent.png)

## Full MoWE deep synthetic and CIFAR residual-block results

Source: [`experiments/full_mowe/RESULTS.md`](../experiments/full_mowe/RESULTS.md)

Deep synthetic residual autoencoder:

- Full MoWE removes cross-expert residual interference exactly: measured inter-expert interference is 0.000 by construction.
- MoE and half-MoWE retain 3–7% cross-expert residual interference.
- In the hard clustered regime (`p_within=1.0, S=0.7`), full MoWE gets 0.508 exact-match accuracy with 66k params vs MoE 0.245 with 110k params; parameter-matched full MoWE reaches 0.555.

CIFAR residual-block experiment:

| Condition | Params | Test acc | Cross-expert interference | Intra-expert interference |
|---|---:|---:|---:|---:|
| dense_flop | 757k | 89.27 ± 0.03% | — | 0.0131 |
| dense_mem | 1.35M | 89.22 ± 0.11% | — | 0.0099 |
| MoE | 1.36M | 89.22 ± 0.25% | 0.0209 | 0.0009 |
| Full MoWE | 1.01M | 89.36 ± 0.14% | 0.0000 | 0.0112 |

Result: Full MoWE matches dense/MoE accuracy on this real-data residual-block test while removing cross-expert interference and using fewer FFN parameters than MoE.

Figures:

![Deep synthetic](figures/fullmowe_deep_synthetic_transparent.png)

![FullMoWE CIFAR deep](figures/fullmowe_cifar_deep_transparent.png)

## Language model results

Sources:

- [`experiments/LM/plots/publishable_tier3_ropefix_20260620/summary.md`](../experiments/LM/plots/publishable_tier3_ropefix_20260620/summary.md)
- [`experiments/LM/FULLMOWE_STABILIZATION.md`](../experiments/LM/FULLMOWE_STABILIZATION.md)

Use fixed-RoPE results only. Earlier LM results had a RoPE axis bug and are not claim-bearing.

Interpretability, fixed-RoPE, Tier-3 GPT scoring:

| Representation | Valid / total | Mean corr | 95% CI | Median | >0.5 |
|---|---:|---:|---:|---:|---:|
| FullMoWE native residual | 200/200 | 0.583 | [0.540, 0.625] | 0.671 | 64% |
| FullMoWE random-basis control | 200/200 | 0.359 | [0.320, 0.398] | 0.354 | 32% |
| Dense native residual | 200/200 | 0.322 | [0.279, 0.362] | 0.325 | 32% |
| Dense random-basis control | 200/200 | 0.253 | [0.213, 0.295] | 0.229 | 23% |
| Dense SAE | 185/200 | 0.542 | [0.489, 0.593] | 0.572 | 58% |

Interpretation:

- FullMoWE native residual features are much more monosemantic than dense native residual dimensions.
- FullMoWE native is statistically close to dense+SAE; the difference FullMoWE - Dense SAE is +0.041 mean corr with CI crossing zero.
- Defensible claim: FullMoWE produces native SAE-level interpretability signals, without a post-hoc SAE training step.

LM loss status:

| Run | Status | Latest / final tokens | CE |
|---|---|---:|---:|
| Dense fixed-RoPE baseline | finished | 4.99B | 2.944 |
| Old FullMoWE fixed-RoPE aux=0.01 | finished | 4.99B | 3.166 |
| Stabilized FullMoWE 768d | live | 1.032B | 3.990 |
| Dense fixed-RoPE at matched 1.032B | finished | 1.032B | 3.621 |

Current read:

- The old FullMoWE run had strong interpretability but a significant CE tax.
- Router stabilization improved training substantially. At ~1B tokens the live stabilized run is still behind dense by ~0.37 CE, but far better than the old FullMoWE trajectory.
- A smaller 512d router-stability sweep found a recipe (`loss-free balance + z-loss + tiny aux`) that reached dense parity at 1B, so the stabilization direction is credible but still being validated at 768d.

Figures:

![LM CE](figures/lm_ce_dense_vs_fullmowe_transparent.png)

![LM router stability](figures/lm_router_stability_512_transparent.png)

![LM interpretability](figures/lm_interpretability_tier3_transparent.png)

## Current honest claim boundary

Strong:

- Full MoWE structurally eliminates cross-expert residual interference.
- Toy and deep-synthetic experiments support the mechanism.
- CIFAR specialization shows routing finds semantic/domain structure.
- Fixed-RoPE LM interpretability is strong: FullMoWE native residual features look SAE-like and far more interpretable than dense native residual dimensions.

Still open:

- Closing the full-scale LM CE gap to dense.
- Showing the interpretability advantage persists once CE is tightly matched.
- Showing robustness across seeds and larger models.
- Determining the best router-stabilization recipe at 768d/5B scale.
