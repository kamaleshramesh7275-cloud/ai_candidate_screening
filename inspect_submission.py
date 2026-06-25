import csv

with open('submission.csv', 'r', encoding='utf-8') as f:
    rows = list(csv.DictReader(f))

print('=== TOP 10 ===')
for row in rows[:10]:
    rank = row['rank']
    cid = row['candidate_id']
    score = float(row['score'])
    reasoning = row['reasoning']
    print(f'Rank {rank:>3}: {cid} | score={score:.4f}')
    print(f'         {reasoning}')
    print()

print('=== SCORE DISTRIBUTION ===')
scores = [float(r['score']) for r in rows]
print(f'  Rank 1   score: {scores[0]:.4f}')
print(f'  Rank 10  score: {scores[9]:.4f}')
print(f'  Rank 25  score: {scores[24]:.4f}')
print(f'  Rank 50  score: {scores[49]:.4f}')
print(f'  Rank 75  score: {scores[74]:.4f}')
print(f'  Rank 100 score: {scores[99]:.4f}')
is_mono = all(scores[i] >= scores[i+1] for i in range(len(scores)-1))
print(f'  Scores monotonically non-increasing: {is_mono}')
print(f'  Total rows: {len(rows)}')
