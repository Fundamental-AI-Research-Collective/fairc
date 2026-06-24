# MoWE paper progress bundle

This folder is a website-facing snapshot of the current MoWE paper status.

Contents:

- [`paper_draft.md`](paper_draft.md) — narrative draft for a public progress post / early paper page.
- [`results_summary.md`](results_summary.md) — compact table of the current empirical evidence and caveats.
- [`figures/`](figures/) — copied result figures plus transparent-background versions for web use.
- [`figures/FIGURE_MANIFEST.md`](figures/FIGURE_MANIFEST.md) — source path for each copied figure.

Important status notes:

- LM claims should use fixed-RoPE results only. Earlier LM results with the RoPE bug are exploratory and should not be used for final CE/perplexity claims.
- The old shared-readout “MoWE” variant is now labeled half-MoWE; the main architecture is full MoWE, where experts read the full residual stream but write to disjoint residual slices.
- The current 768-dimensional stabilized FullMoWE LM run is still live. Its current CE is reported in the draft as a progress result, not a final result.

