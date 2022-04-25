$(document).ready(function(){
    displayProgress()
    bindHomeBtn()
    bindPrevBtn()
    //loadInfo()
    progressNum()
    createCards()
})

len = 12

function createCards(){
  for (i = 1; i<= 12; i++){
    let col = $("<div class='col-md-2'>")
    let card = $("<div class='flip-card'>")
    let inner = $("<div class='flip-card-inner'>")
    let front = $("<div class='flip-card-front'>")
    let img = $("<img>").attr({src: d[i]["img"], width:'200px'})
    let back = $("<div class='flip-card-back'>")
    let name = $("<p>")
    name.html(d[i]["Name"])
    let views = $("<p class = 'normal_p'>")
    views.html("Viewed: " + d[i]["views"])

    back.append(name)
    back.append(views)
    front.append(img)
    inner.append(front)
    inner.append(back)
    card.append(inner)
    col.append(card)
    if (i <= 6){
      $("#row1").append(col)
    }
    else {
      $("#row2").append(col)
    }


  }

}

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
  let prog = $("<div class='progressNum'>").html("13/13")
  $("#quiz-nav").append(prog)
}