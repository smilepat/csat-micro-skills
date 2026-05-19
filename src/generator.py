import json
import os
from models import TaskSet, MicroTask, TaskOption
from prompts import SYSTEM_PROMPT, USER_PROMPT_TEMPLATE

def generate_tasks_mock(passage_text: str) -> TaskSet:
    # LLM API 호출을 시뮬레이션 (PDCA - Check 단계를 위한 Mock)
    print("Mock LLM API 호출 중...")
    
    mock_tasks = [
        MicroTask(
            task_id="task_001",
            task_type="lexical",
            instruction="밑줄 친 'capital'의 문맥상 알맞은 뜻을 고르세요.",
            target_text="capital",
            options=[
                TaskOption(id="opt1", text="수도", is_correct=False),
                TaskOption(id="opt2", text="자본", is_correct=True),
                TaskOption(id="opt3", text="대문자", is_correct=False)
            ],
            explanation="'financial resources'라는 문맥과 결합되므로 '자본'이 적절합니다."
        ),
        MicroTask(
            task_id="task_002",
            task_type="syntactic",
            instruction="다음 문장에서 주절의 주어(Main Subject)를 찾으세요.",
            target_text="The individuals who have studied this field for decades",
            options=[
                TaskOption(id="opt1", text="The individuals", is_correct=True),
                TaskOption(id="opt2", text="this field", is_correct=False)
            ],
            explanation="'who have studied~'는 수식어구이며, 본동사 앞의 The individuals가 주어입니다."
        )
    ]
    
    return TaskSet(passage_id="sample_01", tasks=mock_tasks)

if __name__ == "__main__":
    sample_text = "This is a sample passage where financial capital is discussed. The individuals who have studied this field for decades understand its importance."
    result = generate_tasks_mock(sample_text)
    
    # 결과 확인 (Check)
    print("\n--- 생성된 Task JSON ---")
    print(result.model_dump_json(indent=2))
