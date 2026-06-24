---
title: Sparse Brains, Dense Hardware
date: 2026-06-18
---

Biological neural systems are extremely sparse: only a small subset of neurons is active for any input, and specialization emerges across circuits. Modern neural networks are the opposite — dense matrix multiplications activate every neuron on every token because that is what current hardware computes efficiently.

Mixture-of-Experts (MoE) models introduced conditional computation: route each input to a few specialists instead of using everyone. But there is a structural problem that MoE does not solve. Every active expert writes a full $d_{\text{model}}$ vector back into the same residual stream. The outputs are summed into shared coordinates, so co-active experts must learn compatible output conventions. This is **inter-expert interference** — a coordination tax that grows with the number of active experts.

## MoWE: read globally, write locally

**Mixture of Wide Experts (MoWE)** changes one thing about MoE: the write side. Each expert still reads the full residual stream. But instead of writing a full $d_{\text{model}}$ update, each expert writes only to a **disjoint slice** of the residual. Co-active experts land in different coordinates. Their outputs are concatenated, not summed.

In standard MoE, experts share the residual write space:

> Expert A: $d \to H \to d$ , Expert B: $d \to H \to d$ — outputs summed in the same $d$ coordinates

In Full MoWE, experts own their output coordinates:

> Expert A: $d \to H \to d/G$ writes slice A, Expert B: $d \to H \to d/G$ writes slice B — concatenated into disjoint coordinates

Dense downstream layers and the final head can still recombine the full residual, so MoWE is not a hard ensemble. It is a **structured residual partition** — sparse across groups, dense within each group, with no output-coordinate conflict between experts.

## Why not just use MoE?

MoE handles conditional computation but not residual write conflict. If two active experts both write full $d_{\text{model}}$, then every output coordinate becomes a negotiation between experts. Full MoWE removes this inter-expert write conflict. The cost is that each expert gets only a $d/G$ slice of the residual output. That is a real architectural constraint — but if specialization is the goal, the constraint is exactly the point: an expert owns its coordinates and can build a coherent local representation there.

The bet: specialization should not be an accident of optimization. The architecture should make specialization the easy solution.
