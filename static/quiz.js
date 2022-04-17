let POSE_IMG_DIR = "/static/img/poses/"

$(document).ready(function(){
    $("#content").empty()
    displayProgress()
    bindPrevBtn()
    console.log(data)
    
    if (data["type"] == "matching") {
        if (data["user_data"] == "") {
            loadMatching()
        } else {
            loadMatchingResponse(data["user_data"])
        }
    } else if (data["type"] == "muscles") {
        loadMuscleId()
    } else if (data["type"] == "ordering") {
        if (data["user_data"] == "") {
            loadOrdering()
        } else {
            loadOrderingResponse(data["user_data"])
        }
    }

})

/********************** QUIZ-WIDE UTILITIES **********************/

// Displays current progress in the progress bar
function displayProgress() {
    prog = $(".progress-bar")
    let percent = (data["id"] / data["len"]) * 100 + ""
    prog.attr("aria-valuenow", percent)
    prog.css("width", percent + "%")
} 

// Binds bottom right button to next question
function bindNextBtn () {
    $("#next-btn").html("Next")
    $("#next-btn").click(function () {
        if (data["id"] < data["len"]) {
            window.location.href = "/quiz/" + (data["id"] + 1)
        }
    })
}

// Binds bottom left button to prev question
function bindPrevBtn() {
    // Add previous button if not the first question
    if (1 < data["id"]) {
        prevBtn = $("<button id='prev-btn' class='btn btn-purple float-start'>").html("Previous")
        prevBtn.click(function() {
            window.location.href = "/quiz/" + (data["id"] - 1)
        })
        $("#quiz-nav").append(prevBtn)
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
function saveAnswers(score, responses, correct, unused) {
    userData = {
        "id": data["id"],
        "score": score,
        "responses": responses,
        "correct": correct,
        "unused": unused,
    }
    $.ajax({
        type: "POST",
        url: "" + data["id"],                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(userData),
        success: function(result){
            let response = result["data"]["user_data"]
            if (data["id"] == 1) {
                loadMatchingResponse(response)
            }
            else if (data["id"] == 2 || data["id"] == 3) {
                loadOrderingResponse(response)
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

/********************** MATCHING QUESTIONS **********************/

// Matching question: displays unanswered questions
function loadMatching() {
    // Display header, images, and answer bank
    let msg = "Part 1: Match the name to the pose"
    showMatchingGraphics(2, 4, msg, labels=true)
    shuffled = shuffle(data["answers"])
    showMatchingOpts(shuffled)

    // Event binding
    $("#next-btn").html("Check")
    $("#next-btn").click(function() {
        checkMatching()
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

// Matching question: Loads data from previous response
function loadMatchingResponse(data) {
    // Display header, pose images
    $("#content").empty()
    let msg = "Part 1: Match the name to the pose"
    showMatchingGraphics(2, 4, msg, labels=true)
    
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
    showMatchingOpts(data["unused"])
    $(".quiz-label").addClass("locked")
    bindNextBtn()
}

// Matching question: Checks answers, saves data on user's response
function checkMatching() {
    // check responses, send answers and score to server
    let score = 0
    let responses = []
    let correct = []

    // Score and collect responses and answers
    $('.quiz-label-drop').each(function(i) {
        let response = ($(this).children().html())
        let answer = data["answers"][i]

        if (response == answer) {
            score += 1
            correct.push(true)
        } else if (typeof response == "undefined") {
            correct.push(false)
            response = ""
        } else {
            correct.push(false)
        }
        responses.push(response)
    })

    // Get unused options
    let unusedLabels = $('.quiz-label').filter(':not(.dropped)')
    let unused = []
    unusedLabels.each( function(i, label) {
        unused.push(label.innerHTML) 
    })

    saveAnswers(score, responses, correct, unused)
}

// Msatching question: Displays header, images, and empty answer boxes
function showMatchingGraphics(rows, cols, msg, labels=false) {
    let c = $("#content")
    let header = $("<div class='quiz-heading'>").html(msg)
    c.append(header)
    
    let row = $("<div class='row gy-3'>")
    for (let i = 0; i < rows*cols; i++) {
        filepath = data['imgs'][i]

        let col = $("<div class='col-md-3 quiz-pose'>")
        let img = $("<img />").attr({src: filepath, class: "mx-auto d-block"})
        if (labels) {
            let label = $("<div class='quiz-label-drop'>")
            col.append(label)
        }
        col.append(img)
        row.append(col)
    }
    c.append(row)
    c.append($("<hr>"))
}

// Matching question: Shows answer bank with posnames for options
function showMatchingOpts(options) {
    let c = $("#content")
    let row = $("<div class='row'>")
    let col = $("<div id='matching-options' class='col-md'>")
    options.forEach((name) => {
        let label = $("<div class='quiz-label'>").html(name)
        col.append(label)
    })
    c.append(row.append(col))
}

/********************** ORDERING QUESTIONS **********************/

// Displays an ordering question
function loadOrdering() {
    
    showOrderingGraphics()
    shuffledOpts = shuffle(data["answers"])
    showOrderingOpts(shuffledOpts)

    // Event binding
    $("#next-btn").html("Check")
    $("#next-btn").click(function() {
        checkOrdering()
    })

    $(".quiz-img-drag").parent().draggable({  revert: "invalid" })
    $(".quiz-img-drop").droppable({
        drop: function(event, ui) {
            let dropped = ui.draggable
            $(dropped).removeClass("col-md-2")
            $(dropped).detach().css({top: 0,left: 0}).appendTo($(this));
            $(this).addClass("taken")
        }
    })
    $("#ordering-options").droppable({
        drop: function(event, ui) {
            let dropped = ui.draggable
            $(dropped).addClass("col-md-2")
            $(dropped).parent().removeClass("taken")
            $(dropped).detach().css({top: 0,left: 0}).appendTo($(this));
        }
    })
}

function loadOrderingResponse(data) {
    // Display header, pose images
    $("#content").empty()
    if (data["id"] == 2) {
        msg = "Part 2: Drag the poses in order for moves 1-6 of a sun salutation"
        
    } else if (data["id"] == 3) {
        msg = "Part 2: Drag the poses in order for moves 7-12 of a sun salutation"
    }
    showOrderingGraphics(msg)
    
    // Display right/wrong feedback
    let usedAnswers = []
    $(".quiz-img-drop").each(function(i) {
        response = data["responses"][i]
        if (response == "") {               // Blank response (cont loop)
            $(this).addClass("incorrect")
            return
        }

        let imgDrag = $("<div class='quiz-img-drag'>")
        filepath = POSE_IMG_DIR + response + ".jpeg"
        let img = $("<img />").attr({src: filepath, class: "mx-auto d-block"})
        imgDrag.append(img)

        if (data["correct"][i]) {    // Answer is correct
            imgDrag.addClass("correct")
        } else {                            // Answer incorrect
            imgDrag.addClass("incorrect")
        }
        $(this).addClass("taken")
        $(this).append(imgDrag)
        usedAnswers.push(response)
    })

    // Show unused answers in answer bank and next button
    showOrderingOpts(data["unused"])
    bindNextBtn()
}

// Ordering Question: checks answers and saves user data
function checkOrdering() {
    // check responses, send answers and score to server
    let score = 0
    let responses = []
    let correct = []

    // Score and collect responses and answers
    $('.quiz-img-drop').each(function(i) {
        let response = ($(this).find("img").data("name"))
        let answer = data["answers"][i]

        if (response == answer) {
            score += 1
            correct.push(true)
        } else if (typeof response == "undefined") {
            correct.push(false)
            response = ""
        } else {
            correct.push(false)
        }
        responses.push(response)
    })
    
    let unused = data["answers"].filter(ans => !responses.includes(ans))
    saveAnswers(score, responses, correct, unused)
}

function showOrderingGraphics() {
    if (data["id"] == 2) {
        msg = "Part 2: Drag the poses in order for moves 1-6 of a sun salutation"
        shift = 1
    } else if (data["id"] == 3) {
        msg = "Part 2: Drag the poses in order for moves 7-12 of a sun salutation"
        shift = 7
    }
    
    let c = $("#content")
    let header = $("<div class='quiz-heading'>").html(msg)
    let row = $("<div class='row gx-3'>")
    for (let i = 0; i < 6; i++) {
        let col = $("<div class='col-md-2'>")
        let imgDrop = $("<div class='quiz-img-drop'>")
        imgDrop.append($("<p class='align-middle text-center'>").html(i + shift + ""))
        col.append(imgDrop)
        row.append(col)
    }
    c.append(header, row, $("<hr>"))
}

// options is an array of img filepaths
function showOrderingOpts(options) {
    let c = $("#content")
    let row = $("<div class='row gx-3' id='ordering-options'>")

    options.forEach(function(posename, i) {
        let col = $("<div class='col-md-2'>")
        let imgDrag = $("<div class='quiz-img-drag'>")
        filepath = POSE_IMG_DIR + posename + ".jpeg"
        
        let img = $("<img />").attr({src: filepath, class: "mx-auto d-block"})
        img.data("name", posename)
        imgDrag.append(img)
        col.append(imgDrag)
        row.append(col)
    })
    c.append(row)
}

/********************** MUSCLE ID QUESTIONS **********************/

// Displays an identifying muscles activated by poses question
function loadMuscleId() {
    c = $("#content")
    header = $("<div class='quiz-heading'>").html("Part 2: Muscles Activated")
    question = $("<div>").html("Drag the name to the diagram.")
    c.append(header,question)
}
