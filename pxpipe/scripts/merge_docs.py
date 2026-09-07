import os

docs_dir = 'docs - Copy'
output_file = os.path.join('pxpipe', 'docs_merged.md')

file_list = []
for root, dirs, files in os.walk(docs_dir):
    dirs.sort()
    for f in sorted(files):
        rel_path = os.path.relpath(os.path.join(root, f), docs_dir).replace('\\', '/')
        file_list.append((rel_path, os.path.join(root, f)))

# Order: README.md first, then sorted domain directories
file_list.sort(key=lambda x: (0 if x[0] == 'README.md' else 1, x[0]))

print(f"Found {len(file_list)} files to merge.")

with open(output_file, 'w', encoding='utf-8') as out_f:
    out_f.write('# MahaSkills — Complete Merged Documentation\n\n')
    out_f.write('> Merged documentation compiled from `docs - Copy` across all 11 architectural domains.\n\n')
    out_f.write('## Table of Contents\n\n')
    for rel_path, _ in file_list:
        anchor = rel_path.lower().replace('/', '-').replace('.', '-').replace(' ', '-')
        out_f.write(f'- [{rel_path}](#{anchor})\n')
    out_f.write('\n---\n\n')

    for rel_path, full_path in file_list:
        anchor = rel_path.lower().replace('/', '-').replace('.', '-').replace(' ', '-')
        out_f.write(f'<a id="{anchor}"></a>\n\n')
        out_f.write('<!-- ======================================================== -->\n')
        out_f.write(f'<!-- FILE: {rel_path} -->\n')
        out_f.write('<!-- ======================================================== -->\n\n')
        with open(full_path, 'r', encoding='utf-8', errors='ignore') as in_f:
            content = in_f.read()
            out_f.write(content)
        out_f.write('\n\n---\n\n')

print(f"Successfully generated {output_file} ({os.path.getsize(output_file)} bytes).")
