---
title: Core Results
date: 2026-06-21
---

All MNIST experiments use a $784 \to 1024 \to 1024 \to 10$ MLP (baseline test accuracy $98.06\%$) unless stated; CIFAR experiments use a convolutional backbone with an MLP head.

## Weights alone encode redundancy — and the readout is deterministic

A pruner that sees only weights prunes **60–79%** of the MNIST MLP at $< 0.1$–$3.7$ pp accuracy loss. Re-running the pruner from different random seeds on the same checkpoint produces essentially the same mask (alive/dead ratio $\sigma = 0.007$). Redundancy is not an artifact of a particular training run of the pruner — it is a **fixed, readable property of the trained weights**.

## LEP strictly dominates classical heuristics

At every accuracy budget, the weight-conditioned readout prunes more than activation- or magnitude-based scoring. At a $\leq 1$ pp accuracy-drop budget, LEP removes $\sim72\%$ of neurons versus $\sim46\%$ for activation pruning. Activation pruning collapses sharply past $\sim55\%$ pruned, while LEP holds $98.0\%$ accuracy at $52\%$ pruned and drops only $2$ pp at $75\%$.

![LEP vs activation and magnitude pruning on the same trained MNIST model](/threads/learned-efficiency-pruning/fig1-lep-vs-heuristics.png)

*Accuracy vs fraction pruned for the same trained MNIST model. The gap is the value of scoring full weight vectors jointly rather than scalar activation summaries independently.*

## Bigger networks are more prunable

Sweeping hidden width on a fixed task, prunability rises monotonically with size: a width-$32$ net yields $\sim8\%$ prunable, width-$1024$ yields $\sim25\%$, width-$2048$ yields $\sim51\%$ (at matched penalty). This is exactly the over-parameterization story behind the lottery ticket hypothesis, here read out directly by the pruner.

![Prunability rises monotonically with hidden dimension](/threads/learned-efficiency-pruning/fig2-prunability-vs-width.png)

*Fraction pruned vs hidden dimension. Redundancy — and thus prunability — scales with over-parameterization.*

## Width is cheap, depth is load-bearing — and weights are conserved

Holding the neuron budget fixed at $2048$ and varying shape reveals that prunability is governed by **width, not depth or parameter count**: a single wide layer $[2048]$ prunes to $\sim85\%$, the medium $[1024, 1024]$ to $\sim76\%$, and a deep $[512 \times 4]$ only to $\sim60\%$. Yet when measured in **weights rather than neurons**, all three architectures converge to $\sim240\text{K}$ surviving weights — an architecture-invariant compute floor for MNIST at this accuracy.

![Width/depth prunability and weight conservation across architectures](/threads/learned-efficiency-pruning/fig3-width-depth-conservation.png)

*Despite very different neuron-survivor counts across shapes ($314$ / $490$ / $814$ for $1$ / $2$ / $4$ layers), the surviving weight count lands near $\sim240\text{K}$ for all three $2048$-neuron nets. Width is cheap parallel redundancy; depth is sequential, load-bearing capacity. The conserved quantity is weights, not neurons.*

Notably, pruning a large net down to this $\sim240\text{K}$ floor does **not** reach the true minimum: a network trained small from scratch reaches comparable accuracy with $\sim3\times$ fewer weights. Pruning recovers a redundant solution, not the minimal one — consistent with Liu et al. (2019).

## The method transfers; the mask does not

A pruner trained on network $A$, applied frozen to network $B$, is catastrophic ($\sim28$ pp drop). Retraining the same architecture of pruner on $B$ recovers within $\sim4$ pp. Redundancy is real and findable in every network, but its **location is idiosyncratic** to each network's weights — each lives in its own permutation frame. LEP is a reliable procedure, not a portable answer.

![Frozen-pruner transfer experiment](/threads/learned-efficiency-pruning/fig4-frozen-transfer-fails.png)

*A frozen pruner transferred across networks performs far worse than an oracle pruner retrained on the target — the redundancy structure does not generalize, even though the method does.*
