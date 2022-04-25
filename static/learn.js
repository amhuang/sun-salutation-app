$(document).ready(function(){
    updateDate()
    displayProgress()
    bindNextBtn()
    bindPrevBtn()
    loadInfo()
})

len = 12

function updateDate(){
  userData = {
      "id": d["id"],
      "viewed": "1"
  }
  $.ajax({
      type: "POST",
      url: "/update_views",
      dataType : "json",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(userData),
      success: function(result){
        console.log("Success");
      },
      error: function(request, status, error){
          console.log("Error");
          console.log(request)
          console.log(status)
          console.log(error)
      }
  });
}

function displayProgress() {
    prog = $(".progress-bar")
    if (d["id"]) {
        percent = (d["id"] / (len+1)) * 100
    } else {
        percent = 100
    }
    prog.attr("aria-valuenow", percent)
    prog.css("width", percent + "%")
}

function loadInfo() {
    $("#content").empty()
    let c = $("#content")
    let header = $("<div class='quiz-heading'>").html(d["Name"])
    c.append(header)

    let row = $("<div class='row '>")
    let pcol = $("<div class='col-md-6'>")
    let filepath = d['gif'] +".gif"
    let img = $("<img class='learnImg'/>").attr({src: filepath, width:'100%'})
    pcol.append(img)
    let desc_title = $("<div class=description-title >").html("Directions:")
    pcol.append(desc_title)

    d["Directions"].forEach(function(m){
        let direction = $("<div class='quiz-question bullets'>").html("        - " + m)
        pcol.append(direction)
    })
    row.append(pcol)
    c.append(row)

    let mcol = $("<div class='col-md-6'>")
    let mfilepath = d['muscleImg']
    let mImg = $("<img class='muscleimg'/>").attr({src: mfilepath})
    mcol.append(mImg)
    let muscles_title = $("<div class=description-title >").html("Muscles:")
    mcol.append(muscles_title)

    d["Muscles"].forEach(function(m){
        let muscle = $("<div class='quiz-question bullets'>").html("        - " + m)
        mcol.append(muscle)
    })
    row.append(mcol)
}

function bindNextBtn () {
    $("#next-btn").html("Next")
    $("#next-btn").click(function () {
        if (d["id"] < len) {
            //console.log("redirecting to", "/quiz/" + (data["id"] + 1))
            num = parseInt(d["id"]) +1
            window.location.href = "/learn/" + (num)
        }
        else if (d["id"] == len) {
            window.location.href = "/learn_order"
        }
    })
}

function bindPrevBtn() {
    // Add previous button if not the first question
    if (1 < d["id"]) {
        prevBtn = $("<button id='prev-btn' class='btn btn-purple float-start'>").html("Previous")
        prevBtn.click(function() {
            num = parseInt(d["id"]) -1
            window.location.href = "/learn/" + (num)
        })
        $("#quiz-nav").append(prevBtn)
    }
}
