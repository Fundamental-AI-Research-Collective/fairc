---
title: Toy and Vision Results
date: 2026-06-19
---

## Toy sparse-feature tasks

The cleanest test is synthetic sparse data with clustered features. Inputs contain groups of co-occurring features; the model must reconstruct them with limited active neurons. MoWE discovers the cluster structure directly from reconstruction pressure alone — no explicit cluster labels.

When within-cluster correlation is high ($p_{\text{within}} = 1.0$), routing matrices become nearly diagonal: one model group specializes to one data cluster.

![MoWE routing alignment across within-cluster correlation levels](/threads/mixture-of-wide-experts/fig1-toy-routing-alignment.png)

*Routing alignment at $N = 200$, $G = 20$. As within-cluster correlation increases from $0.6$ to $1.0$, routing matrices sharpen toward diagonal structure — each expert learns to own one data cluster.*

At medium scale ($N = 200$), MoWE reaches target accuracy with fewer active neurons than MoE when the data has real co-occurrence structure for the router to exploit.

![MoWE vs MoE accuracy at matched active neurons](/threads/mixture-of-wide-experts/fig2-toy-accuracy-advantage.png)

*MoWE vs MoE accuracy. When cluster structure exists, MoWE exploits it to achieve the same accuracy with fewer active neurons.*

## CIFAR-10: domain and class specialization

On an augmented 4-domain CIFAR-10 setup — color, grayscale, rotated $12°$, Gaussian-blurred — routing became domain-sensitive without explicit domain labels. In a $G = 4$, $k = 1$ model, the rotated domain strongly avoided one group: Group 2 received only $3.9\%$ of rotated examples versus $25\%$ under uniform routing.

![Per-domain routing fractions on CIFAR-10](/threads/mixture-of-wide-experts/fig3-cifar-domain-routing.png)

*Per-domain routing fractions. The rotated domain develops a strong avoidance of Group 2 — routing discovers domain structure without supervision.*

Class routing also became semantically structured. Transport classes (airplane, ship, truck) concentrated in Group 2, while animal classes (cat, dog) concentrated in Group 0.

![Per-class routing fractions on CIFAR-10](/threads/mixture-of-wide-experts/fig4-cifar-class-routing.png)

*Per-class routing fractions. Semantic categories emerge in the routing pattern: vehicles cluster in Group 2, animals in Group 0.*

## Robustness at extreme expert counts

In large-$G$ scaling with fixed active neurons, MoWE was much more robust than MoE under extreme fragmentation. MoWE held steady at $\sim47$–$48\%$ accuracy from $G = 512$ to $G = 4096$, while MoE collapsed from $35.6\%$ to $29.1\%$ over the same range.

![Top-20 most specialized experts per class at G=4096](/threads/mixture-of-wide-experts/fig5-cifar-large-g-specialisation.png)

*Per-class expert specialization at $G = 4096$, $k = 2048$. Each class develops strongly preferential routing to specific experts, well above the uniform baseline.*

The caveat is important: dense still beats shallow MoWE on absolute CIFAR accuracy. The CIFAR result supports specialization and robustness, not an unconditional accuracy win.
