#!/usr/bin/env python3
"""
rank.py — Redrob Intelligent Candidate Ranking Challenge
=========================================================
Usage:
    python rank.py --candidates ./candidates.jsonl --out ./submission.csv

Produce exactly 100 rows (rank 1–100), CSV format with columns:
    candidate_id, rank, score, reasoning
"""

import argparse
import csv
import json
import sys
from datetime import datetime, date
from pathlib import Path

# ─────────────────────────────────────────────────────────────────────────────
# Configuration
# ─────────────────────────────────────────────────────────────────────────────

REFERENCE_DATE = date(2026, 6, 23)

# Companies that are consulting/services (entire career there = disqualifier per JD)
CONSULTING_COMPANIES = {
    "tcs", "infosys", "wipro", "accenture", "cognizant", "capgemini",
    "hcl", "mphasis", "hexaware", "mindtree", "tech mahindra",
    "l&t infotech", "ltimindtree", "syntel", "igate",
}

# Skills that are "must-have" for the JD
MUST_HAVE_SKILLS = {
    # Embeddings-based retrieval
    "sentence-transformers", "sentence transformers", "openai embeddings",
    "bge", "e5", "embeddings", "dense retrieval", "semantic search",
    "embedding", "vector embeddings",
    # Vector databases / hybrid search
    "pinecone", "weaviate", "qdrant", "milvus", "faiss", "opensearch",
    "elasticsearch", "chroma", "vespa", "pgvector",
    # Core IR/ranking
    "information retrieval", "learning to rank", "ltr", "ndcg", "mrr",
    "bm25", "hybrid search", "hybrid retrieval", "ranking", "retrieval",
    "reranking", "re-ranking",
    # NLP / ML
    "nlp", "natural language processing", "transformers", "bert",
    "rag", "retrieval augmented generation",
    # Must-have fundamentals
    "python",
}

# Nice-to-have skills
NICE_SKILLS = {
    "lora", "qlora", "peft", "fine-tuning", "fine tuning", "finetuning",
    "xgboost", "lightgbm", "learning to rank", "recommendation system",
    "recommendation engine", "collaborative filtering",
    "distributed systems", "kafka", "spark",
    "pytorch", "tensorflow", "huggingface", "hugging face",
    "a/b testing", "ab testing", "experimentation",
}

# Career keywords indicating applied ML/AI experience in retrieval/search/recommendation
HIGH_VALUE_CAREER_KEYWORDS = [
    "recommendation", "recommender", "search", "retrieval", "ranking",
    "embedding", "vector", "rag", "semantic", "information retrieval",
    "nlp", "natural language", "language model", "llm", "bert", "transformer",
    "learning to rank", "dense retrieval", "sparse retrieval", "hybrid search",
    "candidate matching", "job matching", "talent intelligence",
    "personalization", "content-based filtering", "collaborative filtering",
    "a/b test", "experiment", "ndcg", "mrr", "precision@", "recall@",
    "offline evaluation", "online evaluation",
    "shipped", "deployed", "production", "scaled", "scale",
]

PRODUCT_COMPANY_INDICATORS = [
    "saas", "product", "startup", "series", "founded", "platform",
    "marketplace", "app", "software company", "tech company",
]

# Titles that signal strong ML/AI relevance
HIGH_VALUE_TITLES = [
    "ml engineer", "machine learning engineer", "ai engineer",
    "search engineer", "nlp engineer", "data scientist",
    "applied scientist", "research engineer", "senior engineer",
    "staff engineer", "principal engineer", "tech lead",
    "software engineer", "backend engineer",
    "applied ml", "applied ai", "recommendation engineer",
    "ranking engineer", "retrieval engineer",
]

# Titles that signal clear mismatch
LOW_VALUE_TITLES = [
    "marketing manager", "operations manager", "hr manager",
    "accountant", "customer support", "sales manager", "content writer",
    "business development", "supply chain", "finance manager",
    "ui/ux designer", "graphic designer", "product designer",
    "seo specialist", "social media", "procurement",
    "civil engineer", "mechanical engineer", "electrical engineer",
    "receptionist", "data entry",
]

# Preferred locations
LOCATION_SCORES = {
    "noida": 1.0, "pune": 1.0,
    "delhi": 0.9, "gurgaon": 0.9, "gurugram": 0.9, "ncr": 0.9,
    "bengaluru": 0.85, "bangalore": 0.85,
    "hyderabad": 0.8, "mumbai": 0.8, "chennai": 0.75,
    "kolkata": 0.65,
}


# ─────────────────────────────────────────────────────────────────────────────
# Honeypot Detection
# ─────────────────────────────────────────────────────────────────────────────

def is_honeypot(c: dict) -> tuple[bool, str]:
    """
    Returns (True, reason) if candidate looks like a honeypot, else (False, "").
    Checks: impossible duration_months, expert proficiency with 0 duration_months,
    excessive expert skills.
    """
    career = c.get("career_history", [])

    # Check 1: Impossible job durations (date math contradicts duration_months)
    for job in career:
        start_str = job.get("start_date")
        end_str = job.get("end_date")
        stated = job.get("duration_months", 0)
        if not start_str:
            continue
        try:
            start_dt = datetime.strptime(start_str, "%Y-%m-%d").date()
            if end_str:
                end_dt = datetime.strptime(end_str, "%Y-%m-%d").date()
            else:
                end_dt = REFERENCE_DATE
            actual_months = (end_dt.year - start_dt.year) * 12 + (end_dt.month - start_dt.month)
            # More than 4-month discrepancy → honeypot
            if abs(actual_months - stated) > 4:
                return True, f"impossible job duration: stated={stated}mo actual={actual_months}mo"
        except ValueError:
            pass

    # Check 2: Expert skills with 0 duration_months (listed but never actually used)
    expert_zero = [s["name"] for s in c.get("skills", [])
                   if s.get("proficiency") == "expert" and s.get("duration_months", 0) == 0]
    if len(expert_zero) >= 2:
        return True, f"expert proficiency with 0 duration: {expert_zero[:3]}"

    # Check 3: Excessive number of expert skills (>8 is suspicious)
    expert_count = sum(1 for s in c.get("skills", []) if s.get("proficiency") == "expert")
    if expert_count >= 8:
        return True, f"too many expert skills: {expert_count}"

    # Check 4: years_of_experience dramatically exceeds actual career span
    yoe = c["profile"].get("years_of_experience", 0)
    if career:
        earliest_str = min((j["start_date"] for j in career if j.get("start_date")), default=None)
        if earliest_str:
            try:
                earliest = datetime.strptime(earliest_str, "%Y-%m-%d").date()
                actual_yoe = (REFERENCE_DATE - earliest).days / 365.25
                if yoe > actual_yoe + 4:
                    return True, f"yoe mismatch: stated={yoe} actual={actual_yoe:.1f}"
            except ValueError:
                pass

    return False, ""


# ─────────────────────────────────────────────────────────────────────────────
# Scoring helpers
# ─────────────────────────────────────────────────────────────────────────────

def normalize(val: float, lo: float, hi: float) -> float:
    if hi <= lo:
        return 0.0
    return max(0.0, min(1.0, (val - lo) / (hi - lo)))


def skills_score(candidate: dict) -> tuple[float, list[str], list[str]]:
    """Returns (score 0-1, matched_must_have, matched_nice)."""
    skills_lower = {}
    for s in candidate.get("skills", []):
        name = s["name"].lower()
        proficiency = s.get("proficiency", "beginner")
        duration = s.get("duration_months", 0)
        endorsements = s.get("endorsements", 0)
        prof_weight = {"beginner": 0.3, "intermediate": 0.6, "advanced": 0.85, "expert": 1.0}.get(proficiency, 0.3)
        # Duration trust: 0 months → 0.1x, 12 months → 0.6x, 36+ months → 1.0x
        dur_trust = min(1.0, 0.1 + (duration / 36.0) * 0.9)
        skills_lower[name] = prof_weight * dur_trust

    must_matched = []
    nice_matched = []

    must_score = 0.0
    for kw in MUST_HAVE_SKILLS:
        kw_l = kw.lower()
        for sn, sw in skills_lower.items():
            if kw_l in sn or sn in kw_l:
                must_score += sw
                must_matched.append(kw)
                break

    nice_score = 0.0
    for kw in NICE_SKILLS:
        kw_l = kw.lower()
        for sn, sw in skills_lower.items():
            if kw_l in sn or sn in kw_l:
                nice_score += sw * 0.4
                nice_matched.append(kw)
                break

    # Also check assessment scores for extra validation
    assessments = candidate.get("redrob_signals", {}).get("skill_assessment_scores", {})
    for skill_name, score_val in assessments.items():
        sn_l = skill_name.lower()
        for kw in MUST_HAVE_SKILLS:
            if kw.lower() in sn_l or sn_l in kw.lower():
                # Validated via assessment — boost
                must_score += (score_val / 100.0) * 0.5
                break

    raw = min(1.0, must_score / 4.0) * 0.7 + min(1.0, nice_score / 3.0) * 0.3
    return raw, list(set(must_matched)), list(set(nice_matched))


def career_score(candidate: dict) -> tuple[float, list[str], bool]:
    """
    Returns (score 0-1, matched_keywords, is_entirely_consulting).
    Weights:
        - Has meaningful applied ML/AI career keywords in job descriptions
        - Worked at product companies (not purely consulting)
        - JD-specific experience: search, retrieval, ranking
    """
    career = candidate.get("career_history", [])
    signals = candidate.get("redrob_signals", {})

    companies_lower = [j["company"].lower() for j in career]
    is_entirely_consulting = all(
        any(cons in comp for cons in CONSULTING_COMPANIES)
        for comp in companies_lower
    ) and len(companies_lower) > 0

    # Accumulate keyword matches across all job descriptions
    all_text = " ".join([
        j.get("description", "") + " " + j.get("title", "") + " " + j.get("company", "")
        for j in career
    ]).lower()

    kw_hits = []
    kw_score = 0.0
    for kw in HIGH_VALUE_CAREER_KEYWORDS:
        if kw.lower() in all_text:
            kw_score += 1.0
            kw_hits.append(kw)

    # Bonus if they've shipped / deployed ML at scale
    if any(w in all_text for w in ["shipped", "deployed to production", "at scale", "real users"]):
        kw_score += 2.0

    # Product company bonus
    prod_score = 0.0
    for job in career:
        is_consulting_job = any(cons in job["company"].lower() for cons in CONSULTING_COMPANIES)
        if not is_consulting_job:
            prod_score += job.get("duration_months", 0)

    product_fraction = min(1.0, prod_score / 60.0)  # normalize to 60 months

    # Title scoring
    current_title = candidate["profile"].get("current_title", "").lower()
    title_score = 0.5  # neutral
    for ht in HIGH_VALUE_TITLES:
        if ht.lower() in current_title:
            title_score = 1.0
            break
    for lt in LOW_VALUE_TITLES:
        if lt.lower() in current_title:
            title_score = 0.05
            break

    # Penalize entirely consulting backgrounds
    if is_entirely_consulting:
        product_fraction *= 0.3
        kw_score *= 0.4

    raw = (
        min(1.0, kw_score / 6.0) * 0.45 +
        product_fraction * 0.30 +
        title_score * 0.25
    )

    return min(1.0, raw), kw_hits, is_entirely_consulting


def experience_score(candidate: dict) -> float:
    """5-9 year target band. Peaks at 6-8 years."""
    yoe = candidate["profile"].get("years_of_experience", 0)
    if 5 <= yoe <= 9:
        # Peak at 6-8
        if 6 <= yoe <= 8:
            return 1.0
        elif yoe < 6:
            return 0.85
        else:
            return 0.9
    elif 4 <= yoe < 5:
        return 0.7
    elif 9 < yoe <= 12:
        return 0.7
    elif 3 <= yoe < 4:
        return 0.4
    elif yoe > 12:
        return 0.5
    else:
        return 0.15


def location_score(candidate: dict) -> float:
    """Score based on preferred locations from JD."""
    loc = candidate["profile"].get("location", "").lower()
    country = candidate["profile"].get("country", "").lower()
    willing_to_relocate = candidate.get("redrob_signals", {}).get("willing_to_relocate", False)

    if country != "india":
        if willing_to_relocate:
            return 0.2
        return 0.1

    for city, score in LOCATION_SCORES.items():
        if city in loc:
            return score

    # Generic India location not listed above
    return 0.5


def behavioral_score(candidate: dict) -> float:
    """
    Compute a behavioral multiplier (0.2 - 1.2) based on platform engagement signals.
    A perfect-on-paper candidate who is inactive gets heavily downweighted.
    """
    signals = candidate.get("redrob_signals", {})

    # Recency: how recently were they active?
    last_active_str = signals.get("last_active_date")
    recency_score = 0.0
    if last_active_str:
        try:
            last_active = datetime.strptime(last_active_str, "%Y-%m-%d").date()
            days_inactive = (REFERENCE_DATE - last_active).days
            if days_inactive <= 30:
                recency_score = 1.0
            elif days_inactive <= 90:
                recency_score = 0.8
            elif days_inactive <= 180:
                recency_score = 0.5
            elif days_inactive <= 365:
                recency_score = 0.3
            else:
                recency_score = 0.1
        except ValueError:
            recency_score = 0.3

    # Open to work
    otw = 1.0 if signals.get("open_to_work_flag", False) else 0.6

    # Recruiter response rate (0-1)
    rr = signals.get("recruiter_response_rate", 0.3)

    # Notice period: sub-30 ideal, 30-60 ok, >90 penalized, >120 heavy penalty
    notice = signals.get("notice_period_days", 60)
    if notice <= 30:
        notice_score = 1.0
    elif notice <= 60:
        notice_score = 0.85
    elif notice <= 90:
        notice_score = 0.65
    elif notice <= 120:
        notice_score = 0.45
    else:
        notice_score = 0.25

    # Interview completion rate
    icr = signals.get("interview_completion_rate", 0.5)

    # GitHub activity (-1 means no github, 0-100 otherwise)
    gh = signals.get("github_activity_score", -1)
    gh_score = 0.5 if gh == -1 else (gh / 100.0)

    # Profile completeness
    completeness = signals.get("profile_completeness_score", 50) / 100.0

    behavioral = (
        recency_score * 0.30 +
        otw * 0.15 +
        rr * 0.15 +
        notice_score * 0.15 +
        icr * 0.10 +
        gh_score * 0.10 +
        completeness * 0.05
    )
    return behavioral


# ─────────────────────────────────────────────────────────────────────────────
# Composite Score
# ─────────────────────────────────────────────────────────────────────────────

def composite_score(candidate: dict) -> dict:
    """
    Compute a composite score and return a dict with all sub-scores for reasoning.
    """
    sk_score, must_matched, nice_matched = skills_score(candidate)
    ca_score, kw_hits, is_consulting = career_score(candidate)
    ex_score = experience_score(candidate)
    lo_score = location_score(candidate)
    bh_score = behavioral_score(candidate)

    # Weighted sum
    raw = (
        sk_score * 0.30 +
        ca_score * 0.35 +
        ex_score * 0.15 +
        lo_score * 0.10 +
        bh_score * 0.10
    )

    # Hard penalties
    # If entirely consulting company background — significant penalty
    if is_consulting:
        raw *= 0.5

    # If title is clearly non-tech (marketing, ops, etc.) — severe penalty
    current_title = candidate["profile"].get("current_title", "").lower()
    for lt in LOW_VALUE_TITLES:
        if lt.lower() in current_title:
            raw *= 0.25
            break

    # Cap at 1.0
    raw = min(1.0, max(0.0, raw))

    return {
        "score": raw,
        "skills_score": sk_score,
        "career_score": ca_score,
        "experience_score": ex_score,
        "location_score": lo_score,
        "behavioral_score": bh_score,
        "must_matched": must_matched,
        "nice_matched": nice_matched,
        "career_kws": kw_hits,
        "is_consulting": is_consulting,
    }


# ─────────────────────────────────────────────────────────────────────────────
# Reasoning Generation
# ─────────────────────────────────────────────────────────────────────────────

def generate_reasoning(candidate: dict, scores: dict, rank: int) -> str:
    """
    Generate a unique, factual, non-templated 1-2 sentence reasoning string
    that references specific candidate details and JD requirements.
    """
    profile = candidate["profile"]
    signals = candidate.get("redrob_signals", {})
    career = candidate.get("career_history", [])
    skills = candidate.get("skills", [])

    name = profile.get("anonymized_name", "Candidate")
    yoe = profile.get("years_of_experience", 0)
    title = profile.get("current_title", "Unknown")
    company = profile.get("current_company", "")
    loc = profile.get("location", "")
    country = profile.get("country", "")

    must_matched = scores.get("must_matched", [])
    career_kws = scores.get("career_kws", [])
    is_consulting = scores.get("is_consulting", False)

    # Behavioral highlights
    notice = signals.get("notice_period_days", 60)
    last_active = signals.get("last_active_date", "")
    gh = signals.get("github_activity_score", -1)
    otw = signals.get("open_to_work_flag", False)
    rr = signals.get("recruiter_response_rate", 0)
    icr = signals.get("interview_completion_rate", 0)

    # Most important matched skills for readability
    top_skills = must_matched[:3]
    if not top_skills:
        top_skills = [s["name"] for s in skills if s.get("proficiency") in ("advanced", "expert")][:3]

    # Compute recency
    recency_note = ""
    if last_active:
        try:
            la = datetime.strptime(last_active, "%Y-%m-%d").date()
            days = (REFERENCE_DATE - la).days
            if days <= 30:
                recency_note = "active within last 30 days"
            elif days <= 90:
                recency_note = f"active {days} days ago"
            elif days <= 180:
                recency_note = "last active ~{:.0f} months ago".format(days / 30)
            else:
                recency_note = f"inactive for {days//30} months"
        except ValueError:
            pass

    # Positive sentence construction
    skill_str = ", ".join(top_skills) if top_skills else "relevant ML/AI skills"

    # Career evidence
    career_evidence = []
    for kw in ["search", "retrieval", "ranking", "recommendation", "embedding", "vector"]:
        if kw in [k.lower() for k in career_kws]:
            career_evidence.append(kw)

    sentences = []

    # Sentence 1: profile strength
    if scores["score"] >= 0.6:
        if career_evidence:
            s1 = (f"{yoe:.1f}-year {title} with demonstrated experience in "
                  f"{', '.join(career_evidence[:2])} systems")
        else:
            s1 = (f"{yoe:.1f}-year {title} at {company} with relevant skills in {skill_str}")
    elif scores["score"] >= 0.35:
        s1 = (f"{yoe:.1f}-year {title} with partial match to JD requirements "
              f"({'skills include ' + skill_str if top_skills else 'limited retrieval/ranking evidence'})")
    else:
        s1 = (f"{yoe:.1f}-year {title} — below JD bar on core requirements "
              f"({'purely consulting background' if is_consulting else 'limited applied ML evidence'})")

    sentences.append(s1)

    # Sentence 2: behavioral/logistics
    concerns = []
    positives = []

    if notice > 90:
        concerns.append(f"{notice}-day notice period")
    elif notice <= 30:
        positives.append("sub-30-day notice")

    if recency_note:
        if "inactive" in recency_note or "months ago" in recency_note:
            concerns.append(recency_note)
        else:
            positives.append(recency_note)

    if gh >= 60:
        positives.append(f"strong GitHub activity ({gh:.0f}/100)")
    elif gh == -1:
        concerns.append("no GitHub linked")

    if rr < 0.2:
        concerns.append(f"low recruiter response rate ({rr:.0%})")

    if country.lower() != "india":
        concerns.append(f"based in {country} (relocation/visa needed)")

    if positives and concerns:
        s2 = f"Positives: {'; '.join(positives)}. Concerns: {'; '.join(concerns)}."
    elif positives:
        s2 = f"Strong engagement signals: {'; '.join(positives)}."
    elif concerns:
        s2 = f"Concerns: {'; '.join(concerns)}."
    else:
        s2 = f"Profile completeness {signals.get('profile_completeness_score', 0):.0f}%, interview completion {icr:.0%}."

    sentences.append(s2)

    return " ".join(sentences)


# ─────────────────────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Redrob Candidate Ranker")
    parser.add_argument("--candidates", required=True, help="Path to candidates.jsonl")
    parser.add_argument("--out", default="submission.csv", help="Output CSV path")
    args = parser.parse_args()

    candidates_path = Path(args.candidates)
    if not candidates_path.exists():
        print(f"ERROR: candidates file not found: {candidates_path}", file=sys.stderr)
        sys.exit(1)

    print(f"Loading candidates from {candidates_path} ...", flush=True)
    total = 0
    honeypots_skipped = 0
    scored = []

    with open(candidates_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            total += 1
            c = json.loads(line)

            # Filter honeypots
            hp, hp_reason = is_honeypot(c)
            if hp:
                honeypots_skipped += 1
                continue

            # Compute composite score
            scores = composite_score(c)
            scored.append((c, scores))

    print(f"Loaded {total} candidates, skipped {honeypots_skipped} honeypots, scoring {len(scored)} candidates.", flush=True)

    # Sort descending by score, then by candidate_id ascending for ties
    scored.sort(key=lambda x: (-x[1]["score"], x[0]["candidate_id"]))

    # Take top 100
    top_100 = scored[:100]

    # Build output rows
    rows = []
    for rank_idx, (c, scores) in enumerate(top_100):
        rank = rank_idx + 1
        cid = c["candidate_id"]
        score = scores["score"]
        reasoning = generate_reasoning(c, scores, rank)
        rows.append({
            "candidate_id": cid,
            "rank": rank,
            "score": round(score, 6),
            "reasoning": reasoning,
        })

    # Write CSV
    out_path = Path(args.out)
    with open(out_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["candidate_id", "rank", "score", "reasoning"])
        writer.writeheader()
        for row in rows:
            writer.writerow(row)

    print(f"\nSubmission written to {out_path}")
    print(f"Top 5 candidates:")
    for row in rows[:5]:
        print(f"  Rank {row['rank']}: {row['candidate_id']} | score={row['score']:.4f}")
        print(f"    {row['reasoning']}")


if __name__ == "__main__":
    main()
