document.addEventListener('DOMContentLoaded', () => {
  /************  HTML ELEMENTS  ************/
  // View divs
  const quizView = document.querySelector('#quizView');
  const endView = document.querySelector('#endView');

  // Quiz view elements
  const progressBar = document.querySelector('#progressBar');
  const questionCount = document.querySelector('#questionCount');
  const questionContainer = document.querySelector('#question');
  const choiceContainer = document.querySelector('#choices');
  const nextButton = document.querySelector('#nextButton');
  const resetQuizButton = document.querySelector('#restartButton');

  // End view elements
  const resultContainer = document.querySelector('#result');

  /************  SET VISIBILITY OF VIEWS  ************/

  // Show the quiz view (div#quizView) and hide the end view (div#endView)
  quizView.style.display = 'block';
  endView.style.display = 'none';

  /************  QUIZ DATA  ************/

  // Array with the quiz questions
  const questions = [
    new Question('What is 2 + 2?', ['3', '4', '5', '6'], '4', 1),
    new Question(
      'What is the capital of France?',
      ['Miami', 'Paris', 'Oslo', 'Rome'],
      'Paris',
      1
    ),
    new Question(
      'Who created JavaScript?',
      ['Plato', 'Brendan Eich', 'Lea Verou', 'Bill Gates'],
      'Brendan Eich',
      2
    ),
    new Question(
      'What is the mass–energy equivalence equation?',
      ['E = mc^2', 'E = m*c^2', 'E = m*c^3', 'E = m*c'],
      'E = mc^2',
      3
    ),
    // Add more questions here
  ];
  const quizDuration = 120; // 120 seconds (2 minutes)

  /************  QUIZ INSTANCE  ************/

  // Create a new Quiz instance object
  const quiz = new Quiz(questions, quizDuration, quizDuration);

  // Shuffle the quiz questions
  quiz.shuffleQuestions();

  /************  SHOW INITIAL CONTENT  ************/

  // display timer
  displayTimer();

  // Show first question
  showQuestion();

  /************  TIMER  ************/

  let timer;
  quizTimer();

  /************  EVENT LISTENERS  ************/

  nextButton.addEventListener('click', nextButtonHandler);
  resetQuizButton.addEventListener('click', resetQuizButtonHandler);

  /************  FUNCTIONS  ************/

  // showQuestion() - Displays the current question and its choices
  // nextButtonHandler() - Handles the click on the next button
  // showResults() - Displays the end view and the quiz results
  // resetQuizButtonHandler() - Handles the click on the Restart Quiz button
  // quizTimer() - set timer interval
  // clearTimer() - clear timer
  // displayTimer() - display and update timer

  function showQuestion() {
    if (quiz.hasEnded()) {
      showResults();
      return;
    }

    questionContainer.innerText = '';
    choiceContainer.innerHTML = '';

    const question = quiz.getQuestion();
    question.shuffleChoices();

    questionContainer.innerText = question.text;

    const progressPercentage =
      (quiz.currentQuestionIndex / quiz.questions.length) * 100;
    progressBar.style.width = `${progressPercentage}%`;

    questionCount.innerText = `Question ${quiz.currentQuestionIndex + 1} of ${
      quiz.questions.length
    }`;

    question.choices.forEach((choice, index) => {
      const radioInput = document.createElement('input');
      radioInput.type = 'radio';
      radioInput.name = 'choice';
      radioInput.value = choice;
      radioInput.id = `choice${index}`;

      const label = document.createElement('label');
      label.htmlFor = `choice${index}`;
      label.innerText = choice;

      const lineBreak = document.createElement('br');

      choiceContainer.appendChild(radioInput);
      choiceContainer.appendChild(label);
      choiceContainer.appendChild(lineBreak);
    });
  }

  function nextButtonHandler() {
    let selectedAnswer;

    const choiceElements = document.querySelectorAll('input[name="choice"]');

    for (const choiceElement of choiceElements) {
      if (choiceElement.checked) {
        selectedAnswer = choiceElement.value;
        break;
      }
    }

    if (selectedAnswer) {
      quiz.checkAnswer(selectedAnswer);

      quiz.moveToNextQuestion();

      showQuestion();
    } else {
      alert('Please select an answer before proceeding.');
    }
  }

  function showResults() {
    clearTimer();
    quizView.style.display = 'none';
    endView.style.display = 'flex';
    resultContainer.innerText = `You scored ${quiz.correctAnswers} out of ${quiz.questions.length} correct answers!`;
  }

  function resetQuizButtonHandler() {
    quizView.style.display = 'flex';
    endView.style.display = 'none';
    quiz.currentQuestionIndex = 0;
    quiz.correctAnswers = 0;
    quiz.timeRemaining = quizDuration;
    displayTimer();
    quiz.shuffleQuestions();
    showQuestion();
    clearTimer();
    quizTimer();
  }

  function quizTimer() {
    if (!timer) {
      timer = setInterval(() => {
        quiz.timeRemaining -= 1;
        displayTimer();
        if (quiz.timeRemaining === 0) {
          showResults();
        }
      }, 1000);
    }
  }

  function clearTimer() {
    clearInterval(timer);
    timer = null;
  }

  function displayTimer() {
    // Convert the time remaining in seconds to minutes and seconds, and pad the numbers with zeros if needed
    const minutes = Math.floor(quiz.timeRemaining / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (quiz.timeRemaining % 60).toString().padStart(2, '0');
    // Display the time remaining in the time remaining container
    document.getElementById(
      'timeRemaining'
    ).innerText = `${minutes}:${seconds}`;
  }
});
