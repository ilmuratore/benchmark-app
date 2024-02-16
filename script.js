// script che avvia il benchmark dando conferma ai termini
let question = [];
document.querySelector('.btn').addEventListener('click', async function() {  
    let checkbox = document.getElementById('confermaPulsante');
    if (checkbox.checked) {
        document.getElementById('welcomePage').style.display = 'none';
        document.getElementById('benchmark').style.display = 'block';
        question = await fetchQuestions(10);
        startQuiz();
    } else {
        alert("Devi accettare i termini prima di procedere.");
    }
});

//fetch che aggiunge le domande 

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
// logica quiz app //

const questionElement = document.querySelector('.question');
const answerButtons = document.querySelector('.answer');
const nextButton = document.querySelector('.next-btn');
let timerId;
let currentQuestionIndex = 0;
let score = 0; 


// funzione di avvio del quiz
function startQuiz(){  
    currentQuestionIndex = 0 ;
    score = 0;
    nextButton.innerHTML= "Next";
    showQuestion();
}
// funzione di inserimento domande dell'array nel DOM //
function showQuestion(){
    resetState();
    resetTimer();
    let currentQuestion = question[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;    
    let answer = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
    answers = answer.sort(() => Math.random() - 0.5);
    answers.forEach(answer => {
        const button = document.createElement("button")
        button.innerHTML = answer;
        button.classList.add("answer-btn");
        answerButtons.appendChild(button);
        if(answer === currentQuestion.correct_answer){
            button.dataset.correct = true;}
        button.addEventListener("click", function(e){
        const activeBtns = document.querySelectorAll('.answer-btn');
        activeBtns.forEach(a => a.classList.remove('checked'));
        button.classList.add('checked');    
        selectAnswer(e);
        });
        clearTimeout(timerId);
      timerId = setTimeout(() => {
      handleNextButton();}, 30000);
      })};

//funzione che resetta i button  delle precedenti domande e risposte  
function resetState(){
    let questionElement = document.querySelector('.question');
    let answerButtons = document.querySelector('.answer');
    nextButton.style.display = "none";
    while(answerButtons.firstChild){
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

// funzione che permette la selezione delle risposte, che permette il proseguo delle domande con timer statico impostato a 30 secondi.
let lastAnswer;
function selectAnswer(e){
  const selectedBtn = e.target;
  lastAnswer = selectedBtn;
  [...answerButtons.children].forEach(button =>{ 
    button.disabled = false;
  });
  nextButton.style.display = "block";
}
function handleNextButton(){
  clearTimeout(timerId);
  resetTimer();
  if(lastAnswer && lastAnswer.dataset.correct === "true"){
    score++;
  }
  currentQuestionIndex++;
  if(currentQuestionIndex < question.length){
    showQuestion();
  }else {showResult();
  }
  lastAnswer = null;
}

nextButton.addEventListener("click",()=>{
  
  if(currentQuestionIndex < question.length){
        handleNextButton();
    }else{
        startQuiz();
    }
});

// mostra pagina di score finale// 
function showResult(){
      document.getElementById("benchmark").style.display = "none";
      document.getElementById("resultsPage").style.display = "block";
}

// funzione che resetta il timer ad ogni domanda 

function resetTimer() {
  clearInterval(timerInterval); 
  timePassed = 0;
  timeLeft = TIME_LIMIT;
  document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
  setCircleDasharray();
  remainingPathColor = COLOR_CODES.info.color;
  document.getElementById("base-timer-path-remaining").classList.remove(COLOR_CODES.alert.color, COLOR_CODES.warning.color);
  document.getElementById("base-timer-path-remaining").classList.add(COLOR_CODES.info.color);
  startTimer();
}

//funzione che gestisce il timer a livello grafico  

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};

const TIME_LIMIT = 30;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

document.getElementById("app").innerHTML = ` 
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
    timeLeft
  )}</span>
</div>
`;


function onTimesUp() {
  clearInterval(timerInterval);
}

function startTimer() {
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    document.getElementById("base-timer-label").innerHTML = formatTime(
      timeLeft
    );
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft === 0) {
      onTimesUp();
    }
  }, 1000);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  }
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}

// GRAFICO CIAMBELLA DI DOAMANDE

// Fine script Result
// RISULTATO ESITO ESAME
let YourPercentage = 50;

let promosso = 60;
// GRAFICO CIAMBELLA

let graficoCiambella = document.querySelector('.circle'),
  centro = document.querySelector('.main');

let votoDiPartenza = 0, // parte da 0 mi riempie il 25 percento
  votoPercentualeFinale = 20,
  speed = 5;

let progress = setInterval(() => { // funzione a intervalli specificati da speed
  votoDiPartenza++;

  graficoCiambella.style.background = `conic-gradient(#00FFFF ${YourPercentage * 3.6}deg, #D20094 0deg)`

  if (votoDiPartenza === votoPercentualeFinale) {
    clearInterval(progress); // una volta raggiunta la poszione a scelta
  }
}, speed);


let resultElement = document.getElementById('result');

if (YourPercentage >= promosso) resultElement.textContent = "You passed the exam";
else resultElement.textContent = "You did not pass the exam";

// RISULTATO ESITO h3 CPNGRATULAZOIONI
let congrat = document.getElementById('complimenti');
if (YourPercentage >= promosso) congrat.textContent = "Congratulation!";
else congrat.textContent = "We are so sorry";


// CERTIFICATO
let certificato = document.getElementById('certificato');
if (YourPercentage >= promosso) certificato.textContent = " We'll send the certificate in few minutes. Check your email (inclouding promotions/span  floder)";
else certificato.textContent = "Niente Certificato per te bro";


// RISULTATO ESITO DOMANDE GIUSTE/SBAGLIATE SULLE TOTALI
const correctQuestions = 23;
const totQuestion = 50;
const correct_Questions = document.getElementById("correct-question");

correct_Questions.textContent = `${correctQuestions}/${totQuestion} questions`;
correct_Questions.style.display = "block";

const wrongQuestions = 14;
const wrong_Questions = document.getElementById("wrong-question");

wrong_Questions.textContent = `${wrongQuestions}/${totQuestion} questions`;
wrong_Questions.style.display = "block";


// PERCENTUALE DOAMDE GIUSTE E SBAGLIATE
const correctQuestionsPercentage = 23;
const correct_QuestionsPercentage = document.getElementById("correct-result-percentage");

correct_QuestionsPercentage.textContent = `${correctQuestionsPercentage}%`;
correct_QuestionsPercentage.style.display = "block";


const wrongQuestionsPercentage = 14;
const wrong_QuestionsPercentage = document.getElementById("wrong-result-percentage");

wrong_QuestionsPercentage.textContent = `${wrongQuestionsPercentage}%`;
wrong_QuestionsPercentage.style.display = "block";

// passare a pagina feedback

document.querySelector('#feedback-page').addEventListener('click', function(){
  document.getElementById('resultsPage').style.display ='none';  
  document.getElementById('feedback').style.display ='block';
})