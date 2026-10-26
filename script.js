
const topics = [
    "Probability & Statistics",
    "Vectors & 3D Geometry",
    "Trigonometry & Identities",
    "Calculus & Definite Integrals",
    "Matrices & Determinants",
    "Set Theory & Functions",
    "Quadratic Equations & Algebra",
    "Permutations & Combinations",
    "Coordinate Geometry"
];

function generateMockQuestion(testId, qIndex) {
    const topic = topics[(qIndex - 1) % topics.length];
    let qText = "", options = [], correct = 0, explanation = "";

    switch (topic) {
        case "Probability & Statistics":
            const red = 3 + (qIndex % 4);
            const blue = 4 + (testId % 3);
            qText = `A bag contains ${red} red balls and ${blue} blue balls. If two balls are drawn at random without replacement, find the probability that both are red.`;
            options = [
                `\\(\\frac{${red * (red - 1)}}${(red + blue) * (red + blue - 1)}}\\)`,
                `\\(\\frac{${red}}{${red + blue}}\\)`
            ];
            correct = 0;
            explanation = `Total balls = ${red + blue}. First draw red = ${red}/${red + blue}. Second draw red = ${red - 1}/${red + blue - 1}. Multiplying gives \\(\\frac{${red * (red - 1)}}{${(red + blue) * (red + blue - 1)}}\\).`;
            break;

        case "Vectors & 3D Geometry":
            const k = (qIndex + testId) % 5 + 1;
            qText = `Find the value of \\(\\lambda\\) such that vectors \\(\\vec{a} = ${k}\\hat{i} + 2\\hat{j} + 3\\hat{k}\\) and \\(\\vec{b} = 2\\hat{i} - \\lambda\\hat{j} + \\hat{k}\\) are perpendicular.`;
            const lambdaVal = (2 * k + 3) / 2;
            options = [
                `\\(\\lambda = ${lambdaVal}\\)`,
                `\\(\\lambda = ${lambdaVal + 1}\\)`,
                `\\(\\lambda = ${lambdaVal - 2}\\)`,
                `\\(\\lambda = 0\\)`
            ];
            correct = 0;
            explanation = `For perpendicular vectors, \\(\\vec{a} \\cdot \\vec{b} = 0 \\implies (${k})(2) + (2)(-\\lambda) + (3)(1) = 0 \\implies 2\\lambda = ${2 * k + 3} \\implies \\lambda = ${lambdaVal}\\).`;
            break;

        case "Trigonometry & Identities":
            const angle = (testId + qIndex) % 2 === 0 ? "15^\\circ" : "75^\\circ";
            qText = `What is the exact value of \\(\\tan(${angle}) + \\cot(${angle})\\)?`;
            options = ["\\(4\\)", "\\(2\\)", "\\(\\sqrt{3}\\)", "\\(2\\sqrt{3}\\)"];
            correct = 0;
            explanation = `\\(\\tan(15^\\circ) + \\cot(15^\\circ) = \\frac{\\sin^2(15^\\circ) + \\cos^2(15^\\circ)}{\\sin(15^\\circ)\\cos(15^\\circ)} = \\frac{1}{\\frac{1}{2}\\sin(30^\\circ)} = \\frac{2}{1/2} = 4\\.`;
            break;

        case "Calculus & Definite Integrals":
            const power = (qIndex % 3) + 2;
            qText = `Evaluate the integral: \\(\\int_{0}^{\\pi/2} \\sin^{${power}}(x) dx\\).`;
            options = [
                power === 2 ? "\\(\\frac{\\pi}{4}\\)" : "\\(\\frac{2}{3}\\)",
                "\\(\\pi\\)",
                "\\(1\\)",
                "\\(0\\)"
            ];
            correct = 0;
            explanation = `Using Wallis' formula for definite integrals on \\([0, \\pi/2]\\), we obtain the computed reduction result.`;
            break;

        case "Matrices & Determinants":
            const detA = 2 + (testId % 4);
            qText = `If \\(A\\) is a 3\\(\\times\\)3 matrix with determinant \\(|A| = ${detA}\\), find the value of \\(|\\text{adj}(A)|\\).`;
            options = [`${detA * detA}`, `${detA}`, `${detA * 3}`, `${detA * detA * detA}`];
            correct = 0;
            explanation = `Using the determinant property \\(|\\text{adj}(A)| = |A|^{n-1}\\) for order \\(n = 3\\): \\(|\\text{adj}(A)| = (${detA})^{3-1} = ${detA * detA}\\).`;
            break;

        default:
            qText = `If \\(f(x) = x^2 - ${testId}x + ${qIndex}\\), find the derivative \\(f'(${qIndex})\\).`;
            const ans = 2 * qIndex - testId;
            options = [`${ans}`, `${ans + 2}`, `${ans - 4}`, `0`];
            correct = 0;
            explanation = `\\(f'(x) = 2x - ${testId}\\). Substituting \\(x = ${qIndex}\\) yields \\(2(${qIndex}) - ${testId} = ${ans}\\).`;
            break;
    }
    while (options.length < 4) {
        options.push(`Option ${String.fromCharCode(65 + options.length)}`);
    }

    return {
        id: qIndex,
        topic: topic,
        question: `[Q${qIndex}] ${qText}`,
        options: options,
        correct: correct,
        explanation: explanation
    };
}

const allTestsData = [];
for (let t = 1; t <= 50; t++) {
    const testQuestions = [];
    for (let q = 1; q <= 50; q++) {
        testQuestions.push(generateMockQuestion(t, q));
    }
    allTestsData.push({
        id: t,
        title: `NIMCET Mock Test ${t}`,
        questions: testQuestions
    });
}

let currentTestIndex = 0;
let currentQuestionIndex = 0;
let userAnswers = [];
let questionTimesSpent = []; 
let questionStartTime = Date.now();

let timerInterval = null;
let totalTimeLeft = 50 * 60; 
let totalDurationSpent = 0;

let userProgress = JSON.parse(localStorage.getItem("nimcet_mock_progress")) || {};

const dashboardSection = document.getElementById("dashboardSection");
const instructionsSection = document.getElementById("instructionsSection");
const testSection = document.getElementById("testSection");
const resultSection = document.getElementById("resultSection");
const reviewSection = document.getElementById("reviewSection");

const testGrid = document.getElementById("testGrid");
const instructionTestTitle = document.getElementById("instructionTestTitle");
const activeTestTitle = document.getElementById("activeTestTitle");
const timerDisplay = document.getElementById("timer");

const questionTopic = document.getElementById("questionTopic");
const questionNumber = document.getElementById("questionNumber");
const totalQuestionsSpan = document.getElementById("totalQuestions");
const questionText = document.getElementById("questionText");
const optionInputs = document.querySelectorAll('input[name="option"]');
const optionTexts = [
    document.getElementById("option0"),
    document.getElementById("option1"),
    document.getElementById("option2"),
    document.getElementById("option3")
];
const questionPalette = document.getElementById("questionPalette");

const homeLogoBtn = document.getElementById("homeLogoBtn");
const backToDashBtn = document.getElementById("backToDashBtn");
const beginTestBtn = document.getElementById("beginTestBtn");
const previousBtn = document.getElementById("previousBtn");
const nextBtn = document.getElementById("nextBtn");
const clearBtn = document.getElementById("clearBtn");
const submitBtn = document.getElementById("submitBtn");
const reviewBtn = document.getElementById("reviewBtn");
const dashboardFromScoreBtn = document.getElementById("dashboardFromScoreBtn");
const nextTestDirectBtn = document.getElementById("nextTestDirectBtn");
const homeBtn = document.getElementById("homeBtn");
const reviewNextTestBtn = document.getElementById("reviewNextTestBtn");
const resetAllBtn = document.getElementById("resetAllBtn");

const finalScoreSpan = document.getElementById("finalScore");
const correctCountSpan = document.getElementById("correctCount");
const wrongCountSpan = document.getElementById("wrongCount");
const unattemptedCountSpan = document.getElementById("unattemptedCount");
const accuracySpan = document.getElementById("accuracy");
const totalTimeSpentSpan = document.getElementById("totalTimeSpent");
const reviewContainer = document.getElementById("reviewContainer");

function renderDashboard() {
    testGrid.innerHTML = "";
    allTestsData.forEach((test, index) => {
        const isCompleted = userProgress[test.id] !== undefined;
        const score = isCompleted ? userProgress[test.id] : null;

        const card = document.createElement("div");
        card.className = `test-card ${isCompleted ? 'completed' : ''}`;
        card.innerHTML = `
            <div>
                <div class="test-card-num">Mock Test ${test.id}</div>
                <div class="test-card-score">${isCompleted ? `Highest Score: ${score} / 600` : 'Not Attempted (50 Qs)'}</div>
            </div>
            <button class="test-card-btn">${isCompleted ? 'Re-take Test' : 'Start Test'}</button>
        `;
        card.addEventListener("click", () => selectTest(index));
        testGrid.appendChild(card);
    });
}

function selectTest(index) {
    currentTestIndex = index;
    const test = allTestsData[currentTestIndex];
    instructionTestTitle.textContent = `${test.title} - Instructions`;
    hideAllSections();
    instructionsSection.classList.remove("hidden");
}

function hideAllSections() {
    dashboardSection.classList.add("hidden");
    instructionsSection.classList.add("hidden");
    testSection.classList.add("hidden");
    resultSection.classList.add("hidden");
    reviewSection.classList.add("hidden");
}

beginTestBtn.addEventListener("click", () => {
    const test = allTestsData[currentTestIndex];
    activeTestTitle.textContent = test.title;
    
    currentQuestionIndex = 0;
    userAnswers = new Array(test.questions.length).fill(null);
    questionTimesSpent = new Array(test.questions.length).fill(0);
    
    totalQuestionsSpan.textContent = test.questions.length;

    hideAllSections();
    testSection.classList.remove("hidden");

    renderPalette();
    loadQuestion(currentQuestionIndex);
    startTimer();
});

function recordTimeSpent() {
    const elapsedSeconds = Math.round((Date.now() - questionStartTime) / 1000);
    if (elapsedSeconds > 0 && currentQuestionIndex >= 0) {
        questionTimesSpent[currentQuestionIndex] += elapsedSeconds;
    }
    questionStartTime = Date.now();
}

function loadQuestion(index) {
    recordTimeSpent();
    currentQuestionIndex = index;

    const q = allTestsData[currentTestIndex].questions[index];
    questionTopic.textContent = q.topic;
    questionNumber.textContent = index + 1;
    questionText.innerHTML = q.question;

    for (let i = 0; i < 4; i++) {
        optionTexts[i].innerHTML = q.options[i];
        optionInputs[i].checked = (userAnswers[index] === i);
    }

    previousBtn.style.display = (index === 0) ? "none" : "inline-block";
    nextBtn.style.display = (index === allTestsData[currentTestIndex].questions.length - 1) ? "none" : "inline-block";

    updatePaletteState();
    triggerKaTeX();
}

function saveCurrentAnswer() {
    let selected = null;
    optionInputs.forEach((input) => {
        if (input.checked) selected = parseInt(input.value);
    });
    userAnswers[currentQuestionIndex] = selected;
    updatePaletteState();
}

previousBtn.addEventListener("click", () => {
    saveCurrentAnswer();
    if (currentQuestionIndex > 0) {
        loadQuestion(currentQuestionIndex - 1);
    }
});

nextBtn.addEventListener("click", () => {
    saveCurrentAnswer();
    if (currentQuestionIndex < allTestsData[currentTestIndex].questions.length - 1) {
        loadQuestion(currentQuestionIndex + 1);
    }
});

clearBtn.addEventListener("click", () => {
    optionInputs.forEach(input => input.checked = false);
    userAnswers[currentQuestionIndex] = null;
    updatePaletteState();
});

submitBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to submit your mock test?")) {
        recordTimeSpent();
        saveCurrentAnswer();
        finishTest();
    }
});

function renderPalette() {
    questionPalette.innerHTML = "";
    const total = allTestsData[currentTestIndex].questions.length;
    for (let i = 0; i < total; i++) {
        const btn = document.createElement("button");
        btn.className = "palette-btn unattempted";
        btn.textContent = i + 1;
        btn.addEventListener("click", () => {
            saveCurrentAnswer();
            loadQuestion(i);
        });
        questionPalette.appendChild(btn);
    }
}

function updatePaletteState() {
    const buttons = questionPalette.querySelectorAll(".palette-btn");
    buttons.forEach((btn, idx) => {
        btn.classList.remove("current", "attempted", "unattempted");
        if (idx === currentQuestionIndex) {
            btn.classList.add("current");
        }
        if (userAnswers[idx] !== null) {
            btn.classList.add("attempted");
        } else {
            btn.classList.add("unattempted");
        }
    });
}

function startTimer() {
    clearInterval(timerInterval);
    totalTimeLeft = 50 * 60; // 50 Mins
    questionStartTime = Date.now();

    timerInterval = setInterval(() => {
        if (totalTimeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Time Limit Reached! Submitting test automatically.");
            recordTimeSpent();
            saveCurrentAnswer();
            finishTest();
            return;
        }
        totalTimeLeft--;
        const mins = Math.floor(totalTimeLeft / 60);
        const secs = totalTimeLeft % 60;
        timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
}

function finishTest() {
    clearInterval(timerInterval);
    totalDurationSpent = (50 * 60) - totalTimeLeft;

    const questions = allTestsData[currentTestIndex].questions;
    let score = 0, correct = 0, wrong = 0, unattempted = 0;

    questions.forEach((q, idx) => {
        const ans = userAnswers[idx];
        if (ans === null) {
            unattempted++;
        } else if (ans === q.correct) {
            correct++;
            score += 12;
        } else {
            wrong++;
            score -= 3;
        }
    });

    const testId = allTestsData[currentTestIndex].id;
    userProgress[testId] = Math.max(score, userProgress[testId] || -600);
    localStorage.setItem("nimcet_mock_progress", JSON.stringify(userProgress));
  
    const attempted = correct + wrong;
    const accuracy = attempted > 0 ? ((correct / attempted) * 100).toFixed(1) : 0;
    const spentMins = Math.floor(totalDurationSpent / 60);
    const spentSecs = totalDurationSpent % 60;

    finalScoreSpan.textContent = score;
    correctCountSpan.textContent = correct;
    wrongCountSpan.textContent = wrong;
    unattemptedCountSpan.textContent = unattempted;
    accuracySpan.textContent = `${accuracy}%`;
    totalTimeSpentSpan.textContent = `${spentMins}m ${spentSecs}s`;

    hideAllSections();
    resultSection.classList.remove("hidden");
}

reviewBtn.addEventListener("click", () => {
    hideAllSections();
    reviewSection.classList.remove("hidden");
    buildReviewCards();
});

function buildReviewCards() {
    reviewContainer.innerHTML = "";
    const questions = allTestsData[currentTestIndex].questions;

    questions.forEach((q, idx) => {
        const userAns = userAnswers[idx];
        const timeSpent = questionTimesSpent[idx] || 0;
        let statusClass = "unattempted";
        let statusText = "Unattempted (0 Marks)";

        if (userAns !== null) {
            if (userAns === q.correct) {
                statusClass = "correct";
                statusText = "Correct (+12 Marks)";
            } else {
                statusClass = "wrong";
                statusText = "Incorrect (-3 Marks)";
            }
        }

        const card = document.createElement("div");
        card.className = `review-card ${statusClass}`;
        card.innerHTML = `
            <div class="review-card-meta">
                <span class="topic-pill">${q.topic}</span>
                <span class="time-tag">⏱ Time Spent: ${timeSpent} seconds</span>
            </div>
            <p class="review-question"><strong>Q${idx + 1}:</strong> ${q.question}</p>
            <p class="review-ans"><strong>Your Choice:</strong> ${userAns !== null ? q.options[userAns] : '<em>None</em>'}</p>
            <p class="review-ans"><strong>Correct Answer:</strong> ${q.options[q.correct]}</p>
            <p class="review-ans"><strong>Result Status:</strong> ${statusText}</p>
            <div class="review-explanation">
                <strong>Step-by-Step Solution:</strong><br>${q.explanation}
            </div>
        `;
        reviewContainer.appendChild(card);
    });

    triggerKaTeX();
}

function proceedToNextTest() {
    if (currentTestIndex < allTestsData.length - 1) {
        selectTest(currentTestIndex + 1);
    } else {
        alert("You have reached the end of the 50-Mock Test series!");
    }
}

nextTestDirectBtn.addEventListener("click", proceedToNextTest);
reviewNextTestBtn.addEventListener("click", proceedToNextTest);

homeLogoBtn.addEventListener("click", () => { hideAllSections(); dashboardSection.classList.remove("hidden"); renderDashboard(); });
backToDashBtn.addEventListener("click", () => { hideAllSections(); dashboardSection.classList.remove("hidden"); renderDashboard(); });
dashboardFromScoreBtn.addEventListener("click", () => { hideAllSections(); dashboardSection.classList.remove("hidden"); renderDashboard(); });
homeBtn.addEventListener("click", () => { hideAllSections(); dashboardSection.classList.remove("hidden"); renderDashboard(); });

resetAllBtn.addEventListener("click", () => {
    if (confirm("Reset all test scores and progress saved on this device?")) {
        localStorage.removeItem("nimcet_mock_progress");
        userProgress = {};
        renderDashboard();
    }
});

function triggerKaTeX() {
    if (window.renderMathInElement) {
        renderMathInElement(document.body, {
            delimiters: [
                {left: "$$", right: "$$", display: true},
                {left: "\\(", right: "\\)", display: false},
                {left: "$", right: "$", display: false}
            ]
        });
    }
}
renderDashboard();

