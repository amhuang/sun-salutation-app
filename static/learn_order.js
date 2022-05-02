$(document).ready(function(){
    createCards()
    displayProgress()
    bindHomeBtn()
    bindPrevBtn()
    //loadInfo()
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

function createCards(){
  min = d[1]["views"]
  max = d[1]["views"]
  for (i = 2; i<= 12; i++) {
    if (d[i]["views"] < min) {
      min = d[i]["views"]
    }
    if (d[i]["views"] > max) {
      max = d[i]["views"]
    }
  }


  for (i = 1; i<= 12; i++){
    let col = $("<div class='col-md-2'>")
    let card = $("<div class='flip-card'>")
    let inner = $("<div class='flip-card-inner'>")
    if (d[i]["views"] == max){
      inner.attr("style", "box-shadow: 0 4px 8px 0 green")
    }
    else if (d[i]["views"] == min){
      inner.attr("style", "box-shadow: 0 4px 8px 0 red")
    }
    let front = $("<div class='flip-card-front'>")
    let order = $("<div class='order_text'>")
    order.html(i)
    let img = $("<img>").attr({src: d[i]["img"], width:'200px'})
    let back = $("<div class='flip-card-back'>")
    let name = $("<p>")
    name.html(d[i]["Name"])
    let views = $("<p class = 'normal_p'>")
    views.html("Viewed: " + d[i]["views"])
    let review = $("<button type='button' class='btn btn-in-purple'>")
    review.html("Review")
    var j = i
    makeReviewBtn(j, review)

    back.append(name)
    back.append(views)
    back.append(review)
    front.append(img)
    inner.append(front)
    inner.append(back)
    card.append(inner)
    col.append(card)
    col.append(order)
    if (i <= 6){
      $("#row1").append(col)
    }
    else {
      $("#row2").append(col)
    }
  }
}

function makeReviewBtn(j, review){
  review.click(function(){
    window.location.href = "/learn/" + j
  })
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
