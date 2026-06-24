---
title: What Averaging Destroys
date: 2026-06-14
---

To understand *why* averaging behaves this way, we trained linear probes on top of averaged embeddings and measured how well linguistic structure survives compression. Two tasks from CoNLL-2003: **POS tagging** (syntactic structure) and **NER** (lexical/semantic structure).

## Syntax degrades fast, semantics is robust

| Task | $k = 1$ | $k = 2$ | $k = 4$ | Random control |
|---|---:|---:|---:|---:|
| POS tagging (accuracy) | $0.750$ | $0.574$ | $0.383$ | $0.735$ |
| NER (accuracy) | $0.848$ | $0.816$ | $0.796$ | $0.805$ |

POS accuracy falls from $0.750$ to $0.383$ as $k$ grows, dropping **below** the random-embedding control by $k = 4$. Word-order- and position-sensitive structure is largely washed out by averaging — unsurprising, since pooling neighbours discards exactly the local ordering that POS depends on.

NER barely moves ($0.848 \to 0.796$) and stays above the random control even at $k = 4$. Entity identity is carried by *which* words are present more than by their precise order, so it survives pooling.

![Linear probe results — POS tagging vs NER across k values](/threads/token-deep-memory/fig5-linear-probe-results.png)

*POS accuracy (left) collapses with averaging while NER accuracy (right) is robust. The pattern is consistent across both accuracy and macro-F1.*

## The mechanistic match

This maps cleanly onto the compute results:

- Averaged representations keep enough **"what is being talked about"** (semantic signal) to support language modelling cheaply
- They sacrifice **"exact local arrangement"** (syntactic signal) — which is part of why aggressive $k$ eventually hurts

The per-class breakdowns confirm the degradation is concentrated in categories that most depend on local context, while entity-level categories are preserved.

![Per-class NER F1 across k values](/threads/token-deep-memory/fig6-ner-per-class.png)

*Per-class NER F1. The dominant "O" (non-entity) class is nearly unaffected, while entity categories degrade modestly and uniformly — no single entity type is disproportionately harmed.*

This tells us where the ceiling is: token averaging works until the task demands fine-grained syntactic structure that averaging has erased.
