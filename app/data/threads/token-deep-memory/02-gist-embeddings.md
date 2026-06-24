---
title: Gist Embeddings and Retrieval
date: 2026-02-25
---

In our architecture, every $k$ consecutive historical tokens are compressed into a single *gist* vector by a learned pooling operation. The gist preserves mean semantic content while discarding positional and high-frequency token-level variation. The compression schedule is adaptive: regions of high gradient signal during training are compressed more slowly; redundant stretches collapse aggressively.

Formally, for a block of token hidden states $h_1, \ldots, h_k$, the gist is computed as:

$$
\bar{h} = \text{Pool}(h_1, \ldots, h_k) = W \cdot \text{mean}(h_1, \ldots, h_k) + b
$$

where $W$ and $b$ are learned. The pooling can be replaced with a small attention mechanism over the block for higher fidelity at modest cost.

## Retrieval on demand

Attention over gists runs in $O(n/k)$ time — linear in the number of compressed blocks rather than the number of raw tokens. When the model's attention pattern signals that a compressed region is load-bearing for the current prediction, a retrieval head reconstructs an approximation of the original token sequence from the gist embedding.

This two-tier system — compressed storage, on-demand decompression — mirrors episodic memory architectures observed in biological neural systems, where the hippocampus stores compressed event representations and reconstructs detail when a retrieval cue matches the stored pattern.

## Open questions

The current design treats compression granularity $k$ as a fixed hyperparameter. An obvious extension is a learned, dynamic $k$ that varies based on local information density. We are also investigating whether gist vectors can serve as addressable keys in an external memory bank, enabling context windows that extend across multiple inference sessions.
