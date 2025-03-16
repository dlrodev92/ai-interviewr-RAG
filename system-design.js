document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('questions-container');
    const totalCount = document.getElementById('total-count');

    const createQuestionElement = (question, index) => {
        // Validate question object has required properties
        if (!question || !question.question || !question.system_scenario) {
            console.error('Invalid question object:', question);
            return '';
        }

        // Format discussion points
        const formatDiscussionPoints = (points) => {
            if (!Array.isArray(points)) return '';
            return points.map(point => `
                <div class="discussion-point">
                    <h4>${point.topic}</h4>
                    <p>${point.details}</p>
                </div>
            `).join('');
        };

        // Format trade-off questions
        const formatTradeOffs = (tradeOffs) => {
            if (!Array.isArray(tradeOffs)) return '';
            return tradeOffs.map(tradeOff => `
                <div class="trade-off">
                    <h4>${tradeOff.question}</h4>
                    <ul>
                        ${tradeOff.considerations.map(consideration => 
                            `<li>${consideration}</li>`
                        ).join('')}
                    </ul>
                </div>
            `).join('');
        };

        return `
            <article class="question-container" data-question-type="system-design">
                <header class="question-header" onclick="this.parentElement.classList.toggle('expanded')">
                    <h2>${index + 1} - ${question.question}</h2>
                    <span class="expand-icon">▼</span>
                </header>

                <div class="question-content">
                    <div class="scenario">
                        <h3>System Scenario:</h3>
                        <p>${question.system_scenario}</p>
                    </div>

                    <div class="discussion-points">
                        <h3>Key Discussion Points:</h3>
                        ${formatDiscussionPoints(question.expected_discussion_points)}
                    </div>

                    <div class="trade-offs">
                        <h3>Trade-off Considerations:</h3>
                        ${formatTradeOffs(question.trade_off_questions)}
                    </div>
                </div>
            </article>
        `;
    };

    // Add styles specific to system design
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

        .scenario {
            background-color: #f8f9fa;
            padding: 1.5rem;
            border-radius: 4px;
            margin: 1.5rem 0;
            border-left: 4px solid #6c757d;
        }

        .discussion-point {
            margin: 1.5rem 0;
            padding: 1rem;
            background-color: #fff;
            border-radius: 4px;
            border: 1px solid #e9ecef;
        }

        .discussion-point h4 {
            color: var(--secondary-color);
            margin-bottom: 0.5rem;
        }

        .trade-off {
            margin: 1.5rem 0;
            padding: 1rem;
            background-color: #fff;
            border-radius: 4px;
            border: 1px solid #e9ecef;
        }

        .trade-off h4 {
            color: var(--secondary-color);
            margin-bottom: 1rem;
        }

        .trade-off ul {
            list-style-type: disc;
            padding-left: 1.5rem;
        }

        .trade-off li {
            margin-bottom: 0.5rem;
            line-height: 1.5;
        }

        h3 {
            color: var(--primary-color);
            margin: 2rem 0 1rem 0;
        }
    `;
    document.head.appendChild(style);

    // Helper function to validate data
    const isValidData = (data) => {
        return data && Array.isArray(data) && data.length > 0;
    };

    // Fetch and render the data
    fetch('system_design_questions.json')
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