---
title: Why RL Fails — and Why Soft Beats Hard
date: 2026-06-22
---

## The reinforcement-learning framing is structurally degenerate

Sequential pruning — "decide neuron by neuron" — invites a reinforcement-learning treatment, and we tested it thoroughly: REINFORCE, PPO, actor-critic, Bernoulli policies, entropy and chunk-size variants. Every variant **matched or lost** to the differentiable hypernetwork.

![BiLSTM vs REINFORCE comparison at 80% pruning target](/threads/learned-efficiency-pruning/fig5-rl-vs-lep.png)

*Best-case RL (actor-critic) sits at $4.71 \pm 1.55$ pp drop versus LEP's $3.68 \pm 0.79$ pp at $\sim80\%$ pruned, with far higher variance.*

This is not a tuning failure — it is structural. On a **frozen** model, the per-step reward telescopes, so the episode return depends only on the final set of kept neurons, not the order they were chosen. The pruning MDP therefore has a **path-independent return**: it is static subset selection wearing a sequential costume.

A problem with path-independent return has no credit-assignment structure for RL to exploit, so a direct differentiable optimizer provably dominates. The one regime where this doesn't hold is pruning **during** training, when the weights co-adapt to each masking decision and the return stops telescoping — which is exactly where we point future work.

## Soft global penalty beats hard budget

A natural "knob-free" alternative to $\lambda$ is a hard top-$K$ budget with an STE. We implemented it carefully and found it **brittle and structurally weaker**: even fully debugged, it reaches only $\sim35\%$ pruned at iso-accuracy versus LEP's $\sim76\%$ — roughly $2.6\times$ worse.

The reason is general: a hard budget with a centered STE gives gradient only to the few neurons sitting near the moving threshold (boundary-local), whereas the soft $\lambda$ penalty keeps every neuron's gate in the active band and optimizes the **whole subset jointly** (global gradient). Removing a hyperparameter by switching to a hard constraint trades a sweep for both a stability-guardrail stack and a worse optimizer. Sweep-free is not the same as better.

## $\lambda$ is well-behaved and predictable

$\lambda$ is the one knob, and its optimum is well-behaved. Across three base networks spanning $165\times$ in size and two datasets, the efficiency-optimal $\lambda$ stays in a narrow $[0.03, 0.06]$ band — it is **not** monotonic in model size.

![Pruning efficiency vs lambda across five networks spanning MNIST and CIFAR](/threads/learned-efficiency-pruning/fig6-efficiency-vs-lambda.png)

*Pruning efficiency vs $\lambda$ for LeNet ($63\text{K}$), MNIST MLP ($1.86\text{M}$), and a large CIFAR net ($10.4\text{M}$). $\lambda_{\text{opt}}$ stays in $[0.03, 0.06]$ throughout; a candidate regularity $\lambda_{\text{opt}} \cdot N_{\text{layers}} \approx 0.10$ fits all three points and is cheap to falsify.*
