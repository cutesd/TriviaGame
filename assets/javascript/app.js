$(document).ready(function () {

    var PotterTrivia = function (questions_arr) {

        // Arrays
        var gameQuestions = [];
        var currQuestion;
        //
        var winAni = [];
        var loseAni = [];

        // Numbers + Counters
        var correctCnt = 0;
        var wrongCnt = 0;
        var timedOutCnt = 0;
        var qCnt = 0;
        var timerCnt = 30;
        var timer;

        // Elements
        var main = $('#game-container');
        var title = $('#title');
        var timerDiv = $('#timerDiv');
        var timerOut = $('#timer-val');
        var questionDiv = $('<div>');
        // Play Button
        var playBtn = $('<button>');
        playBtn.addClass('btn btn-secondary btn-lg mt-5');
        playBtn.text('Play Game');

        /* =============  INIT AND SETUP =============== */
        this.play = init;

        function init() {
            qCnt = correctCnt = timedOutCnt = wrongCnt = 0;
            timerCnt = 30;
            gameQuestions = winAni = loseAni = [];
            gameQuestions = rndArr(questions_arr, 10);
            playBtn.on("click", startGame);
            winAni = aniArr('correct');
            loseAni = aniArr('wrong');
            main.append(playBtn);
        }

        function rndNumArr(min, max) {
            var _arr = [];
            for (var i = min; i <= max; i++) {
                _arr.push(i);
            }
            return rndArr(_arr, _arr.length);
        }

        function rndArr(arr, lgth) {
            var temp_arr = arr.slice(0, arr.length);
            arr = [];
            var _arr = [];
            do {
                var rnd = Math.floor(Math.random() * temp_arr.length);
                _arr.push(temp_arr[rnd]);
                temp_arr.splice(rnd, 1);
            } while (--lgth > 0);

            return _arr;
        }


        function aniArr(str) {
            var _arr = rndNumArr(1, 10);
            var temp_arr = [];
            for (var i = 0; i < _arr.length; i++) {
                temp_arr.push(str + _arr[i] + '.gif');
            }
            return temp_arr;
        }

        function startGame() {
            qCnt = 0;
            timerCnt = 30;
            timerDisplay(timerCnt);
            main.empty();
            title.addClass("smaller");
            $('#instr').addClass('d-none');
            timerDiv.removeClass('d-none');
            buildQuestion();
        }

        /* ============= QUESTION =============== */
        function buildQuestion() {
            //
            var color = { a: 'primary', b: 'warning', c: 'danger', d: 'success' };
            var obj = gameQuestions[qCnt++];
            currQuestion = obj;
            //
            var qNum = $('<p>');
            qNum.text('Quote #' + qCnt);
            qNum.addClass('small pt-3');
            //
            var qTxt = $('<p>');
            qTxt.text('“' + obj.question + '”');
            qTxt.addClass('q-text');
            //
            var row = $('<div>');
            row.addClass('row no-gutters');
            $.each(obj.answers, function (key, value) {
                var col = $('<div>');
                col.addClass('col-md-6');
                //
                var btn = $('<button>');
                btn.addClass('btn btn-' + color[key] + " btn-lg btn-block");
                btn.attr('value', key);
                btn.text(value);
                btn.on("click", answerBtn);
                //
                col.append(btn);
                row.append(col);
            });
            //
            questionDiv.append(qNum);
            questionDiv.append(qTxt);
            questionDiv.append(row);
            main.append(questionDiv);
            //
            startTimer();
        }

        // REMOVES VISUAL ELEMENTS OF QUESTION
        function clearQuestion() {
            stopTimer();
            questionDiv.empty();
            main.empty();
        }

        // FULL QUESTION RESET
        function resetQuestion() {
            clearQuestion();
            timerCnt = 30;
            timerDisplay(timerCnt);
        }

        /* =============  ANSWERS =============== */
        function answerBtn(e) {
            showAnswer($(this).val() == currQuestion.correctAnswer);
        }

        function showAnswer(val) {
            clearQuestion();
            if (val) {
                main.append(buildAni(val, winAni));
            } else {
                main.append(buildAni(val, loseAni));
            }
            // 
            setTimeout(function () {
                resetQuestion();
                if (qCnt === 10)
                    resultsPage();
                else
                    buildQuestion();
            }, 3500);
        }

        // ANIMATION
        function buildAni(isWin, _arr) {
            var aniDiv = $('<div>');
            var h3 = $('<h3>');
            var p = $('<h6>');
            //
            if (!isWin) {
                if (timerCnt === 0) {
                    timedOutCnt++;
                    h3.text('Out of time!')
                } else {
                    wrongCnt++;
                    h3.text('Incorrect!')
                }
                p.text('The correct answer was: ' + currQuestion.answers[currQuestion.correctAnswer]);

            } else {
                correctCnt++;
                h3.text('Correct!')
            }
            //
            var img = $('<img>');
            img.attr('src', 'assets/images/' + _arr[qCnt - 1]);
            //
            aniDiv.append(h3);
            aniDiv.append(p);
            aniDiv.append(img);
            return aniDiv;
        }

        /* =============  RESULTS PAGE =============== */
        function resultsPage() {
            resetQuestion();
            timerDiv.addClass('d-none');
            main.html("<h3>Trivius Totalis!  Here's how you did:</h3>  <h5>Correct: " + correctCnt+"</h5>   <h5>Incorrect: " + wrongCnt+"</h5>   <h5>Unanswered: " + timedOutCnt+"</h5> ");
            playBtn.text('Play Again?');
            init();
        }

        /* =============  TIMER =============== */
        function startTimer() {
            timer = setInterval(countdown, 1000);
        }

        function stopTimer() {
            clearInterval(timer);
        }

        function countdown() {
            timerDisplay(--timerCnt);
            if (timerCnt === 0) {
                stopTimer();
                showAnswer(false);
            }
        }

        function timerDisplay(str) {
            timerOut.text(str);
        }

        // END POTTERTRIVIA

    }

    // Questions for game
    var questions = [
        {
            question: "That's why you're famous. That's why everybody knows your name. You're the boy who lived.",
            answers: {
                a: "Minerva McGonagall",
                b: "Albus Dumbledore",
                c: "Rubeus Hagrid",
                d: "Hermione Granger"
            },
            correctAnswer: "c"
        },
        {
            question: "It's the same every year, packed with muggles of course.",
            answers: {
                a: "Ron Weasley",
                b: "Molly Weasley",
                c: "Fred Weasley",
                d: "George Weasley"
            },
            correctAnswer: "b"
        },
        {
            question: "You've got dirt on your nose by the way. Did you know?",
            answers: {
                a: "Hermione Granger",
                b: "Harry Potter",
                c: "Draco Malfoy",
                d: "Ginny Weasley"
            },
            correctAnswer: "a"
        },
        {
            question: "Red hair and a hand-me-down robe... you must be a Weasley.",
            answers: {
                a: "Draco Malfoy",
                b: "The Sorting Hat",
                c: "Hermione Granger",
                d: "Nearly Headless Nick"
            },
            correctAnswer: "a"
        },
        {
            question: "But everyone knows it's the Dark Arts he fancies. He's been after Quirrell's job for years.",
            answers: {
                a: "Fred Weasley",
                b: "Ron Weasley",
                c: "Percy Weasley",
                d: "Hermione Granger"
            },
            correctAnswer: "c"
        },
        {
            question: "Have you heard? Harry Potter's the new Seeker for Gryffindor. I always knew he'd do well.",
            answers: {
                a: "Professor Dumbledore",
                b: "Rubeus Hagrid",
                c: "Argus Filch",
                d: "Nearly Headless Nick"
            },
            correctAnswer: "d"
        },
        {
            question: "Stop, stop, stop, stop! You're going to take someone's eye out.",
            answers: {
                a: "Neville Longbottom",
                b: "Ron Weasley",
                c: "Hermione Granger",
                d: "Harry Potter"
            },
            correctAnswer: "c"
        },
        {
            question: "It shows nothing more or less than the deepest and most desperate desires of our hearts.",
            answers: {
                a: "Rubeus Hagrid",
                b: "Albus Dumbledore",
                c: "Minerva McGonagall",
                d: "Severus Snape"
            },
            correctAnswer: "b"
        },
        {
            question: "Sorry, don't mean to be rude, but I'm in no fit state to entertain today.",
            answers: {
                a: "Nearly Headless Nick",
                b: "Percy Weasley",
                c: "Hermione Granger",
                d: "Hagrid"
            },
            correctAnswer: "d"
        },
        {
            question: "God, I miss the screaming.",
            answers: {
                a: "Argus Filch",
                b: "Professor Snape",
                c: "Rubeus Hagrid",
                d: "Draco Malfoy"
            },
            correctAnswer: "a"
        },
        {
            question: "You're a little bit scary sometimes you know, brilliant but scary.",
            answers: {
                a: "Harry Potter",
                b: "Hermione Granger",
                c: "Neville Longbottom",
                d: "Ron Weasley"
            },
            correctAnswer: "d"
        },
        {
            question: "Doesn't it seem a bit quiet to you?",
            answers: {
                a: "Rubeus Hagrid",
                b: "Ron Weasley",
                c: "Harry Potter",
                d: "Hermione Granger"
            },
            correctAnswer: "c"
        },
        {
            question: "You don't suppose this is going to be like real Wizard's Chess, do you?",
            answers: {
                a: "Hermoine Granger",
                b: "Ron Weasley",
                c: "Harry Potter",
                d: "Neville Longbottom"
            },
            correctAnswer: "b"
        },
        {
            question: "Books and cleverness, there are more important things, like friendship and bravery.",
            answers: {
                a: "Albus Dumbledore",
                b: "Hermione Granger",
                c: "Ron Weasley",
                d: "Minerva McGonagall"
            },
            correctAnswer: "b"
        },
        {
            question: "I have strength enough for this.",
            answers: {
                a: "Lord Voldemort",
                b: "Professor Snape",
                c: "Professor Quirrell",
                d: "Harry Potter"
            },
            correctAnswer: "a"
        }
    ];

    // Instantiate PotterTrivia
    var myGame = new PotterTrivia(questions);
    myGame.play();

});