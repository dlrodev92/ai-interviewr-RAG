document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('questions-container');
    const totalCount = document.getElementById('total-count');

    const createQuestionElement = (question, index) => {
        // Validate question object has required properties
        if (!question || !question.question || !question.programming_language) {
            console.error('Invalid question object:', question);
            return '';
        }

        return `
            <article class="question-container" data-question-type="code-related" data-language="${question.programming_language}">
                <header class="question-header" onclick="this.parentElement.classList.toggle('expanded')">
                    <h2>${index + 1} - ${question.question}</h2>
                    <span class="language-tag">${question.programming_language}</span>
                    <span class="expand-icon">▼</span>
                </header>

                <div class="question-content">
                    <div class="explanation">
                        <h3>Expected Explanation:</h3>
                        <p>${question.expected_explanation || 'No explanation provided'}</p>
                    </div>

                    ${question.code_snippet ? `
                    <div class="code-block" data-language="${question.programming_language}">
                        <pre><code>${question.code_snippet}</code></pre>
                    </div>
                    ` : ''}

                    <div class="follow-up">
                        <h3>Follow-up Questions:</h3>
                        <ul>
                            ${question.follow_up_questions.map(q => `<li>${q}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </article>
        `;
    };

    // Add styles specific to code-related page
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
            flex: 1;
        }

        .language-tag {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            background-color: var(--secondary-color);
            color: white;
            border-radius: 4px;
            font-size: 0.875rem;
            margin: 0 1rem;
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

        .explanation {
            margin-bottom: 1.5rem;
        }

        .code-block {
            background-color: #1e1e1e;
            color: #d4d4d4;
            padding: 1.5rem;
            border-radius: 4px;
            overflow-x: auto;
            margin: 1rem 0;
        }

        .code-block code {
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        }

        .follow-up {
            margin-top: 1.5rem;
        }

        .follow-up ul {
            list-style-position: inside;
            padding-left: 1rem;
        }

        .follow-up li {
            margin-bottom: 0.5rem;
        }
    `;
    document.head.appendChild(style);

    // Helper function to validate data
    const isValidData = (data) => {
        return data && Array.isArray(data) && data.length > 0;
    };

    // Fetch and render the data
    fetch('code_related_questions.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!isValidData(data)) {
                throw new Error('Invalid or empty data received');
            }

            container.innerHTML = data
                .map((question, index) => createQuestionElement(question, index))
                .filter(Boolean)
                .join('');
            totalCount.textContent = data.length;
            if (!container.innerHTML) {
                throw new Error('No valid questions to display');
            }
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