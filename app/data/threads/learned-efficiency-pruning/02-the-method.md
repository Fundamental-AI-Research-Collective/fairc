---
title: A Weight-Conditioned Hypernetwork
date: 2026-06-20
---

**Learned Efficiency Pruning (LEP)** is a hypernetwork that consumes a frozen network's weight matrices and emits a keep/prune gate per neuron. The base network is never updated — only the hypernetwork's parameters are trained.

## Setup

Given a trained classifier $f_\theta$ with frozen weights $\theta$, we treat each prunable layer $\ell$ with weight matrix $W_\ell \in \mathbb{R}^{n_\ell \times d_\ell}$ row-by-row. Row $i$ — the fan-in weight vector of neuron $i$ — becomes one token. A hypernetwork $h_\phi$ reads these tokens and emits a logit $s_i$ per neuron; a gate $g_i = \sigma(s_i) \in [0, 1]$ multiplies that neuron's output, smoothly interpolating between keeping and pruning it.

## The encoder: a bidirectional LSTM

The encoder is a **BiLSTM** that scans the rows of each layer. This means the score for neuron $i$ is informed by the entire population of weight vectors in its layer — not just $W_{\ell, i}$ in isolation. A small per-layer **context head** summarizes each layer and is passed across layers, giving the model a cross-layer view so it can allocate sparsity between layers, not just within one.

## Training stability

Stable training required a specific recipe, arrived at empirically:

- **Tanh-bounded cross-layer context** — the layer-allocation signal is squashed to $(-1, 1)$ so no single layer can run away and starve another
- **LayerNorm + gradient clipping** on the encoder
- **Final gate-layer bias initialized to $+2.0$** — every gate starts open, so pruning is a deliberate act of closing gates rather than the reverse
- **Zero-initialized context head** — the cross-layer signal starts neutral

## The objective

We minimize the task loss under a soft sparsity penalty:

$$
\mathcal{L}(\phi) = \mathbb{E}\!\left[\,\text{CE}\!\left(f_\theta \odot g_\phi(x),\; y\right)\right] + \lambda \cdot \frac{1}{L} \sum_{\ell=1}^{L} \bar{g}_\ell
$$

where $\bar{g}_\ell$ is the mean gate in layer $\ell$ and gates are binarized in the forward pass with a straight-through estimator (STE). The single knob $\lambda$ trades accuracy against sparsity. Because the $+2.0$ bias holds scores near the STE's active band, gradient reaches every neuron at once — the penalty is a smooth, global Lagrangian rather than a hard budget.

At inference, the hypernetwork needs **no data and no gradients**: it reads $\theta$ and emits a mask.
