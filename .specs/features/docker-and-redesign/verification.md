# Docker and Redesign verification

**Verdict**: PASS
**Mutations**: 3 - probed C4, C5, C6
**Proofs**: `proofs.md` at the final `HEAD`
**Verifier**: manager agent (author != verifier); it wrote no feature code

## Findings

| Finding | Evidence | Fix | Closed |
| --- | --- | --- | --- |
| The glow stretched over the whole page and showed mid-page | `body` gradient over 4095px of page height | confine it to the top 600px | f148780 - C11 |
| The pink cursor was below the required contrast | 3.51:1 against the 4.5:1 in PAGE-02 AC 2 | use `--link`, now 6.5:1 | f148780 - C12 |
| The top bar did not line up with the content | brand at 88.5 against title at 72.5 at 1280px, after a first fix left it 16px off | same box model as `main`, now 72.5 and 1193 on both | cca6dfa - C11 |
| The first day heading touched the top edge after `See headlines` | heading at 0 | `scroll-margin-top`, now 24px | f148780 - C10 |
| Stopping the backend took 11s | Node as PID 1 ignored SIGTERM, measured with `docker compose stop backend` | `init: true`, now about 0.23s | 7a5443d - C19 |
