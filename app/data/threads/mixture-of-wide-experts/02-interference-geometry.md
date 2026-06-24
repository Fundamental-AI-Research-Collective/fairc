---
title: The Interference Geometry
date: 2026-06-18
---

The difference between MoE and MoWE is best understood as two kinds of interference that dense, MoE, and MoWE architectures handle differently.

## Two kinds of interference

**Intra-expert interference** — features inside one expert share that expert's hidden space. This is superposition within a single subnetwork.

**Inter-expert interference** — co-active experts write into the same residual coordinates. This forces experts to coordinate their output conventions even though they are conceptually independent specialists.

| Architecture | Expert read | Expert write | Inter-expert interference |
|---|---|---|---|
| Dense FFN | all neurons | full residual | everything always mixed |
| MoE | full residual | full residual | experts sum into shared coordinates |
| Full MoWE | full residual | disjoint slice | **zero by construction** |

MoE reduces intra-expert interference (each expert has its own hidden space) but retains inter-expert interference (the residual stream is a shared write target). Full MoWE eliminates inter-expert interference entirely — any remaining superposition is local within each expert's own slice.

## The architectural tradeoff

The cost is explicit: each expert gets only $d/G$ output dimensions instead of $d$. This is a capacity partition. For $G = 8$ experts in $d = 768$, each expert writes $96$ dimensions. If the task requires experts to coordinate output conventions, this constraint hurts. If specialization is the goal — different experts owning different kinds of information — the constraint is a feature.

The question is empirical: does the routing learn to exploit this partition, and does the interference reduction show up in the representations? The next posts examine this across controlled, vision, and language-model settings.
