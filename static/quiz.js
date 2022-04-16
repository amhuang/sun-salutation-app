$(document).ready(function(){

    displayProgress()

    if (data["type"] == "matching") {
        matching()
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

// Displays a matching name to pose question
function matching() {
    let c = $(".container")
    let header = $("<div class='quiz-heading'>").html("Part 1: Pose Names")
    let question = $("<div>").html("Drag the name to the diagram.")
    c.append(header,question)

    displayPoseImgs(c, 2, 4)
    c.append($("<hr>"))
    displayPoseNames(c, 2, 4)

    $(".quiz-pose-name").draggable({
        addClasses: false
    })
}

function displayPoseNames(parent, rows, cols) {
    for (let i = 0; i < rows; i++) {
        let row = $("<div class='row'>")
        for (let j = 0; j < cols; j++) {
            
            let col = $("<div class='col-md'>")
            filename = data['imgs'][i*cols + j].split("/").pop()
            posename = filename.split(".")[0]
            console.log(posename)
            let label = $("<div class='quiz-pose-name'>").html(posename)
            col.append(label)
            row.append(col)
        }
        parent.append(row)
    }
}

function displayPoseImgs(parent, rows, cols) {
    for (let i = 0; i < rows; i++) {
        let row = $("<div class='row'>")
        for (let j = 0; j < cols; j++) {
            let col = $("<div class='col-md quiz-img'>")
            let img = $("<img />").attr({src: data['imgs'][i*cols + j]})

            col.append(img)
            row.append(col)
        }
        parent.append(row)
    }
}

// Displays an identifying muscles activated by poses question
function muscle() {
    c = $(".container")
    header = $("<div class='quiz-heading'>").html("Part 2: Muscles Activated")
    question = $("<div>").html("Drag the name to the diagram.")
    c.append(header,question)
}

// Displays an ordering question
function ordering() {
    c = $(".container")
    header = $("<div class='quiz-heading'>").html("Part 3: Pose Ordering")
    question = $("<div>").html("Drag the name to the diagram.")
    c.append(header,question)
}