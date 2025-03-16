document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('questions-container');
    const totalCount = document.getElementById('total-count');

    const createQuestionElement = (question, index) => {
        // Validate question object has required properties
        if (!question || !question.question_type || !question.programming_language) {
            console.error('Invalid question object:', question);
            return '';
        }

        // Format code with proper semantic tags
        const formatCode = (snippet, language) => {
            if (!snippet) return '';
            return `
                <div class="code-block" data-language="${language}">
                    <pre><code class="language-${language.toLowerCase()}" data-question-type="${question.question_type}">
${snippet.trim()}
                    </code></pre>
                </div>
            `;
        };

        return `
            <article class="question-container" data-question-type="${question.question_type}" data-language="${question.programming_language}">
                <header class="question-header" onclick="this.parentElement.classList.toggle('expanded')">
                    <h2>${index + 1} - ${question.question}</h2>
                    <span class="language-tag">${question.programming_language}</span>
                    <span class="expand-icon">▼</span>
                </header>

                <div class="question-content">
                    ${formatCode(question.code_snippet, question.programming_language)}

                    <div class="explanation">
                        <h3>Expected Explanation:</h3>
                        <p>${question.expected_explanation}</p>
                    </div>

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

    // Add styles specific to code snippets
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

        .code-block {
            background-color: #1e1e1e;
            color: #d4d4d4;
            border-radius: 4px;
            overflow: hidden;
            margin: 1.5rem 0;
            border: 1px solid #333;
        }

        .code-block pre {
            margin: 0;
            padding: 1.5rem;
            overflow-x: auto;
            background-color: #1e1e1e;
        }

        .code-block code {
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            white-space: pre;
            display: block;
            color: #d4d4d4;
            line-height: 1.5;
            font-size: 0.9rem;
        }

        .explanation {
            margin: 1.5rem 0;
            padding: 1rem;
            background-color: #f8f9fa;
            border-radius: 4px;
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

        /* Syntax highlighting classes */
        .language-javascript .keyword { color: #569cd6; }
        .language-javascript .string { color: #ce9178; }
        .language-javascript .comment { color: #6a9955; }
        .language-javascript .function { color: #dcdcaa; }
        .language-python .keyword { color: #569cd6; }
        .language-python .string { color: #ce9178; }
        .language-python .comment { color: #6a9955; }
        .language-python .function { color: #dcdcaa; }
    `;
    document.head.appendChild(style);

    // Helper function to validate data
    const isValidData = (data) => {
        return data && Array.isArray(data) && data.length > 0;
    };

    // Fetch and render the data
    fetch('code_snippets.json')
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