const tasks = [
    {
        id: 'task-1',
        targetId: 'target-1',
        level: 'Level 1',
        levelClass: 'level-1',
        title: '어휘 추론',
        instruction: '문맥상 "information overload"와 가장 유사한 의미를 고르세요.',
        options: [
            { text: '데이터의 부족', correct: false },
            { text: '정보의 과잉', correct: true },
            { text: '신속한 정보 처리', correct: false }
        ],
        onCorrect: () => updateTheta('vocab', 0.1),
        onWrong: () => updateTheta('vocab', -0.2)
    },
    {
        id: 'task-2',
        targetId: 'target-2',
        level: 'Level 2',
        levelClass: 'level-2',
        title: '지칭 추론',
        instruction: '대명사 "it"이 가리키는 대상을 앞 문장에서 찾아보세요. (의도적으로 오답을 선택하면 Rerouting이 발동됩니다.)',
        options: [
            { text: 'digital age', correct: false },
            { text: 'information overload', correct: false },
            { text: 'focusing on a task', correct: true }
        ],
        onCorrect: () => updateTheta('syntax', 0.1),
        onWrong: () => triggerRerouting()
    }
];

let currentTaskIndex = 0;
let theta = { vocab: 1.2, syntax: 0.8 };

function renderTask(index) {
    if (index >= tasks.length) {
        document.getElementById('task-body').innerHTML = '<p class="instruction" style="color:var(--accent-green); font-weight:600;">모든 Task를 완료했습니다!</p>';
        return;
    }

    const task = tasks[index];
    
    // Highlight target
    document.querySelectorAll('.highlight-target').forEach(el => el.classList.remove('active'));
    document.getElementById(task.targetId).classList.add('active');

    // Update UI
    document.querySelector('.task-level').className = `task-level ${task.levelClass}`;
    document.querySelector('.task-level').innerText = task.level;
    document.querySelector('.task-header h3').innerText = task.title;

    let optionsHtml = task.options.map((opt, i) => 
        `<button class="option-btn" onclick="handleAnswer(${index}, ${i}, this)">${opt.text}</button>`
    ).join('');

    document.getElementById('task-body').innerHTML = `
        <p class="instruction">${task.instruction}</p>
        <div class="options">${optionsHtml}</div>
    `;
}

function handleAnswer(taskIndex, optionIndex, btnElement) {
    const task = tasks[taskIndex];
    const isCorrect = task.options[optionIndex].correct;

    // disable all buttons
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(btn => btn.disabled = true);

    if (isCorrect) {
        btnElement.classList.add('correct');
        task.onCorrect();
        setTimeout(() => {
            currentTaskIndex++;
            renderTask(currentTaskIndex);
        }, 1500);
    } else {
        btnElement.classList.add('wrong');
        // highlight correct answer
        task.options.forEach((opt, i) => {
            if (opt.correct) buttons[i].classList.add('correct');
        });
        task.onWrong();
    }
}

function updateTheta(type, amount) {
    theta[type] = parseFloat((theta[type] + amount).toFixed(2));
    const el = document.getElementById(`theta-${type}`);
    el.innerText = `θ: ${theta[type]}`;
    el.style.color = amount > 0 ? 'var(--accent-green)' : 'var(--accent-red)';
    setTimeout(() => el.style.color = '', 1500);
}

function triggerRerouting() {
    updateTheta('syntax', -0.5);
    setTimeout(() => {
        const modal = document.getElementById('reroute-modal');
        modal.classList.add('show');
        
        // Update knowledge map visual
        const node = document.getElementById('reroute-node');
        node.classList.remove('locked');
        node.classList.add('unlocked');
    }, 1500);
}

function acceptReroute() {
    closeModal();
    alert("D2 기초 훈련 지문으로 이동합니다. (시뮬레이션 완료)");
}

function closeModal() {
    document.getElementById('reroute-modal').classList.remove('show');
    currentTaskIndex++;
    renderTask(currentTaskIndex);
}

// Init
setTimeout(() => renderTask(0), 1000);
