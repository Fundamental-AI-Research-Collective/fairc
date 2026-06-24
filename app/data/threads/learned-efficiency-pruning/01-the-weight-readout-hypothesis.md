---
title: The Weight Readout Hypothesis
date: 2026-06-20
---

Most pruning methods ask the same question: *which neurons matter for the data?* They push examples through the network, collect activation magnitudes or gradient-based importance scores, and rank neurons by a scalar summary. The recipe — train dense, score by magnitude, remove the smallest, fine-tune — goes back to Han et al. (2015) and remains the strongest simple baseline.

Two properties unify nearly all of this work. First, the importance signal is **data-dependent**: you need forward passes to score a neuron. Second, the scoring is **local and independent**: each neuron gets a scalar rank, and interactions between neurons (and between layers) are handled only implicitly through iterative retraining.

## The question we actually want to ask

We take a different stance. Instead of asking "which neurons have small activations on this data?", we ask: **what does the weight matrix itself tell us about how compressible this network is?**

The hypothesis is simple — a trained network's redundancy is already written into its weights. If that's true, then a small model should be able to read it out directly, without ever seeing the training data. No forward passes, no gradients, no iterative prune-retrain cycles. Just weights in, mask out.

## Why this reframing matters

If redundancy is a readable property of the weights, then pruning becomes a **measurement** rather than an optimization. The mask is not a design choice — it is a fact about the network, discovered rather than imposed. This changes what pruning can tell us: it stops being just a compression tool and becomes an instrument for probing how much of a network's capacity is actually being used.

This is the starting point for Learned Efficiency Pruning. The next post describes the model that performs this readout.
