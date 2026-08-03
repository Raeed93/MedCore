import sys, os, glob, PyPDF2

paths = []
for arg in sys.argv[1:]:
    if os.path.isdir(arg):
        paths += sorted(glob.glob(os.path.join(arg, "*.pdf")))
    else:
        paths += sorted(glob.glob(arg)) or [arg]

if not paths:
    sys.exit("No PDFs found")

for path in paths:
    with open(path, 'rb') as f:
        r = PyPDF2.PdfReader(f)
        t = ''.join((p.extract_text() or '') for p in r.pages)
    bad = t.count('\ufffd')
    print(f"{os.path.basename(path)}: {len(r.pages)}p, {len(t)} chars, "
          f"broken glyphs: {bad} -> {'REJECT' if bad else 'OK'}")
    if len(t) < 500:
        print("  WARNING: almost no text — likely scanned")
