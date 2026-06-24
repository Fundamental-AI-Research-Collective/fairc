---
title: The 42% Result
date: 2026-06-12
---

We run the controlled experiment at 50M parameters on an OLM transformer with RoPE, SwiGLU FFN, and tied embeddings, trained on FineWeb.

## Iso-FLOPs design

Three configurations isolate the two uses of compression:

| Model | Sequence length | $k$ | Transformer $L$ | Cost/seq | Interpretation |
|---|---|---|---|---|---|
| $k = 1$ (baseline) | $1024$ | $1$ | $1024$ | $1\times$ | reference |
| $k = 2$ | $2048$ | $2$ | $1024$ | $1\times$ | extend context (same transformer, $2\times$ raw window) |
| $k = 4$ | $1024$ | $4$ | $256$ | $\sim \tfrac{1}{4}\times$ | reduce cost ($4\times$ shorter transformer) |

The $k = 2$ model sees $2\times$ more raw tokens but has the same transformer length as baseline. The $k = 4$ model has a $4\times$ shorter transformer and uses the savings to see $\sim 5\times$ more raw tokens within the same FLOPs budget.

## The headline number

At iso-FLOPs ($1.95 \times 10^{17}$), the three models reach:

| Model | Tokens at iso-FLOPs | Eval loss |
|---|---:|---:|
| $k = 1$ | $1.00\text{B}$ | $5.3998$ |
| $k = 2$ | $2.01\text{B}$ | $5.4341$ |
| $k = 4$ | $4.96\text{B}$ | $5.1830$ |

The $k = 4$ model reaches $k = 1$'s final loss at **$\sim 42\%$ fewer FLOPs** ($1.13 \times 10^{17}$ vs $1.95 \times 10^{17}$). The $k = 2$ model, despite seeing $2\times$ more raw tokens, shows **no improvement** — it actually trails the baseline slightly.

![Loss vs FLOPs — the central figure](/threads/token-deep-memory/fig1-loss-vs-flops.png)

*At equal FLOPs, $k = 4$ (yellow) sits well below both $k = 1$ (purple) and $k = 2$ (green).*

![Loss vs tokens seen](/threads/token-deep-memory/fig3-loss-vs-tokens.png)

*$k = 4$ consumes $\sim 5.5\times$ more raw tokens than $k = 1$ for the same compute (each pass is $\sim 4\times$ cheaper).*

## The punchline

The contrast between $k = 2$ and $k = 4$ is the key insight: **the benefit comes from reducing the number of transformer positions, not from exposing the model to more raw data.** When compute per sequence is held constant (the $k = 2$ case), the information lost to averaging roughly cancels the advantage of seeing more tokens. When the transformer is shortened (the $k = 4$ case), the compute savings dominate.

![Loss vs FLOPs on log scale](/threads/token-deep-memory/fig4-loss-vs-flops-log.png)

*$k = 4$'s advantage is present throughout training, not just at the endpoint.*

This is a compute-efficiency story, not a data-efficiency story.

## Capacity threshold

At $8\text{M}$ parameters, averaging hurts — the small model spends its limited capacity just coping with the blended representations rather than learning from them. Decoding averaged ("superposed") embeddings is itself a skill that costs model capacity. The technique needs a minimum scale to pay off.
