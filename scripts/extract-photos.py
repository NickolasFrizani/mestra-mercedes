"""
Extract base64 photos from MestraMercedes.jsx and replace with file paths.

Uso:
  python extract-photos.py

Saída:
  - public/photos/photo1.jpg  (Mercedes terapeuta energetica)
  - public/photos/photo2.jpg  (Mercedes com cartas de taro e radiestesia)
  - MestraMercedes.refactored.jsx (sem base64, com src=/photos/...)
  - MestraMercedes.jsx (original mantido como backup)
"""
import os
import re
import base64
import sys

sys.stdout.reconfigure(encoding='utf-8')

REPO = r'C:\Users\Parker\mestra-mercedes'
JSX_SOURCE = os.path.join(REPO, 'MestraMercedes.jsx')
JSX_OUTPUT = os.path.join(REPO, 'MestraMercedes.refactored.jsx')
PHOTOS_DIR = os.path.join(REPO, 'public', 'photos')

os.makedirs(PHOTOS_DIR, exist_ok=True)

with open(JSX_SOURCE, 'r', encoding='utf-8') as f:
    content = f.read()

print(f'JSX carregado: {len(content):,} chars', flush=True)

# Regex para encontrar: const PHOTO1 = "data:image/jpeg;base64,XXXX"
pattern = re.compile(
    r'const\s+(PHOTO\w+)\s*=\s*"data:image/(\w+);base64,([A-Za-z0-9+/=]+)"\s*;',
    re.MULTILINE
)

photos = list(pattern.finditer(content))
print(f'Fotos base64 encontradas: {len(photos)}', flush=True)

# Extrair cada uma
saved = {}
for m in photos:
    var_name = m.group(1)              # ex: PHOTO1
    ext = m.group(2)                   # ex: jpeg
    b64 = m.group(3)                   # base64 string

    # Normalizar extensão
    ext_normalized = 'jpg' if ext.lower() == 'jpeg' else ext.lower()

    photo_n = var_name.replace('PHOTO', '')
    filename = f'photo{photo_n}.{ext_normalized}'
    out_path = os.path.join(PHOTOS_DIR, filename)

    binary = base64.b64decode(b64)
    with open(out_path, 'wb') as f:
        f.write(binary)

    saved[var_name] = f'/photos/{filename}'
    size_kb = round(len(binary) / 1024, 1)
    print(f'  {var_name} -> {filename} ({size_kb} KB)', flush=True)

# Remover as definições const PHOTO1 = "..." do JSX
new_content = pattern.sub('', content)

# Remover linhas em branco extras criadas
new_content = re.sub(r'\n\n\n+', '\n\n', new_content)

# Substituir {PHOTON} por path
# Usado como: src={PHOTO1}  → src="/photos/photo1.jpg"
for var, path in saved.items():
    # src={PHOTO1} → src="/photos/photo1.jpg"
    new_content = new_content.replace(f'src={{{var}}}', f'src="{path}"')
    # Outras formas defensivas
    new_content = new_content.replace(f'={{{var}}}', f'="{path}"')

with open(JSX_OUTPUT, 'w', encoding='utf-8') as f:
    f.write(new_content)

# Stats
old_size = len(content)
new_size = len(new_content)
saved_kb = round((old_size - new_size) / 1024, 1)

print(flush=True)
print(f'Tamanho original: {round(old_size/1024,1)} KB', flush=True)
print(f'Tamanho refatorado: {round(new_size/1024,1)} KB', flush=True)
print(f'Reducao: {saved_kb} KB ({round(100*(old_size-new_size)/old_size,1)}%)', flush=True)
print(flush=True)
print(f'Output: {JSX_OUTPUT}', flush=True)
print(f'Fotos salvas em: {PHOTOS_DIR}', flush=True)
