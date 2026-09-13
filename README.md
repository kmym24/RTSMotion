# RTSMotion

**RTSMotion** (Real-Time Speech-driven Motion synthesis) synthesizes co-speech full-body motion — SMPL-X body pose plus FLAME facial expression — from a live speech stream, with **zero lookahead** and **no transcript**.

- **Project page (videos):** https://kmym24.github.io/RTSMotion/
- **Paper:** *RTSMotion: a Real-Time Speech-driven Motion Synthesis Method for CG Avatar-mediated Communication*, ICASSP 2027 submission (under review)

## Status

This repository currently contains the project page only. The training and inference code will be released here upon acceptance.

## Overview

Given a stream of speech audio, RTSMotion autoregressively synthesizes gesture and facial motion one step at a time (133 ms of audio → 4 motion frames), without ever referencing future audio or a transcript. Temporal modeling uses Mamba, whose causal recurrence keeps a constant-size state, so the computation at each step does not grow with the sequence length.

Since the correlation with speech differs substantially across regions, motion is split into four regions, each tokenized independently with a residual vector quantized VAE (RVQ-VAE):

| Region | Dim |
|---|---|
| Upper body | 78 |
| Hands | 180 |
| Lower body | 57 |
| Face | 106 |

Training is organized into three phases:

1. **RVQ-VAE motion tokenizer** — learns discrete per-region motion tokens with a self-supervised reconstruction objective, using an asymmetric design: a bidirectional encoder for tokenization (training only) and a causal decoder for streaming synthesis.
2. **Audio encoder pretraining** — pretrains a causal audio encoder against the posterior mean of a frozen full-body motion VAE, with speech-onset prediction as an auxiliary task.
3. **Autoregressive motion prediction** — predicts per-region codebook indices with per-region Mamba blocks, fused across regions by Region Attention (RA), which attends over the four regions' states from the previous step so causality holds without a temporal mask.

Key design constraints:

- **Zero lookahead** — every module is causal; inference never references future frames of the input audio.
- **No transcript** — avoids the latency of streaming ASR and the propagation of recognition errors.
- **Latency** — the paper reports a synthesis latency of approximately 160 ms: 133 ms of audio required for one step plus 27 ms of inference (RTF 0.20 on a single NVIDIA GeForce RTX 3090). This covers the synthesis process only; transmission and rendering latency of a complete CG avatar system are not included.

## Evaluation

The model is trained and evaluated on [BEAT2](https://huggingface.co/datasets/H-Liu1997/BEAT2) (26.85 hours of 16 kHz speech and 30 fps motion from 25 English speakers), following the data split provided with the dataset. Objective evaluation uses FGD, Beat Constancy, L1 Diversity, and Facial-MSE over 249 test samples from 23 speakers, plus Real Time Factor (RTF) for inference latency. A subjective evaluation was run on Prolific, rating Naturalness, Smoothness, and Speech-Gesture Synchrony against GT, GestureLSM, and Miburi (n=45 after attention-check exclusion).

See the paper for the full protocol and results.

## Project page

The project page lives at the repository root and is served by GitHub Pages:

```
index.html            # the page
project_page/
├── css/style.css
├── js/main.js
├── img/overview.png  # Figure 1 of the paper
└── videos/           # five user-study clips, four conditions each
```

Motion on the page is rendered with the SMPL-X body model, which is licensed for **non-commercial research use only**. Per-asset credits and licenses (BEAT2, SMPL-X, GestureLSM, Miburi) are listed at the bottom of the page.

## Citation

The paper is under review. Citation information will be added here once it is available.
