class Question {
  // YOUR CODE HERE:
  //
  // 1. constructor (text, choices, answer, difficulty)

  constructor(text, choices, answer, difficulty) {
    this.text = text;
    this.choices = choices;
    this.answer = answer;
    this.difficulty = difficulty;
  }

  shuffleChoices() {
    for (let i = this.choices.length - 1; i >= 0; i--) {
      const randomNumber = Math.floor(Math.random() * (i + 1));
      const temporary = this.choices[i];
      this.choices[i] = this.choices[randomNumber];
      this.choices[randomNumber] = temporary;
    }
    return this.choices;
  }
}
