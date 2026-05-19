from pydantic import BaseModel, Field
from typing import List, Optional

class TaskOption(BaseModel):
    id: str
    text: str
    is_correct: bool

class MicroTask(BaseModel):
    task_id: str = Field(..., description="고유 태스크 ID")
    task_type: str = Field(..., description="태스크 유형: 'lexical', 'syntactic', 'semantic'")
    instruction: str = Field(..., description="학생에게 보여질 지시문 (예: '문맥상 아래 단어의 알맞은 뜻을 고르세요.')")
    target_text: str = Field(..., description="지문 내 대상 텍스트 (단어 또는 구문)")
    options: List[TaskOption] = Field(..., description="선택지 (일반적으로 3~4개)")
    explanation: str = Field(..., description="정답에 대한 해설")

class TaskSet(BaseModel):
    passage_id: str
    tasks: List[MicroTask]
