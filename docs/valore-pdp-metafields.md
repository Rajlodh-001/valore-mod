# Valore PDP metafields (`valore_pdp`)

Unique tag for related theme code: **`pdp-min-extras`**.

These product metafields power the optional editorial strip and feature panel on the product template. Sections auto-hide when values are empty.

## Create definitions (Admin)

**Settings → Custom data → Products → Add definition** for each row.

| Namespace   | Key                      | Type                      | Name (Admin)              |
|-------------|--------------------------|---------------------------|---------------------------|
| `valore_pdp` | `editorial_image_1`     | File (Image)              | PDP Editorial image 1     |
| `valore_pdp` | `editorial_image_2`     | File (Image)              | PDP Editorial image 2     |
| `valore_pdp` | `editorial_image_3`     | File (Image)              | PDP Editorial image 3     |
| `valore_pdp` | `editorial_caption`     | Single line text          | PDP Editorial caption     |
| `valore_pdp` | `feature_image`         | File (Image)              | PDP Feature image         |
| `valore_pdp` | `feature_heading`       | Single line text          | PDP Feature heading       |
| `valore_pdp` | `feature_text`          | Multi-line text           | PDP Feature text          |
| `valore_pdp` | `feature_image_position`| Single line text          | PDP Feature image position (`left` or `right`) |
| `valore_pdp` | `callout_text`          | Single line text          | Gallery callout note (e.g. zip detail) |
| `valore_pdp` | `callout_left`          | Single line text          | Callout left position % (default `46`) |
| `valore_pdp` | `callout_top`           | Single line text          | Callout top position % (default `30`) |

Storefront access must be **Storefronts: Read**.

Repeat the same definitions on the **origin store** before deploy.

## Theme sections

| Section type                    | Theme Editor name      |
|---------------------------------|------------------------|
| `valore-pdp-editorial-strip`    | `PDP editorial strip`  |
| `valore-pdp-feature-panel`      | `PDP feature panel`    |

## Fill per product

On each product in Admin → Metafields:

1. Upload 1–3 lifestyle / detail images for the editorial strip.
2. Optionally add a short caption.
3. Upload a feature image + heading + body for the 50/50 panel.
4. Set `feature_image_position` to `left` or `right` when you want to override the section setting.

## Remove later

1. Search the theme for `pdp-min-extras` or `valore_pdp`.
2. Remove section instances whose type starts with `valore-pdp-` from `templates/product.json`.
3. Delete `sections/valore-pdp-*.liquid` and related rules in `assets/valore-pdp-minimal.css` if desired.
4. Optionally delete unused metafield definitions in Admin (products keep working without them).
