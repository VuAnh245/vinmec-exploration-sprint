"""Gọi model theo prompt PR02. Dùng chung cho giao diện Streamlit và bản mô phỏng điện thoại."""

import json
import os
import re
from pathlib import Path

from openai import OpenAI

import search

ROOT = Path(__file__).resolve().parents[2]
PROMPT_FILE = Path(__file__).resolve().parent.parent / "prompts" / "PR02-tim-va-dan-nguon-v1.md"
DEFAULT_MODEL = "gpt-4o-mini"


def load_env_file(path: Path = ROOT / ".env") -> None:
    """Nạp biến từ file .env ở gốc repo nếu có; không ghi đè biến đã đặt (kể cả đặt rỗng để tắt)."""
    if not path.exists():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        match = re.match(r"^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$", line)
        if match and match.group(1) not in os.environ:
            os.environ[match.group(1)] = match.group(2).strip().strip('"').strip("'")


def load_prompts() -> tuple[str, str]:
    """Khối text đầu là system prompt, khối sau là user prompt template."""
    blocks = re.findall(r"```text\n(.*?)```", PROMPT_FILE.read_text(encoding="utf-8"), re.S)
    return blocks[0].strip(), blocks[1].strip()


def ask(query: str, row: dict | None, corpus: dict[str, dict],
        api_key: str | None, model: str | None = None) -> dict | None:
    """Trả về dict thô từ model; None khi chưa có API key."""
    if not api_key:
        return None
    system_prompt, user_template = load_prompts()
    user_prompt = (user_template
                   .replace("{kho}", json.dumps(search.corpus_for_prompt(corpus), ensure_ascii=False))
                   .replace("{dong_phieu}", json.dumps(row, ensure_ascii=False) if row else "")
                   .replace("{cau_hoi}", query))
    response = OpenAI(api_key=api_key).chat.completions.create(
        model=model or DEFAULT_MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        response_format={"type": "json_object"},
    )
    return json.loads(response.choices[0].message.content)
