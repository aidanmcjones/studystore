"""Render the Binder platform downloads list (site.json `qbank.downloads`).

Platform is stated only here: an entry with `available: false` renders nothing,
so a Windows build can be added later by filling its entry and flipping the flag.
"""
import html


def available(q):
    return [d for d in q.get("downloads", []) if d.get("available")]


def requirements(q):
    items = "".join(
        f'<li><b>{html.escape(d["platform"])}.</b> {html.escape(d["requires"])} '
        f'The download file is <code>{html.escape(d["file"])}</code>.</li>' for d in available(q))
    return f"<ul>{items}</ul>"


def buybox_items(q):
    return "".join(f'<li>{html.escape(d["platform"])}: {html.escape(d["requires_short"])}</li>' for d in available(q))


def how_to_open(q):
    ds = [d for d in available(q) if d.get("how_to_open")]
    out = []
    for d in ds:
        if len(ds) > 1:
            out.append(f'<h3>{html.escape(d["platform"])}</h3>')
        if d.get("unsigned_note"):
            out.append(f'<p>{html.escape(d["unsigned_note"])}</p>')
        out.append('<ol class="steps reveal">' + "".join(f"<li>{html.escape(s)}</li>" for s in d["how_to_open"]) + "</ol>")
    return "".join(out)


def thanks_files(q):
    return "".join(
        f'<li>Download <code>{html.escape(d["file"])}</code> ({html.escape(d["label"])}) from your order. '
        f'It needs {html.escape(d["requires_short"])}.</li>' for d in available(q))


def tokens(q):
    return {"qb_dl_requirements": requirements(q), "qb_dl_buybox": buybox_items(q),
            "qb_how_to_open": how_to_open(q), "qb_thanks_files": thanks_files(q)}
