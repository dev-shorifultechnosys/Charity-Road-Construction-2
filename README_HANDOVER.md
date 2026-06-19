# Masarat Al Khair — Premium White/Teal Charity Road Website

## Included files
- index.html
- styles.css
- script.js
- README_HANDOVER.md

## Design direction
This is a unique premium NGO-style theme inspired by clean charity website patterns, not a copy of the references.
Theme: white + deep teal + emerald + gold.

## Features
- Arabic-first with English language toggle
- Responsive and retina-ready layout
- White premium header
- Road background hero
- Floating impact statistics
- Mission section with trust values
- Project cards with progress bars
- Secure donation UI demo
- Payment method UI demo
- Demo receipt modal
- Demo CSV export
- Transparency donut chart
- Reports area
- Impact strip
- Success stories
- Volunteer CTA
- Newsletter section
- Professional footer

## Important production note
This is a static HTML/CSS/JS front-end demo. Do not process real card payments from only front-end JavaScript.

For real donations:
1. Add a backend: Laravel, WordPress, Node.js, or PHP.
2. Use Stripe, PayTabs, HyperPay, Tap Payments, or a local gateway.
3. Store secret keys on the server only.
4. Confirm payment status through gateway webhooks.
5. Generate official receipts after confirmed payment.
6. Store donation records in a secure database.

## How to deploy
Upload all files into your hosting public folder such as `public_html`.
Enable SSL.
Open the domain and test the language toggle, donation demo, receipt modal, and report export.

## Editing text
Arabic and English text use attributes:
```html
data-ar="Arabic text"
data-en="English text"
```

- assets/brand-logo.svg
