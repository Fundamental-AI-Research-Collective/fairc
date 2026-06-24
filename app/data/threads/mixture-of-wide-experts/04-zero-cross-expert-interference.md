---
title: Zero Cross-Expert Interference
date: 2026-06-20
---

The Full MoWE distinction matters most in deep networks, where routed residual blocks feed later layers and interference compounds.

## Deep synthetic residual autoencoder

In a deep synthetic setting ($d = 64$, $G = 8$, $k = 2$, depth $= 3$), Full MoWE removes cross-expert residual interference exactly — measured inter-expert interference is $0.000$ by construction. MoE and half-MoWE retain $3$–$7\%$ cross-expert interference.

In the hard clustered regime ($p_{\text{within}} = 1.0$, $S = 0.7$), Full MoWE reaches $0.508$ exact-match accuracy with $66\text{K}$ params versus MoE at $0.245$ with $110\text{K}$ params.

![Deep synthetic accuracy and interference decomposition](/threads/mixture-of-wide-experts/fig6-fullmowe-deep-synthetic.png)

*Full MoWE (green) achieves zero cross-expert interference in all conditions while MoE (red) and half-MoWE (orange) retain measurable interference. In the hard-clustered regime, Full MoWE doubles MoE's accuracy with fewer parameters.*

## CIFAR residual-block experiment

On a real-data CIFAR-10 residual model ($d = 256$, $G = 8$, $k = 2$, depth $= 3$), all variants reach roughly the same test accuracy — but the interference decomposition tells a very different story:

| Condition | Params | Test accuracy | Cross-expert | Intra-expert |
|---|---:|---:|---:|---:|
| Dense (FLOP-matched) | $757\text{K}$ | $89.27\%$ | — | $0.0131$ |
| Dense (memory-matched) | $1.35\text{M}$ | $89.22\%$ | — | $0.0099$ |
| MoE | $1.36\text{M}$ | $89.22\%$ | $0.0209$ | $0.0009$ |
| Full MoWE | $1.01\text{M}$ | $89.36\%$ | $0.0000$ | $0.0112$ |

MoE drives intra-expert interference very low ($0.0009$) but still has cross-expert residual interference ($0.0209$). Full MoWE has **zero** cross-expert interference by construction, with moderate intra-expert interference. Total measured interference is roughly halved.

![Full MoWE on CIFAR-10 residual blocks](/threads/mixture-of-wide-experts/fig7-fullmowe-cifar-deep.png)

*All architectures match on accuracy, but Full MoWE achieves exactly zero cross-expert interference while using fewer parameters than MoE. The interference has moved: from between experts (eliminated) to within experts (local and manageable).*
