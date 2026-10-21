# Nooruu Employee ID Studio

A static, browser based generator for Nooruu employee cards. It uses the supplied Nooruu logo and Oromia flag. The card has CR80 dimensions (85.6 × 53.98 mm), and print sheets use A4.

## Use

1. Open `index.html` locally or on GitHub Pages.
2. Enter a four-digit employee number from the roster (serial 2 becomes `0002`). Enter the employee name and job title in English, Afaan Oromo, and Amharic, then add a portrait. All three languages are required before printing.
3. Select **Print / Save PDF** for one employee, or add several employees and select **Print batch / PDF**.
4. In the browser print dialog, choose **Save as PDF**, A4 paper, 100% scale, no browser headers or footers, and background graphics on.
5. For two sided production, print each front sheet with its following back sheet. Confirm alignment on a test sheet before cutting cards.

Data and portraits remain in the browser. Export JSON to keep a batch for later; the application does not store it on a server or automatically retain it after the page closes. Treat exported JSON and PDFs as sensitive employee records.

This is Nooruu staff identification. It does not issue or validate MOSIP identifiers or government identity documents.
