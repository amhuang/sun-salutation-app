$(document).ready(function(){
    displayProgress()
    bindHomeBtn()
    bindPrevBtn()
    loadInfo()
    progressNum()
})

len = 12

// Displays current progress in the progress bar
function displayProgress() {
    prog = $(".progress-bar")
    percent = 100
    prog.attr("aria-valuenow", percent)
    prog.css("width", percent + "%")
}

function loadInfo() {
  for (let i = 1; i <= len; i++) {
    let card = $("#"+i)
    let line = $("<p class='normal_p'>").html("Viewed: " + d[i]["views"])
    card.append(line)
    // card.append("HI")
  }

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


function progressNum(){
  let prog = $("<div class='progressNum'>").html("12/12")
  $("#quiz-nav").append(prog)
}