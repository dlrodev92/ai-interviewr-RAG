document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('questions-container');
    const totalCount = document.getElementById('total-count');

    const createTranscriptionElement = (transcription, index) => {
        // Validate transcription object has required properties
        if (!transcription || !transcription.transcript || !transcription.evaluation) {
            console.error('Invalid transcription object:', transcription);
            return '';
        }

        // Format conversation
        const formatConversation = (transcript) => {
            if (!Array.isArray(transcript)) return '';
            return transcript.map(entry => {
                const speaker = Object.keys(entry)[0];
                const text = entry[speaker];
                return `
                    <div class="conversation-entry ${speaker.toLowerCase()}">
                        <strong class="speaker">${speaker}:</strong>
                        <p class="dialogue">${text}</p>
                    </div>
                `;
            }).join('');
        };

        // Format improvements
        const formatImprovements = (improvements) => {
            if (!Array.isArray(improvements)) return '';
            return improvements.map(improvement => `
                <li>${improvement}</li>
            `).join('');
        };

        return `
            <article class="transcription-container" data-transcription-index="${index + 1}">
                <header class="transcription-header" onclick="this.parentElement.classList.toggle('expanded')">
                    <h2>Interview Transcription ${index + 1}</h2>
                    <span class="expand-icon">▼</span>
                </header>

                <div class="transcription-content">
                    <div class="conversation">
                        <h3>Conversation:</h3>
                        <div class="conversation-flow">
                            ${formatConversation(transcription.transcript)}
                        </div>
                    </div>

                    <div class="evaluation">
                        <h3>Evaluation:</h3>
                        <dl>
                            <dt>Clarity</dt>
                            <dd>${transcription.evaluation.clarity}</dd>
                            
                            <dt>Confidence</dt>
                            <dd>${transcription.evaluation.confidence}</dd>
                            
                            <dt>Structure</dt>
                            <dd>${transcription.evaluation.structure}</dd>
                        </dl>
                    </div>

                    <div class="improvements">
                        <h3>Suggested Improvements:</h3>
                        <ul>
                            ${formatImprovements(transcription.suggested_improvements)}
                        </ul>
                    </div>
                </div>
            </article>
        `;
    };

    // Add styles specific to transcriptions
    const style = document.createElement('style');
    style.textContent = `
        .transcription-container {
            background-color: var(--card-background);
            border-radius: 8px;
            margin-bottom: 1rem;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            border-left: 4px solid var(--secondary-color);
            overflow: hidden;
        }

        .transcription-header {
            padding: 1.5rem 2rem;
            background-color: var(--card-background);
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
            transition: background-color 0.3s ease;
        }

        .transcription-header:hover {
            background-color: #f8f9fa;
        }

        .transcription-header h2 {
            margin: 0;
            font-size: 1.25rem;
        }

        .expand-icon {
            color: var(--secondary-color);
            transition: transform 0.3s ease;
        }

        .transcription-content {
            max-height: 0;
            opacity: 0;
            overflow: hidden;
            transition: all 0.3s ease-in-out;
            padding: 0 2rem;
        }

        .transcription-container.expanded .transcription-content {
            max-height: 2000px;
            opacity: 1;
            padding: 1.5rem 2rem;
        }

        .transcription-container.expanded .expand-icon {
            transform: rotate(180deg);
        }

        .conversation-flow {
            margin: 1.5rem 0;
            padding: 1rem;
            background-color: #f8f9fa;
            border-radius: 4px;
        }

        .conversation-entry {
            margin-bottom: 1rem;
            padding: 0.5rem 1rem;
            border-radius: 4px;
        }

        .interviewer {
            background-color: #e3f2fd;
        }

        .candidate {
            background-color: #f5f5f5;
            margin-left: 2rem;
        }

        .speaker {
            color: var(--secondary-color);
            display: block;
            margin-bottom: 0.25rem;
        }

        .dialogue {
            margin: 0;
            line-height: 1.5;
        }

        .evaluation {
            margin: 2rem 0;
            padding: 1.5rem;
            background-color: #fff;
            border-radius: 4px;
            border: 1px solid #e9ecef;
        }

        .evaluation dl {
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 1rem;
            align-items: baseline;
        }

        .evaluation dt {
            font-weight: bold;
            color: var(--secondary-color);
        }

        .evaluation dd {
            margin: 0;
        }

        .improvements {
            margin-top: 2rem;
        }

        .improvements ul {
            list-style-type: disc;
            padding-left: 1.5rem;
        }

        .improvements li {
            margin-bottom: 0.5rem;
            line-height: 1.5;
        }

        h3 {
            color: var(--primary-color);
            margin: 1.5rem 0 1rem 0;
        }
    `;
    document.head.appendChild(style);

    // Helper function to validate data
    const isValidData = (data) => {
        return data && Array.isArray(data) && data.length > 0;
    };

    // Fetch and render the data
    fetch('transcription-feedback.json')
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
                .map((transcription, index) => createTranscriptionElement(transcription, index))
                .filter(Boolean)
                .join('');
            totalCount.textContent = data.length;
            if (!container.innerHTML) {
                throw new Error('No valid transcriptions to display');
            }
        })
        .catch(error => {
            console.error('Error loading transcriptions:', error);
            container.innerHTML = `
                <div class="error-message">
                    <h2>Error loading transcriptions</h2>
                    <p>Please try again later. If the problem persists, contact support.</p>
                    <p class="error-details">${error.message}</p>
                </div>
            `;
        });
}); 