---
title: Open Questions and Next Steps
date: 2026-06-16
---

## Rigour note: the causal-masking bug

Early in the project, a bug was discovered: causal masking was not applied even though `causal=True` was set. Models trained under this bug performed bidirectional attention, producing artificially low loss values. Every run from before the fix is invalidated for absolute comparison. We report the corrected runs as primary results and clearly mark pre-fix experiments as exploratory.

Silent correctness bugs in the training stack can masquerade as "great results." Treating suspiciously good numbers as a red flag, not a win, saved this project from a wrong conclusion.

## Limitations

- **Single primary scale ($50\text{M}$).** The $42\%$ figure is demonstrated at one model size and must be re-validated as capacity grows.
- **Loss, not downstream tasks.** We measure validation cross-entropy. Lower loss is necessary but not sufficient — downstream benchmarks are needed.
- **Static, uniform pooling for the main result.** The headline numbers use plain mean-pooling; smarter schemes are unexplored under corrected attention.
- **Probes use input embeddings, not deep contextual states.** The interpretability story is about what averaging does to the inputs the transformer receives.

## What we want to try next

1. **Scale up ($150\text{M}$ to $1\text{B}+$).** Test whether the $\sim 42\%$ saving holds, grows, or erodes with capacity. Config scaffolding for $125\text{M}$/$150\text{M}$ models already exists.

2. **Find the optimal $k$ per scale.** Larger models may tolerate more aggressive compression — or may need less. Exploratory runs at $k = 8, 16, 32, 64$ show diminishing returns beyond a point.

3. **Dynamic $k$ scheduling.** Start cheap (high $k$, lots of data) and anneal to fine-grained (low $k$) — combining the data reach of high $k$ with the representation quality of low $k$.

4. **Smarter pooling schemes.** The codebase supports weighted (uniform / linear / exponential / gaussian / triangular), overlapping (configurable window/stride), dynamic variable-length, and learnable averagers. These are the levers for "smarter than mean-pooling" follow-ups.

5. **Downstream evaluation.** Confirm the loss improvement transfers to tasks (MMLU, HellaSwag, etc.).

6. **Compose with the rest of the stack.** Averaging is orthogonal to Flash Attention, gradient checkpointing, mixed precision, and parallelism — quantify the combined effect.

The core takeaway stands: **compression pays off through transformer length, not through data volume.** The question now is how far this principle scales and whether smarter compression can push the efficiency frontier further.
