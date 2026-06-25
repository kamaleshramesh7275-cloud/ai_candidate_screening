import os
import glob
import re

def replace_colors(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Dark gray base instead of blue-tinted slate
    content = content.replace('slate-', 'zinc-')

    # Primary accents to Red
    content = content.replace('blue-', 'red-')
    content = content.replace('indigo-', 'rose-')
    content = content.replace('purple-', 'orange-')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    files = glob.glob('src/**/*.tsx', recursive=True)
    for file in files:
        replace_colors(file)
    print(f"Updated {len(files)} files.")
