/*----------FETCH DI DOMANDE ------------------*/
document.addEventListener('DOMContentLoaded', function () {
    const bottomRightButton = document.querySelector('.bottom-right-button');
    const numQuestionsInput = document.getElementById('num-questions-input');
    const circleContainer = document.querySelector('.circle-container');

    let currentQuestionIndex = 0;
    let questions = [];
    let correctAnswers = 0;
    let wrongAnswers = 0;

    bottomRightButton.addEventListener('click', async function() {
        const numQuestionsValue = numQuestionsInput.value;

        if (!isValidNumber(numQuestionsValue)) {
            alert('Inserisci un numero valido compreso tra 10 e 50');
            return;
        }

        questions = await fetchQuestions(numQuestionsValue);
        displayQuestion(currentQuestionIndex);
    });

    async function fetchQuestions(numQuestions) {
        try {
            const response = await fetch(`https://opentdb.com/api.php?amount=${numQuestions}&category=18&difficulty=easy`);
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Errore nel caricamento delle domande:', error);
            return [];
        }
    }

    function displayQuestion(index) {
        const currentQuestion = questions[index];
        const questionElement = document.createElement('div');
        questionElement.classList.add('question');
        questionElement.innerHTML = `
            <h2>${index + 1}. ${currentQuestion.question}</h2>
        `;

        const answersElement = document.createElement('div');
        answersElement.classList.add('answers');

        const allAnswers = shuffleArray(currentQuestion.incorrect_answers.concat(currentQuestion.correct_answer));
        allAnswers.forEach((answer) => {
            const button = document.createElement('button');
            button.textContent = answer;
            button.classList.add('answer-btn'); // Aggiungi la classe 'answer-btn' ai bottoni delle risposte
            button.addEventListener('click', () => {
                if (answer === currentQuestion.correct_answer) {
                    correctAnswers++;
                } else {
                    wrongAnswers++;
                    button.style.borderColor = 'red';
                    navigator.vibrate(200); // Vibrazione di 200ms
                }
                currentQuestionIndex++;
                if (currentQuestionIndex < questions.length) {
                    displayQuestion(currentQuestionIndex);
                } else {
                    alert(`Hai completato tutte le domande!\nRisposte corrette: ${correctAnswers}\nRisposte sbagliate: ${wrongAnswers}`);
                }
            });
            answersElement.appendChild(button);
        });

        questionElement.appendChild(answersElement);
        document.querySelector('.container').innerHTML = ''; // Rimuove le domande precedenti
        document.querySelector('.container').appendChild(questionElement);
    }

    function isValidNumber(value) {
        const parsedValue = parseInt(value);
        return !isNaN(parsedValue) && parsedValue >= 10 && parsedValue <= 50;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }


    /*CREA I CERCHETTI PER FEEDBACK GIUSTE-SBGALITE*/
    bottomRightButton.addEventListener('click', async function() {
        const numQuestionsValue = numQuestionsInput.value;

        if (!isValidNumber(numQuestionsValue)) {
            alert('Inserisci un numero valido compreso tra 10 e 50');
            return;
        }

        // Rimuovi eventuali cerchi precedenti
        circleContainer.innerHTML = '';

        // Aggiungi i cerchi al container
        addCircles(circleContainer, numQuestionsValue);
    });

    function addCircles(container, numCircles) {
        for (let i = 0; i < numCircles; i++) {
            const circleDiv = document.createElement('div');
            circleDiv.classList.add('circle');
            container.appendChild(circleDiv);
        }
    }

    function isValidNumber(value) {
        const parsedValue = parseInt(value);
        return !isNaN(parsedValue) && parsedValue >= 10 && parsedValue <= 50;
    }
});

