from pathlib import Path
import re

nav = Path(__file__).resolve().parents[1] / "public" / "desktop" / "nav"
GREEN = "#40A93D"
GREY = "#858585"


def extract_path(svg: str) -> str:
    match = re.search(r"<path[^>]*/>", svg, re.S)
    return match.group(0) if match else ""


main = (nav / "ai-main.svg").read_text(encoding="utf-8")
spark = (nav / "ai-spark.svg").read_text(encoding="utf-8")
dot = (nav / "ai-dot.svg").read_text(encoding="utf-8")

ai = f"""<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(3.75 4.75) scale(0.92)">{extract_path(main)}</g>
  <g transform="translate(1.75 1.75) scale(0.9)">{extract_path(spark)}</g>
  <g transform="translate(17.25 3.75) scale(0.9)">{extract_path(dot)}</g>
</svg>"""
(nav / "ai.svg").write_text(ai, encoding="utf-8")

settings_outer = (nav / "settings-outer.svg").read_text(encoding="utf-8")
settings = f"""<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(1.82 1.25) scale(0.95)">{extract_path(settings_outer)}</g>
  <circle cx="12" cy="12" opacity="0.5" r="3" stroke="var(--stroke-0, {GREY})" stroke-width="1.5" />
</svg>"""
(nav / "settings.svg").write_text(settings, encoding="utf-8")

logout_src = nav / "logout.svg"
if logout_src.exists():
    logout = logout_src.read_text(encoding="utf-8")
    if 'viewBox="0 0 24 24"' not in logout:
        logout = logout.replace('width="100%" height="100%"', 'width="24" height="24"')
    (nav / "logout.svg").write_text(logout, encoding="utf-8")

for name in ["home", "categories", "goals", "accounts", "ai", "settings", "logout"]:
    src = nav / f"{name}.svg"
    if not src.exists():
        continue

    content = src.read_text(encoding="utf-8")
    inactive = content.replace(GREEN, GREY)
    active = inactive.replace(GREY, GREEN)

    if name == "home":
        active = content.replace(GREY, GREEN)

    (nav / f"{name}-inactive.svg").write_text(inactive, encoding="utf-8")
    (nav / f"{name}-active.svg").write_text(active, encoding="utf-8")

print("generated", sorted(p.name for p in nav.glob("*.svg")))
