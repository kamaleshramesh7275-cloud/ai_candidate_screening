import os
import glob
import re

def fix_invalid_colors(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace invalid Tailwind color stops
    content = content.replace('-850', '-800')
    content = content.replace('-750', '-700')
    content = content.replace('-650', '-600')
    content = content.replace('-550', '-500')
    content = content.replace('-450', '-400')
    content = content.replace('-350', '-400')
    content = content.replace('-250', '-200')
    content = content.replace('-150', '-200')
    
    # Also fix some other potentially invalid classes
    content = content.replace('-355', '-400')
    content = content.replace('zinc-105', 'zinc-100')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    files = glob.glob('src/**/*.tsx', recursive=True)
    for file in files:
        fix_invalid_colors(file)
    print(f"Fixed invalid color classes in {len(files)} files.")
