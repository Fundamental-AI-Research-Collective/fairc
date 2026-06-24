---
title: Beyond MNIST — and the Road to LLMs
date: 2026-06-23
---

## Validation on CIFAR-10

The structural findings hold beyond MNIST. On a convolutional network's MLP head on CIFAR-10, the pruner removes ~71% of head neurons at ~1.5pp cost at the Pareto knee. The width-prunability pattern reappears *within a single network* — the widest layer prunes hardest, while the last hidden layer before the output hits a load-bearing floor it will not cross.

![CIFAR MLP-head pruning across lambda values](/threads/learned-efficiency-pruning/fig7-cifar-mlp-head.png)

*CIFAR MLP-head pruning across $\lambda$. The per-layer allocation mirrors the width/depth law: wide layers are compressed aggressively, the narrow pre-output layer is preserved.*

## Limitations

LEP characterizes redundancy in **fully-connected** structure — MLPs and MLP heads. Convolutional and attention layers are reached only indirectly so far. The learned mask is network-specific and does not transfer, so the method saves *inference* compute but not the cost of training a pruner per model. The $\lambda$-scaling regularity is supported by three data points — suggestive, not established. All accuracy numbers are at modest scale.

## Research directions

We see five open lines of work:

1. **Prune during training.** The single regime where the RL framing is not degenerate, because masking decisions feed back into co-adapting weights. This converts our negative RL result into a characterized boundary.

2. **A transferable redundancy detector.** Meta-train LEP over a *distribution* of networks using permutation-invariant features. Success would turn the per-model pruner into a single reusable "redundancy reader."

3. **Prunability as an effective-dimension probe.** Treat the mask as an instrument — sweep data, width, depth, and training time and read prunability off as a proxy for effective dimension, tying it quantitatively to double descent and lottery tickets.

4. **Train-to-be-prunable.** A training-time regularizer that *concentrates* redundancy, flipping pruning from a post-hoc tool into an inductive bias.

5. **Scaling to large language models.** The MLP/feed-forward blocks of transformers are exactly the fully-connected structure LEP already handles, and they hold the majority of an LLM's parameters. We intend to study whether a weight-conditioned readout finds the same kind of width-concentrated, near-deterministic redundancy in FFN blocks — and whether a per-block $\lambda$ can deliver structured, inference-cheap sparsity at LLM scale. This is the direction we are most excited to pursue.

## Conclusion

A trained network's redundancy is legible in its weights alone. A small weight-conditioned hypernetwork reads it out near-deterministically, beats classical heuristics at every budget, and provably outperforms RL — which on a frozen model is only static subset selection in disguise. Along the way the method surfaces a structural law: prunability tracks **width**, capacity tracks **depth**, and **weights**, not neurons, are conserved. Learned Efficiency Pruning is therefore as much a *measurement instrument* for overparameterization as it is a compression tool — and the instrument is ready to be pointed at large language models.
