---
title: Token Averaging — Compressing the Input Sequence
date: 2026-06-10
---

The gist embedding idea from the previous post assumed a learned compression. We step back and ask a simpler question first: **what if we compress the input sequence before the transformer even sees it — by plain averaging of neighbouring token embeddings?**

Token averaging is static and parameter-free. Before the first transformer layer, every $k$ consecutive token embeddings are collapsed into a single mean vector. The transformer then runs on a sequence that is $k\times$ shorter.

```
Raw tokens:   [t1, t2, t3, t4, t5, t6, t7, t8]

k=2 average:  [avg(t1,t2), avg(t3,t4), avg(t5,t6), avg(t7,t8)]   → 4 positions
k=4 average:  [avg(t1..t4),            avg(t5..t8)]               → 2 positions
```

For a raw sequence of length $L$ and window $k$, the transformer processes $L/k$ positions. The training objective remains next-token prediction: a compressed position predicts the first token of the next window. This keeps validation loss directly comparable to a standard model.

## Two knobs, two different stories

It matters whether you spend the compression on shortening the transformer or widening the effective context:

- **Reduce cost** — keep the raw context fixed, shrink the transformer to $L/k$ positions. Each step is cheaper, so a fixed compute budget buys more steps.
- **Extend context** — feed a $k\times$ longer raw sequence so the transformer still processes $L$ positions but covers $k \times L$ raw tokens. Same cost per step, wider window.

A core finding is that these two uses behave very differently. The next post has the numbers.
