"""Build a single HTML file for sharing or using offline."""
from pathlib import Path
import base64

root = Path(__file__).resolve().parent
html = (root / "index.html").read_text(encoding="utf-8")
css = (root / "styles.css").read_text(encoding="utf-8")
js = (root / "app.js").read_text(encoding="utf-8")

for filename, mime in (("nooruu-logo.jpg", "image/jpeg"), ("oromia-flag.webp", "image/webp")):
    data = base64.b64encode((root / "assets" / filename).read_bytes()).decode("ascii")
    uri = f"data:{mime};base64,{data}"
    html = html.replace(f"assets/{filename}", uri)
    js = js.replace(f"assets/{filename}", uri)

html = html.replace('<link rel="stylesheet" href="styles.css">', f"<style>\n{css}\n</style>")
html = html.replace('<script src="app.js"></script>', f"<script>\n{js}\n</script>")
(root / "nooruu_ota_official_bilingual_id_card_generator.html").write_text(html, encoding="utf-8")
