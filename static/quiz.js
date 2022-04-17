$(document).ready(function(){
    //$("body").css({"height": "100%", "margin": "0"})
    //$(".container").css({"height": "100%"})

    displayProgress()
    bindPrevBtn()

    if (data["type"] == "matching") {
        if (!data["answered"]) {
            matching()
        }
        else {
            loadMatchingAnswers()
            checkMatching()
        }
    } else if (data["type"] == "muscles") {
        muscleId()
    } else if (data["type"] == "ordering") {
        ordering()
    }

})

// Displays current progress in the progress bar
function displayProgress() {
    prog = $(".progress-bar")
    let percent = (data["id"] / data["len"]) * 100 + ""
    prog.attr("aria-valuenow", percent)
    prog.css("width", percent + "%")
} 

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
function bindNextBtn () {
    $("#next-btn").click(function () {
        if (data["id"] < data["len"]) {
            window.location.href = "/quiz/" + (data["id"] + 1)
        }
    })
}

// Displays a matching name to pose question
function matching() {
    let c = $("#content")
    let header = $("<div class='quiz-heading'>").html("Part 1: Match the name to the pose")
    //let question = $("<div>").html("Drag the name to the diagram.")
    c.append(header)

    displayPoseImgs(c, 2, 4)
    c.append($("<hr>"))
    displayPoseNames(c)

    $("#next-btn").click(function() {
        checkMatching()
    })
    $(".quiz-pose-label").draggable({  revert: "invalid" })
    $(".quiz-blank").droppable({
        accept: function(ui) {
            return $(this).children().length == 0
        },
        drop: function(event, ui) {
            let dropped = ui.draggable
            $(dropped).addClass("dropped")
            $(dropped).detach().css({top: 0,left: 0}).appendTo($(this));
        }
    })
    $("#bank").droppable({
        drop: function(event, ui) {
            let dropped = ui.draggable
            $(dropped).removeClass("dropped")
            $(dropped).detach().css({top: 0,left: 0}).appendTo($(this));
        }
    })
}

function checkMatching() {
    // check responses with answers
    let poses = $('.quiz-pose')
    let score = 0
    let answers = []
    $('.quiz-blank').each(function(i) {
        let response = ($(this).children().html())
        console.log(response)
        let answer = poses.eq(i).data("name")
        answers.push(answer)

        if (typeof response == "undefined") {
            $(this).addClass("incorrect")
        } else if (response == answer) {
            $(this).children().addClass("correct")
            score += 1
        } else {
            $(this).children().addClass("incorrect")
        }
    })
    saveAnswers(answers)

    // Disable draggable labels
    $( ".quiz-pose-label" ).draggable({
        disabled: true
    })

    // Bind next button 
    $("#next-btn").html("Next")
    bindNextBtn()
}

// Sends an array of answers to save for question <id>
function saveAnswers(answers) {
    save_data = {}
    save_data[data["id"]] = answers
    console.log(save_data)
    $.ajax({
        type: "POST",
        url: "" + data["id"],                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(save_data),
        success: function(result){
            console.log("success")
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
}


function displayPoseImgs(parent, rows, cols) {
    let posenames = []
    for (let i = 0; i < rows; i++) {
        let row = $("<div class='row'>")
        // Create images
        for (let j = 0; j < cols; j++) {
            filepath = data['imgs'][i*cols + j]
            filename = filepath.split("/").pop()
            posename = filename.split(".")[0]

            let col = $("<div class='col-md-"+12/cols+" quiz-pose' data-name='"+posename+"'>")
            let img = $("<img />").attr({src: data['imgs'][i*cols + j],
                                        class: "mx-auto d-block"})
            let label = $("<div class='quiz-blank'>")

            col.append(label, img)
            row.append(col)
        }
        parent.append(row)
    }
}

function displayPoseNames(parent) {
    let row = $("<div class='row'>")
    let col = $("<div id='bank' class='col-md'>")
    col.css("min-height", "3rem")

    for (let i = 0; i < 8; i++) {
        filename = data['imgs'][i].split("/").pop()
        posename = filename.split(".")[0]
        let label = $("<div class='quiz-pose-label'>").html(posename)
        col.append(label)
    }
    row.append(col)
    parent.append(row)
}


// Displays an identifying muscles activated by poses question
function muscle() {
    c = $("#content")
    header = $("<div class='quiz-heading'>").html("Part 2: Muscles Activated")
    question = $("<div>").html("Drag the name to the diagram.")
    c.append(header,question)
}

// Displays an ordering question
function ordering() {
    c = $("#content")
    header = $("<div class='quiz-heading'>").html("Part 3: Pose Ordering")
    question = $("<div>").html("Drag the name to the diagram.")
    c.append(header,question)
}