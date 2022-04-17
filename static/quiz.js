$(document).ready(function(){
    //$("body").css({"height": "100%", "margin": "0"})
    //$(".container").css({"height": "100%"})

    displayProgress()
    bindPrevBtn()
    console.log(data)
    
    if (data["type"] == "matching") {
        if (data["answer_data"] == "") {
            loadMatching()
        } else {
            loadMatchingResponse(data["answer_data"])
        }
    } else if (data["type"] == "muscles") {
        loadMuscleId()
    } else if (data["type"] == "ordering") {
        loadOrdering()
    }

})

// Displays current progress in the progress bar
function displayProgress() {
    prog = $(".progress-bar")
    let percent = (data["id"] / data["len"]) * 100 + ""
    prog.attr("aria-valuenow", percent)
    prog.css("width", percent + "%")
} 

// Binds bottom left button to prev question
function bindPrevBtn() {
    // Add previous button if not the first question
    if (1 < data["id"]) {
        prevBtn = $("<button id='prev-btn' class='btn btn-purple float-left'>").html("Previous")
        prevBtn.click(function() {
            window.location.href = "/quiz/" + (data["id"] - 1)
        })
        $("#quiz-nav").append(prevBtn)
    }
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

// Matching question: displays unanswered questions
function loadMatching() {
    // Display header, images, and answer bank
    let c = $("#content")
    let posenames = showMatchingGraphics(c, 2, 4)
    shuffle(posenames)
    showMatchingOpts(c, posenames)

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
    let c = $("#content").empty()
    showMatchingGraphics(c, 2, 4)
    
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
    showMatchingOpts(c, data["unused"])
    $(".quiz-label").addClass("locked")
    bindNextBtn()
    console.log("from load matching response", data)
}

// Matching question: Checks answers, saves data on user's response
function checkMatching() {
    // check responses, send answers and score to server
    let poses = $('.quiz-pose')
    let score = 0
    let answers = []
    let responses = []
    let correct = []

    // Score and collect responses and answers
    $('.quiz-label-drop').each(function(i) {
        let response = ($(this).children().html())
        let answer = poses.eq(i).data("name")

        if (response == answer) {
            score += 1
            correct.push(true)
        } else if (typeof response == "undefined") {
            correct.push(false)
            response = ""
        } else {
            correct.push(false)
        }
        answers.push(answer)
        responses.push(response)
    })

    // Get unused options
    let unusedLabels = $('.quiz-label').filter(':not(.dropped)')
    console.log(unusedLabels)
    let unused = []
    unusedLabels.each( function(i, label) {
        unused.push(label.innerHTML) 
    })
    answerData = {
        "id": data["id"],
        "score": score,
        "answers": answers,
        "responses": responses,
        "correct": correct,
        "unused": unused
    }
    saveAnswers(answerData)
}

// Sends an array of answers to save for question <id>
function saveAnswers(answerData) {
    console.log("saving", answerData)
    $.ajax({
        type: "POST",
        url: "" + data["id"],                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(answerData),
        success: function(result){
            console.log(result["data"])
            loadMatchingResponse(result["data"]["answer_data"])
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
}

// Msatching question: Displays header, images, and empty answer boxes
function showMatchingGraphics(parent, rows, cols) {
    let header = $("<div class='quiz-heading'>").html("Part 1: Match the name to the pose")
    parent.append(header)

    let posenames = []
    for (let i = 0; i < rows; i++) {
        let row = $("<div class='row'>")
        // Create images
        for (let j = 0; j < cols; j++) {
            filepath = data['imgs'][i*cols + j]
            filename = filepath.split("/").pop()
            posename = filename.split(".")[0]
            posenames.push(posename)

            let col = $("<div class='col-md-"+12/cols+" quiz-pose' data-name='"+posename+"'>")
            let img = $("<img />").attr({src: filepath, class: "mx-auto d-block"})
            let label = $("<div class='quiz-label-drop'>")

            col.append(label, img)
            row.append(col)
        }
        parent.append(row, $("<hr>"))
    }
    return posenames
}

// Matching question: Shows answer bank with posnames for options
function showMatchingOpts(parent, posenames) {
    let row = $("<div class='row'>")
    let col = $("<div id='matching-options' class='col-md'>")
    posenames.forEach((name) => {
        let label = $("<div class='quiz-label'>").html(name)
        col.append(label)
    })
    parent.append(row.append(col))
}


// Displays an identifying muscles activated by poses question
function loadMuscleId() {
    c = $("#content")
    header = $("<div class='quiz-heading'>").html("Part 2: Muscles Activated")
    question = $("<div>").html("Drag the name to the diagram.")
    c.append(header,question)
}

// Displays an ordering question
function loadOrdering() {
    c = $("#content")
    header = $("<div class='quiz-heading'>").html("Part 3: Pose Ordering")
    question = $("<div>").html("Drag the name to the diagram.")
    c.append(header,question)
}

// Shuffles an array at random
function shuffle(arr) {
    let rand, i = arr.length 
    while (i != 0) {    // While there remain elements to shuffle.
        // Pick a remaining element, swap with the current element.
        rand = Math.floor(Math.random() * i)
        i--
        [arr[i], arr[rand]] = [arr[rand], arr[i]]
    }
    return arr
}