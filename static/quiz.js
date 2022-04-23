$(document).ready(function(){
    displayProgress()
    bindPrevBtn()
    console.log(data)
    
    if (data["type"] == "matching") {
        if (data["user_data"] == "") {
            Matching.load()
        } else {
            Matching.loadResponse(data["user_data"])
        }
    } 
    else if (data["type"] == "ordering") {
        if (data["user_data"] == "") {
            Ordering.load()
        } else {
            Ordering.loadResponse(data["user_data"])
        }
    }
    else if (data["type"] == "muscle") {
        if (data["user_data"] == "") {
            MuscleId.load()
        } else {
            MuscleId.loadResponse(data["user_data"])
        }
    } 
})

/********************** QUIZ-WIDE UTILITIES **********************/

// Displays current progress in the progress bar
function displayProgress() {
    prog = $(".progress-bar")
    if (data["id"]) {
        percent = (data["id"] / (data["len"] + 1)) * 100 + ""  
    } else {
        percent = 100
    }
    prog.attr("aria-valuenow", percent)
    prog.css("width", percent + "%")
} 

// Binds bottom right button to next question
function bindNextBtn () {
    let btn = $("#next-btn")
    btn.off("click")
    btn.html("Next")
    btn.click(function () {
        if (data["id"] < data["len"]) {
            //console.log("redirecting to", "/quiz/" + (data["id"] + 1))
            window.location.href = "/quiz/" + (data["id"] + 1)
        }
        else {
            window.location.href = "/quiz_result"
        }
    })
}

// Binds bottom left button to prev question
function bindPrevBtn() {
    let btn = $("#prev-btn")
    if (data["id"] == 1) {
        btn.hide()
        return
    }

    btn.show()
    if (data["id"] > 1) {
        btn.click(function() {
            window.location.href = "/quiz/" + (data["id"] - 1)
        })
    }
    else if (typeof data["id"] == "undefined") {
        btn.click(function() {
            window.location.href = "/quiz/" + (data["prev"])
        })
    }
}

// Shuffles an array at random
function shuffle(array) {
    arr = array.slice(0)
    let rand, i = arr.length 
    while (i != 0) {    // While there remain elements to shuffle.
        // Pick a remaining element, swap with the current element.
        rand = Math.floor(Math.random() * i)
        i--
        [arr[i], arr[rand]] = [arr[rand], arr[i]]
    }
    return arr
}

// Sends an array of answers to save for question <id>
function saveAnswers(type, score, responses, correct, unused) {
    userData = {
        "id": data["id"],
        "type": type,
        "score": score,
        "responses": responses,
        "correct": correct,
        "unused": unused,
    }
    console.log("sending", userData)
    $.ajax({
        type: "POST",
        url: "" + data["id"],                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(userData),
        success: function(result){
            let response = result["data"]["user_data"]
            if (data["type"] == "matching") {
                Matching.loadResponse(response)
            }
            else if (data["type"] == "ordering") {
                Ordering.loadResponse(response)
            }
            else if (data["type"] == "muscle") {
                MuscleId.loadResponse(response)
            }
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
}

// Updates cumulative responses and correct arrays accordingly, returns score
function scoreAnswer(response, answer, correct, responses) {
    if (typeof response == "undefined") {
        response = ""
    } 
    responses.push(response)

    if (response == answer) {
        correct.push(true)
        return 1
    } else {
        correct.push(false)
        return 0
    }
    
}

/********************** MATCHING QUESTIONS **********************/

var Matching = function() {
    var IMG_DIR = "/static/img/poses/"

    // Matching question: displays unanswered questions
    function load() {

        // Display header, images, and answer bank
        $("#content").empty()
        showQuestion("Part 1: Matching")
        showOptions(shuffle(data["answers"]))

        // Event binding
        $("#next-btn").html("Check")
        $("#next-btn").click(function() {
            check()
        })
        $(".quiz-label").draggable({  revert: "invalid" })
        $(".quiz-label-drop").droppable({
            accept: function(ui) {
                return $(this).children().length == 0
            },
            drop: function(event, ui) {
                let dropped = ui.draggable
                $(dropped).addClass("dropped")
                $(dropped).detach().css({top: 0,left: 0}).appendTo($(this));
            }
        })
        $("#matching-options").droppable({
            drop: function(event, ui) {
                let dropped = ui.draggable
                $(dropped).removeClass("dropped")
                $(dropped).detach().css({top: 0,left: 0}).appendTo($(this));
            }
        })
    }

    // Matching: Loads data from previous response
    function loadResponse(data) {
        // Display header, pose images
        $("#content").empty()
        showQuestion("Part 1: Matching")
        
        // Display right/wrong feedback
        let usedAnswers = []
        $(".quiz-label-drop").each(function(i) {
            response = data["responses"][i]
            let label = $("<div class='quiz-label'>").html(response)
            
            if (response == "") {               // Blank response (cont loop)
                $(this).addClass("incorrect")
                return
            } else if (data["correct"][i]) {    // Answer is correct
                label.addClass("dropped correct")
            } else {                            // Answer incorrect
                label.addClass("dropped incorrect")
            }
            $(this).append(label)
            usedAnswers.push(response)
        })

        // Show unused answers in answer bank and next button
        showOptions(data["unused"])
        $(".quiz-label").addClass("locked")
        bindNextBtn()
    }

    // Matching: Checks answers, saves data on user's response
    function check() {
        let score = 0
        let responses = []
        let correct = []

        // Score and collect responses and answers
        $('.quiz-label-drop').each(function(i) {
            let response = ($(this).children().html())
            let answer = data["answers"][i]
            score += scoreAnswer(response, answer, correct, responses)
        })
        let unusedLabels = $('.quiz-label').filter(':not(.dropped)')
        let unused = []
        unusedLabels.each( function(i, label) {
            unused.push(label.innerHTML) 
        })
        saveAnswers("matching", score, responses, correct, unused)
    }

    // Msatching: Displays header, images, and empty answer boxes
    function showQuestion() {
        let c = $("#content")
        let header = $("<div class='quiz-heading'>").html("Part 1: Matching")
        let question =  $("<div class='quiz-question'>").html(data["question"])
        let row = $("<div class='row gy-2'>")

        for (let i = 0; i < 8; i++) {
            filepath = data['imgs'][i]

            let col = $("<div class='col-md-3 quiz-pose'>")
            let img = $("<img />").attr({src: filepath, class: "mx-auto d-block"})
            let label = $("<div class='quiz-label-drop'>")
            col.append(label, img)
            row.append(col)
        }
        $("#content").append(header, question, row, $("<hr>"))
    }

    // Matching: Shows answer bank with posnames for options
    function showOptions(options) {
        console.log("options", options)
        let c = $("#content")
        let row = $("<div class='row'>")
        let col = $("<div id='matching-options' class='col-md'>")
        options.forEach((name) => {
            let label = $("<div class='quiz-label'>").html(name)
            col.append(label)
        })
        c.append(row.append(col))
    }

    return {
        load: load,
        loadResponse: loadResponse
   }
}()


/********************** ORDERING QUESTIONS **********************/

// Ordering: Displays an ordering question and options
var Ordering = function() {
    var IMG_DIR = "/static/img/poses/"

    function load() {
        $("#content").empty()
        showQuestion()
        showOptions(shuffle(data["answers"]))

        // Event binding
        $("#next-btn").html("Check")
        $("#next-btn").click(function() { check() })

        $(".quiz-img-drag").parent().draggable({  revert: "invalid" })
        $(".quiz-img-drop").droppable({
            drop: function(event, ui) {
                let dropped = ui.draggable
                $(dropped).removeClass("col-md-2")
                $(dropped).addClass("dropped")

                $(dropped).detach().css({top: 0,left: 0}).appendTo($(this))
                $(this).addClass("taken")
            }
        })
        $("#ordering-options").droppable({
            drop: function(event, ui) {
                let dropped = ui.draggable
                $(dropped).addClass("col-md-2")
                $(dropped).parent().removeClass("taken")
                $(dropped).detach().css({top: 0,left: 0}).appendTo($(this))
            }
        })
    }

    function loadResponse(data) {
        // Display header, pose images
        $("#content").empty()
        showQuestion()
        
        // Display right/wrong feedback
        $(".quiz-img-drop").each(function(i) {
            response = data["responses"][i]
            if (response == "") {               // Blank response (cont loop)
                $(this).addClass("incorrect")
                return
            }

            let imgDrag = $("<div class='quiz-img-drag'>")
            filepath = IMG_DIR + response + ".jpeg"
            let img = $("<img />").attr({src: filepath, class: "mx-auto d-block"})
            img.data("name", response)
            imgDrag.append(img)

            if (data["correct"][i]) {    // Answer is correct
                imgDrag.addClass("correct")
            } else {                            // Answer incorrect
                imgDrag.addClass("incorrect")
            }
            $(this).addClass("taken")
            $(this).append(imgDrag)
        })

        // Show unused answers in answer bank and next button
        showOptions(data["unused"])
        bindNextBtn()
    }

    // Ordering: checks answers and saves user data
    function check() {
        let score = 0
        let responses = []
        let correct = []

        // Score and collect responses and answers
        $('.quiz-img-drop').each(function(i) {
            let response = ($(this).find("img").data("name"))
            let answer = data["answers"][i]
            score += scoreAnswer(response, answer, correct, responses)
        })
        let unused = [] // data["answers"].filter(ans => !responses.includes(ans))  
        let unusedImgs = $('#ordering-options').find('img')
        unusedImgs.each( function(i) {
            unused.push($(this).data("name")) 
        })
        console.log(unused)
        saveAnswers("ordering", score, responses, correct, unused)
    }

    
    // Ordering: Displays the question part
    function showQuestion() {
        let c = $("#content")
        let header = $("<div class='quiz-heading'>").html("Part 2: Ordering")
        let question = $("<div class='quiz-question'>").html(data["question"])
        let row = $("<div class='row gx-3' id='ordering-responses'>")

        // How much to shift 0 based index for display on drop boxes
        if (data["id"] == 2)        { shift = 1 } 
        else if (data["id"] == 3)   { shift = 7 }
        
        // Create boxes to drop answers
        for (let i = 0; i < 6; i++) {
            let col = $("<div class='col-md-2'>")
            let imgDrop = $("<div class='quiz-img-drop'>")
            imgDrop.append($("<p class='align-middle text-center'>").html(i + shift + ""))
            col.append(imgDrop)
            row.append(col)
        }
        $("#content").append(header, question, row, $("<hr>"))
    }

    // Ordering: Shows answer options. <options> is an array of pose names
    function showOptions(options) {
        let c = $("#content")
        let row = $("<div class='row gx-3' id='ordering-options'>")

        options.forEach(function(posename, i) {
            let col = $("<div class='col-md-2'>")
            let imgDrag = $("<div class='quiz-img-drag'>")
            filepath = IMG_DIR + posename + ".jpeg"
            
            let img = $("<img />").attr({src: filepath, class: "mx-auto d-block"})
            img.data("name", posename)
            imgDrag.append(img)
            col.append(imgDrag)
            row.append(col)
        })
        c.append(row, $("<br>"))
    }

    return {
        load: load,
        loadResponse: loadResponse
    }
}()

/********************** MUSCLE ID QUESTIONS **********************/

var MuscleId = function () {
    // Displays an identifying muscles activated by poses question
    var options = ["abs", "calves", "hamstrings", "lats", "lower-back", "lower-traps", "obliques", "quads", "shoulders", "spine"]
    var selected = []
    
    function load() {
        $("#content").empty()
        showQuestion()
        animateMuscles()
        animateLabel()

        // Event binding
        $("#next-btn").html("Check")
        $("#next-btn").click(function() { check() })
    }

    function loadResponse(data) {
        // Display header, pose images
        let c = $("#content")
        c.empty()
        showQuestion()
        
        
        animateLabel()
        console.log(data)
        
        // Display right/wrong feedback for the user's selected muscles
        data["responses"].forEach((muscle, i) => {
            let muscleClass = "." + muscle.toLowerCase().replace(" ", "-")
            if (data["correct"][i]) {
                $(muscleClass).addClass("correct")
            }
            else {
                $(muscleClass).addClass("incorrect")
            }
        })
        data["unused"].forEach((muscle, i) => {
            let muscleClass = "." + muscle.toLowerCase().replace(" ", "-")
            $(muscleClass).addClass("missed")
        })
        bindNextBtn()

        /*let row = c.find(".row")
        let feedback = $("<div class='col-md-4'>")
        let correct = $("<div id='correct'>").html("<p><b> Correctly Chosen Muscles</b></p>")
        let incorrect = $("<div id='incorrect'>").html("<b>Incorrectly Chosen Muscles</b>")
        let missed = $("<div id='missed'>").html("<b>Missed Muscles</b>")
        feedback.append(correct, missed, incorrect)
        row.append(feedback)*/
    }

    function showQuestion() {
        let c = $("#content")
        let header = $("<div class='quiz-heading'>").html("Part 3: Muscle Identification")
        let hint = "\nHint: " + data["answers"].length + " muscles should be selected."
        let question = $("<div class='quiz-question'>").html(data["question"] + hint)
        
        let pose = $("<div class='col-md-3'>")
        let img = $("<img />").attr({src: data["imgs"][1], class: "muscle-side-pose"})
        pose.append(img)

        let diagram = $("<div class='col-md'>").html( data["imgs"][0])  // adds SVG image
        let label = $("<div class='muscle-label'>").hide()
        diagram.append(label)
        
        let row = $("<div class='row gx-3'>")
        row.append(pose, diagram)
        c.append(header, question, row)

    }
    /*function showOptions(options) {
        let row = $("<div class='row'>")
        let col = $("<div class='col-md'>")
        options.forEach((muscle) => {
            let label = $("<div class='quiz-label'>").html(muscle)
            col.append(label)
        })
        c.append(row.append(col))
    }*/

    // Adds animation to muscle diagram SVG. options and selected are class-wide variables
    function animateLabel() {
        let label = $('.muscle-label')
        options.forEach( (muscle) => {
            let muscleClass = "." + muscle
            $(muscleClass).hover(function() {
                // add floating label
                t = this.getBoundingClientRect().top - 20
                l = this.getBoundingClientRect().left - 100
                label.css({"top": t + "px", "left": l + "px"}).show()
                label.html($(this).data("name"))
            }, function() {
                label.hide()
            })
        })
    }

    function animateMuscles() {
        options.forEach( (muscle) => {
            let muscleClass = "." + muscle

            $(muscleClass).hover(function() {
                // shade entire class purple
                $(muscleClass).addClass("hover")
            }, function() {
                $(muscleClass).removeClass("hover")
            })
            
            $(muscleClass).click(function() {
                let muscle = $(this).data("name")
                let i = selected.indexOf(muscle)
                if (i == -1) {
                    $(muscleClass).addClass("selected")
                    selected.push(muscle)
                }
                else {
                    $(muscleClass).removeClass("selected")
                    selected.splice(i, 1)
                }
                console.log(selected)
            })
        })
    }

    function check() {
        selected.sort()
        data["answers"].sort()

        // Evaluate selected answers
        let correct = []
        let score = 0
        let total = data["answers"].length
        selected.forEach((response, i) => {
            if (data["answers"].includes(response)) {
                correct.push(true)
                score += 1
            }
            else {
                correct.push(false)
            }
        })

        // missed = the correct muscles that were unselected
        let missed = data["answers"].filter(ans => !selected.includes(ans)) 
        saveAnswers("muscle", score/total, selected, correct, missed)
    }
    
    return {
        load: load,
        loadResponse: loadResponse
    }
}()


/********************** DISPLAY QUIZ RESULTS **********************/

function showResults() {
    c = $("#content")
    matching = "Matching score: " + data["matching_score"] + "/" + data["matching_total"]
    ordering = "Ordering score: " + data["ordering_score"] + "/" + data["ordering_total"]
    
    c.append($("<p>").html(matching))
    c.append($("<p>").html(ordering))
}