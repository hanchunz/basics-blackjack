/* 
We will be creating a Blackjack game based on the following rules

1. There will be only two players. One human and one computer (for the Base solution).
2. The computer will always be the dealer.
3. Each player gets dealt two cards to start.
4. The player goes first, and decides if they want to hit (draw a card) or stand (end their turn).
5. The dealer has to hit if their hand is below 17.
6. Each players' score is the total of their card ranks. Jacks/Queen/Kings are 10. Aces can be 1 or 11.
7. The player who is closer to, but not above 21 wins the hand.
*/

//Create a global variable that stores the game mode ("deal the cards" is the default, "player decision" prompts the player to hit to stand, and "game over" prompts the user to reset the game
var gameMode = "deal the cards";

//Create a function that ends the game
var gameOver = function () {
  gameMode = "game over";
};

//Create a global variable to store the deck
var deckOfCards = [];

//Create the global variables that stores the cards for the user and the player (arrays to store objects)
var playerCards = [];
var computerCards = [];

//Create a function to make a deck. There are a total of 13 ranks and 4 suits
var makeDeck = function () {
  //Initialize an empty card deck array
  var cardDeck = [];

  //Initialize an array of the suits for use later
  var suits = ["Clubs", "Diamonds", "Hearts", "Spades"];

  //Loop over the suits array
  var suitIndex = 0;
  while (suitIndex < suits.length) {
    //Store the current suit in a variable
    var currentSuit = suits[suitIndex];

    //Loop from 1 to 13 inclusive
    //Make sure to start the counter from 1 as we do not want to have a card with a rank of 0
    var rankCounter = 1;
    while (rankCounter <= 13) {
      //By default, the card name is equal to the rank counter number
      //Store this as a variable for further use
      var cardName = rankCounter;

      //Change the name for the special cards (ace, jack, queen, king which corresponds to a value of 1, 11, 12, 13 respectively)
      if (cardName == 1) {
        cardName = "Ace";
      } else if (cardName == 11) {
        cardName = "Jack";
      } else if (cardName == 12) {
        cardName = "Queen";
      } else if (cardName == 13) {
        cardName = "King";
      }

      //Since picture cards are worth 10 points each, we have to make the rank for Jacks/Queens/Kings 10
      var rankNumber = rankCounter;

      //Change the rank for the picture cards to 10 each
      if (rankNumber == 11) {
        rankNumber = 10;
      } else if (rankNumber == 12) {
        rankNumber = 10;
      } else if (rankNumber == 13) {
        rankNumber = 10;
      }

      //Create a new card object with the current name, suit, and rank
      var card = {
        name: cardName,
        suit: currentSuit,
        rank: rankNumber,
      };

      //Add the new card to the deck
      cardDeck.push(card);

      //Increase the rank counter by 1 to iterate over the next rank
      rankCounter += 1;
    }

    //Increase the suits index counter by 1 to iterate over the next rank
    suitIndex += 1;
  }

  //Return the completed card deck
  return cardDeck;
};

// Get a random index ranging from 0 (inclusive) to max (exclusive). To use in shuffling the deck
var getRandomIndex = function (max) {
  return Math.floor(Math.random() * max);
};

//Create a function to shuffle the deck. Shuffle the elements in the cardDeck array
var shuffleCards = function (cardDeck) {
  // Loop over the card deck array once
  var currentIndex = 0;
  while (currentIndex < cardDeck.length) {
    // Select a random index in the deck
    var randomIndex = getRandomIndex(cardDeck.length);

    // Select the card that corresponds to randomIndex
    var randomCard = cardDeck[randomIndex];

    // Select the card that corresponds to currentIndex
    var currentCard = cardDeck[currentIndex];

    // Swap positions of randomCard and currentCard in the deck
    cardDeck[currentIndex] = randomCard;
    cardDeck[randomIndex] = currentCard;

    // Increment currentIndex
    currentIndex = currentIndex + 1;
  }
  // Return the shuffled deck
  return cardDeck;
};

//Create a function that outputs the cards in a readable format for the statements from the cards array
var cardsReadableFormatter = function (cards) {
  //Create a variable to store the output for the cards
  var cardsReadableOutput = ``;

  //Create a for loop that for each card in the cards array for each player, it adds the card name and suit to the output
  for (var counter = 0; counter < cards.length; counter += 1) {
    cardsReadableOutput =
      cardsReadableOutput +
      `<br>${cards[counter].name} of ${cards[counter].suit}`;
  }
  return cardsReadableOutput;
};

//Create a function that outputs the total points from the cards in the hand
var pointsCounting = function (cards) {
  //Create a variable to store the points
  var totalPoints = 0;

  //Create a for loop that for each card in the cards array for each player, it adds the card number (rank) to the output
  for (var counter = 0; counter < cards.length; counter += 1) {
    totalPoints = totalPoints + cards[counter].rank;
  }

  //Create a for loop that looks through each and every card in the array and if there is an ace, check if the total score would be below 21 if ace is 11
  //If yes, make ace equal to 11. If not, make ace remain as 1
  for (var counter = 0; counter < cards.length; counter += 1) {
    if (cards[counter].name == "Ace") {
      if (totalPoints + 10 < 22) {
        totalPoints = totalPoints + 10;
      }
    }
  }

  return totalPoints;
};

//Create the functions to output win/loss/draw statements (empty for now but could include points comparison later)
var winStatement = function () {
  return `You win!`;
};
var lossStatement = function () {
  return `You lose!`;
};
var drawStatement = function () {
  return `Its a draw!`;
};

//The blackjack variants
var blackjackWinStatement = function () {
  return `You got a Blackjack! You win!`;
};
var blackjackLossStatement = function () {
  return `The computer got a Blackjack! You lose!`;
};
var blackjackDrawStatement = function () {
  return `You both got a Blackjack! Its a draw!`;
};

//Create a variable that prompts the user to hit or stand
var hitOrStand = `Please input "hit" or "stand, then press submit.`;

//Create a variable that prompts the user to reset the game
var resetGame = `<br><br> Click submit to play again!`;

//Create a function that outputs the hands of each player and their total score
var cardsInHandStatement = function () {
  return `<br><br>Your cards are: ${cardsReadableFormatter(
    playerCards
  )} <br>Your total score is ${pointsCounting(
    playerCards
  )}<br><br>The computer's cards are: ${cardsReadableFormatter(
    computerCards
  )} <br>Its total score is ${pointsCounting(computerCards)} <br><br>`;
};

//Create a function that outputs the statement after the cards have been dealt, determines if anyone has a black jeck, otherwise it will prompt the player to hit or stand
var cardsDealtStatement = function () {
  //Create a variable that mentions that the cards have been dealt
  var cardsDealt = `The cards have been dealt!`;

  //End the game first, to not repeat the same code 3 times in the checking of blackjack
  gameOver();

  //Check if anyone has blackjack, and output the correct statement accordingly. If the game doesnt end, set the game mode to player decision
  if (
    pointsCounting(playerCards) == 21 &&
    pointsCounting(computerCards) != 21
  ) {
    gameOver();
    return `${cardsDealt}${cardsInHandStatement()}${blackjackWinStatement()}${resetGame}`;
  } else if (
    pointsCounting(playerCards) != 21 &&
    pointsCounting(computerCards) == 21
  ) {
    gameOver();
    return `${cardsDealt}${cardsInHandStatement()}${blackjackLossStatement()}${resetGame}`;
  } else if (
    pointsCounting(playerCards) == 21 &&
    pointsCounting(computerCards) == 21
  ) {
    return `${cardsDealt}${cardsInHandStatement()}${blackjackDrawStatement()}${resetGame}`;
  } else {
    //Change the game mode to decide whether the player wants to hit or stand
    gameMode = "player decision";
    return `${cardsDealt}${cardsInHandStatement()}${hitOrStand}`;
  }
};

//Create a function that outputs the statement after the player hits
var hitStatement = function () {
  //Create a variable that mentions that the player hits
  var hit = `Hit! A card has been added to your hand.`;

  //Check the players total points. If it is more than 21, the player has busted and lost (end the game)
  if (pointsCounting(playerCards) > 21) {
    gameOver();
    return `${hit}${cardsInHandStatement()}You busted!<br>${lossStatement()}${resetGame}`;
  } else {
    return `${hit}${cardsInHandStatement()}${hitOrStand}`;
  }
};

//Create a function that outputs the statement after the player stands
var standStatement = function () {
  //Create a variable that mentions that the player stands
  var hit = `Stand! Time to compare your hand with the dealer's and see who wins.`;

  //Set the game mode to game over
  gameOver();

  //Check if the dealer busted and output accordingly
  if (pointsCounting(computerCards) > 21) {
    return `${hit}${cardsInHandStatement()}The dealer busted!<br>${winStatement()}${resetGame}`;
  }

  //If the dealer did not bust, compare the scores and output the correct statement
  if (pointsCounting(playerCards) > pointsCounting(computerCards)) {
    return `${hit}${cardsInHandStatement()}${winStatement()}${resetGame}`;
  } else if (pointsCounting(playerCards) < pointsCounting(computerCards)) {
    return `${hit}${cardsInHandStatement()}${lossStatement()}${resetGame}`;
  } else if (pointsCounting(playerCards) == pointsCounting(computerCards)) {
    return `${hit}${cardsInHandStatement()}${drawStatement()}${resetGame}`;
  }
};

//Create the main game function
var blackjackGame = function (userInput) {
  //Make the user input lower case
  userInput = userInput.toLowerCase();

  //If the game mode is "deal the cards", deal the cards to the users
  if (gameMode == "deal the cards") {
    //Make a deck of cards and assign it to the global variable for deck of cards, and shuffle it
    deckOfCards = shuffleCards(makeDeck());
    console.log(deckOfCards);

    //Use a for loop to pop 2 cards from the shuffled deck and push it into player and computer cards
    //Cards are dealt one per person in a loop
    for (var counter = 0; counter < 2; counter += 1) {
      playerCards.push(deckOfCards.pop());
      computerCards.push(deckOfCards.pop());
    }

    //Console log the results for us to confirm
    console.log("Player's cards: ", playerCards);
    console.log("Computer's cards: ", computerCards);

    return cardsDealtStatement();
  }

  //Check if the game mode is "player decision"
  if (gameMode == "player decision") {
    //Check if the user inputs hit, then push another card into the player's hand
    if (userInput == "hit") {
      playerCards.push(deckOfCards.pop());

      //Console log the results for us to confirm
      console.log("Player's cards: ", playerCards);
      console.log("Computer's cards: ", computerCards);
      return hitStatement();
    }

    //Check if the user inputs stand, then check the computers score and if it is below 17, hit the computer, then compare
    //If not, compare then and see who wins
    else if (userInput == "stand") {
      //If the computer points is less than 17, the computer must hit
      if (pointsCounting(computerCards) < 17) {
        while (pointsCounting(computerCards) < 17) {
          computerCards.push(deckOfCards.pop());
        }
      }
    }
    //Once the computer hits 17 points, run the stand statement to compare
    return standStatement();
  } else {
    //return invalid statement if the user input is not hit or stand
    return `Invalid input!${cardsInHandStatement()}${hitOrStand}`;
  }
};

var main = function (input) {
  var myOutputValue = blackjackGame(input);

  //Reset the game automatically
  if (gameMode == "game over") {
    gameMode = "deal the cards";
    deckOfCards = [];
    playerCards = [];
    computerCards = [];
  }

  return myOutputValue;
};
