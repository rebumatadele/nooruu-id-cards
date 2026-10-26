# Nooruu Employee ID Studio

A static, browser based generator for Nooruu employee cards. It uses the supplied Nooruu logo, company seal, and Oromia flag, with a black, white, and red top accent. The card has CR80 dimensions (85.6 × 53.98 mm), and print sheets use A4.

## Use

1. Open `index.html` locally or on GitHub Pages.
2. Enter a four-digit employee number from the roster (serial 2 becomes `0002`). Enter the employee name and job title in English, Afaan Oromo, and Amharic, then add a portrait. All three languages are required before printing.
3. Use **Review A4 preview** for the current card, or add several employees and use **Review batch A4**. The preview appears below the editor and shows every front and reverse page before printing.
4. The layout fits **8 cards per A4 sheet** in two columns and four rows, with **10 mm gaps** between cards. Each group has a front page followed by its matching reverse page.
5. Select **Print / Save PDF** below the preview. In the browser print dialog, choose **Save as PDF**, A4 paper, 100% scale, no browser headers or footers, and background graphics on.
6. For two sided production, print each front sheet with its following back sheet. Confirm alignment on a test sheet before cutting cards.

Data and portraits remain in the browser. Export JSON to keep a batch for later; the application does not store it on a server or automatically retain it after the page closes. Treat exported JSON and PDFs as sensitive employee records.

This is Nooruu staff identification. It does not issue or validate MOSIP identifiers or government identity documents.

The front watermark uses the Oromia Transport Agency logo from its official website: https://admin.ota.gov.et/logo.png (retrieved 26 October 2026). The original logo is included locally for reliable printing.
