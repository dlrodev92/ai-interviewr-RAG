document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('questions-container');
    const totalCount = document.getElementById('total-count');

  

    const createQuestionElement = (question, index) => {
        if (!question || !question.question || !question.expected_star_response) {
            console.error('Invalid question object:', question);
            return '';
        }

        return `
            <article class="question-container" data-question-type="behavioral">
                <header class="question-header" onclick="this.parentElement.classList.toggle('expanded')">
                    <h2>${index + 1} - ${question.question}</h2>
                    <span class="expand-icon">▼</span>
                </header>

                <div class="question-content">
                    <div class="star-response">
                        <h3>Expected STAR Response:</h3>
                        <dl>
                            <dt>Situation</dt>
                            <dd>${question.expected_star_response.situation}</dd>
                            
                            <dt>Task</dt>
                            <dd>${question.expected_star_response.task}</dd>
                            
                            <dt>Action</dt>
                            <dd>${question.expected_star_response.action}</dd>
                            
                            <dt>Result</dt>
                            <dd>${question.expected_star_response.result}</dd>
                        </dl>
                    </div>
                    
                    <div class="follow-up">
                        <h3>Follow-up Questions:</h3>
                        <ul>
                            ${question.follow_up_questions.map(q => `<li>${q}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="metadata">
                        <p>Interview Type: <span>${question.interview_type}</span></p>
                        <p>Job Role: <span>${question.job_role}</span></p>
                        <p>Core Skills Assessed: <span>${question.core_skill_assessed.join(', ')}</span></p>
                        <p>Difficulty Level: <span>${question.difficulty_level}</span></p>
                    </div>
                </div>
            </article>
        `;
    };

    // Add expandable styles
    const style = document.createElement('style');
    style.textContent = `
        .question-container {
            background-color: var(--card-background);
            border-radius: 8px;
            margin-bottom: 1rem;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            border-left: 4px solid var(--secondary-color);
            overflow: hidden;
        }

        .question-header {
            padding: 1.5rem 2rem;
            background-color: var(--card-background);
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
            transition: background-color 0.3s ease;
        }

        .question-header:hover {
            background-color: #f8f9fa;
        }

        .question-header h2 {
            margin: 0;
            font-size: 1.25rem;
        }

        .expand-icon {
            color: var(--secondary-color);
            transition: transform 0.3s ease;
        }

        .question-content {
            max-height: 0;
            opacity: 0;
            overflow: hidden;
            transition: all 0.3s ease-in-out;
            padding: 0 2rem;
        }

        .question-container.expanded .question-content {
            max-height: 2000px;
            opacity: 1;
            padding: 1.5rem 2rem;
        }

        .question-container.expanded .expand-icon {
            transform: rotate(180deg);
        }

        .star-response {
            margin: 1.5rem 0;
            padding: 1.5rem;
            background-color: #f8f9fa;
            border-radius: 4px;
        }

        .follow-up {
            margin-top: 1.5rem;
        }

        .metadata {
            margin-top: 1.5rem;
            padding-top: 1rem;
            border-top: 1px solid #eee;
        }
    `;
    document.head.appendChild(style);

    // Fetch and render data
    fetch('behavioral.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            container.innerHTML = data
                .map((question, index) => createQuestionElement(question, index))
                .filter(Boolean)
                .join('');
            totalCount.textContent = data.length;
        })
        .catch(error => {
            console.error('Error loading questions:', error);
            container.innerHTML = `
                <div class="error-message">
                    <h2>Error loading questions</h2>
                    <p>Please try again later. If the problem persists, contact support.</p>
                    <p class="error-details">${error.message}</p>
                </div>
            `;
        });
}); 