$(document).ready(function(){
    displayProgress()
    bindHomeBtn()
    bindPrevBtn()
    loadInfo()
})

len = 11

// Displays current progress in the progress bar
function displayProgress() {
    prog = $(".progress-bar")
    percent = 100
    prog.attr("aria-valuenow", percent)
    prog.css("width", percent + "%")
}

function loadInfo() {
}

function bindHomeBtn () {
    $("#home-btn").html("Home")
    $("#home-btn").click(function () {
      window.location.href = "/"
    })
}

function bindPrevBtn() {
    // Add previous button if not the first question
    prevBtn = $("<button id='prev-btn' class='btn btn-purple float-start'>").html("Previous")
    prevBtn.click(function() {
      window.location.href = "/learn/" + len
    })
    $("#quiz-nav").append(prevBtn)
}
