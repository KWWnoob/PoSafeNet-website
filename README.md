# PoSafeNet — project website

Static project page for **PoSafeNet: Safe Learning with Poset-Structured Neural Nets**
(Kiwan Wong, Wei Xiao, Daniela Rus — NeurIPS 2026).

Plain HTML/CSS/JS. No build step and no backend. It is designed for GitHub Pages at
`https://<username>.github.io/PoSafeNet-website/`. All asset paths are relative, so the
page works under that sub-path.

```
PoSafeNet-website/
├── index.html              # the page (all text and tables)
├── .nojekyll               # serve files as-is on GitHub Pages
└── static/
    ├── css/  bulma.min.css (from the template), index.css
    ├── js/   index.js      (media slots, copy BibTeX, nav highlighting, KaTeX)
    ├── images/             # figures (see "Adding figures and videos")
    ├── videos/             # mp4 videos
    └── pdfs/               # poster.pdf
```

External resources are loaded from CDNs: Google Fonts (Inter, JetBrains Mono) and
KaTeX 0.16.11 from jsDelivr, used for the equations.

## Preview locally

```bash
cd ~/PythonWork/PoSafeNet-website
python3 -m http.server 8000
# open http://localhost:8000
```

Use a local server rather than opening the file directly. Then the Poster button can check
whether `static/pdfs/poster.pdf` exists.

## Adding figures and videos

The paper figures were converted from the PDFs in `Figures/` (kept locally, git-ignored);
the seven figures marked "Fig. N" are byte-identical to the arXiv v1 sources.

Every figure and video on the page is a *drop-in slot*. The page loads the file at the path
below. If the file does not exist yet, the page shows a dashed placeholder that names the
expected path. To fill a slot, put a file with that name in place; no HTML edits are needed.

| Slot | Expected file | Source | Status |
|---|---|---|---|
| Teaser (Overview) | `static/images/teaser.png` | Fig. 1, `Figures/teaser_v3.pdf` | ✅ added |
| Task safety posets | `static/images/task_posets.png` | Fig. 2, `Figures/Task_Hasse.pdf` | ✅ added |
| Inference time vs. batch | `static/images/batch_time.png` | Fig. 3a, `Figures/Batchtime.pdf` | ✅ added |
| Training time vs. heads | `static/images/head_time.png` | Fig. 3b, `Figures/Headtime.pdf` | ✅ added |
| 2D navigation trajectories | `static/images/exp1_traj.png` | Fig. 4, `Figures/Experiment1_traj.pdf` | ✅ added |
| Manipulator trajectories | `static/images/exp2_traj.png` | Fig. 5, `Figures/Experiment2_traj.pdf` | ✅ added |
| Driving trajectories | `static/images/exp3_traj.png` | Fig. 6, `Figures/Experiment3_traj2.pdf` | ✅ added |
| Poset → linear extensions (Method) | `static/images/linear_extensions.png` | `Figures/Linear_Extensions.pdf` (not in arXiv v1) | ✅ added |
| 2D navigation video | `static/videos/nav2d.mp4` | — | missing |
| Manipulator video | `static/videos/manipulator.mp4` | — | missing |
| VISTA rollout, Mixture | `static/videos/vista_mixture.mp4` | — | missing |
| VISTA rollout, Hard | `static/videos/vista_hard.mp4` | — | missing |
| Poster (header button) | `static/pdfs/poster.pdf` | — | missing |
| Social preview (optional) | `static/images/social_preview.png` (1200×630) | — | missing |

To convert a paper figure from PDF to PNG (poppler):

```bash
pdftoppm -png -r 200 -singlefile Figures/teaser_v3.pdf static/images/teaser
```

Tips:
- Keep each video small: H.264 MP4, a few MB.
- The videos autoplay muted and loop, so short clips work best. To re-encode a clip:
  `ffmpeg -i in.mp4 -c:v libx264 -crf 28 -preset slow -an -movflags +faststart out.mp4`
- To use a different file name, change the matching `data-src` attribute in `index.html`.

## Deploy to GitHub Pages

1. Create an empty GitHub repository named **`PoSafeNet-website`** under your account.
2. Push this folder:
   ```bash
   cd ~/PythonWork/PoSafeNet-website
   git init
   git add .
   git commit -m "PoSafeNet project page"
   git branch -M main
   git remote add origin git@github.com:<username>/PoSafeNet-website.git
   git push -u origin main
   ```
3. On GitHub, open **Settings → Pages**. Under **Build and deployment**, choose
   **Source: Deploy from a branch**, **Branch: `main`**, folder **`/ (root)`**, and save.
4. After a minute or two the site is live at `https://<username>.github.io/PoSafeNet-website/`.

After deployment, set `og:image` in `index.html` to the absolute URL of
`social_preview.png`. Social media previews require absolute image URLs.

## Content sources

All text, equations and numbers are taken from the arXiv v1 version of the paper
(arXiv:2601.22356). If the NeurIPS camera-ready version changed any results, update the
three tables in the *Experimental Results* section of `index.html`.

## License

The page layout and styles are adapted from the
[Academic Project Page Template](https://github.com/WBK-Robotics/paper_website_template)
(itself adopted from [Nerfies](https://nerfies.github.io)), licensed under
[CC BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0/). The attribution in the
page footer must be kept. Bulma is MIT-licensed.
