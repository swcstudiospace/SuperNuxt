SuperNuxt has one logo. The favicon, the header, the docs, the landing page, and the files written by the scaffolder all use the same emerald mark.

## The mark

The mark is an emerald ribbon monogram: a folded S that ends in a forward chevron. The color is `#009567` on white. The vector file is `public/brand/mark.svg`. `public/favicon.svg` is that same file. Do not draw a second symbol for social images, slides, or the installer.

The wordmark sits to the right of the mark. "Super" is `#10231c`. "Nuxt" is the same emerald as the mark. `BrandLockup` is the only component that pairs them. Pass `size` for the mark in pixels. Pass `:word="false"` when the name is already visible beside it.

## Color

| Token   | Value     | Use                               |
| ------- | --------- | --------------------------------- |
| White   | `#ffffff` | Page background and cards         |
| Emerald | `#009567` | Mark, links, primary buttons      |
| Ink     | `#10231c` | Text                              |
| Mist    | `#f3faf6` | Sidebar hover and code background |
| Line    | `#d7ebe3` | Borders                           |

The interface is light. Emerald is the only brand color. Status chips may use a clay red for hold and ascent states in the studio. Those are data colors, not a second logo.

## In an app

The layer serves `/brand/mark.svg` and `/favicon.svg`. A scaffolded app also gets a copy of the favicon so the tab icon matches before the layer assets load. If you replace the favicon, replace the mark as well and keep the two files identical.
