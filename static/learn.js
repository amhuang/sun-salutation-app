$(document).ready(function(){
    updateDate()
    displayProgress()
    bindNextBtn()
    bindPrevBtn()
    loadInfo()
})

len = 11

function updateDate(){
  userData = {
      "id": d["id"],
      "Date": Date()
  }
  $.ajax({
      type: "POST",
      url: "/update_time",
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
    let img = $("<img />").attr({src: filepath, width:'100%'})
    pcol.append(img)
    row.append(pcol)

    let col = $("<div class='col-md-6'>")
    let desc_title = $("<div class=description-title >").html("Directions:")
    col.append(desc_title)
    d["Directions"].forEach(function(m){
        let direction = $("<div class='quiz-question bullets'>").html("        -" + m)
        col.append(direction)
      })
    row.append(col)
    c.append(row)

    let muscles_title = $("<div class=description-title >").html("Muscles:")
    col.append(muscles_title)
    d["Muscles"].forEach(function(m){
      let muscle = $("<div class='quiz-question bullets'>").html("        -" + m)
      col.append(muscle)
    })
    row.append(col)
    c.append(row)
    // let subname = $("<div class='quiz-question'>").html(d["Name"])
    // c.append($("<hr>"))
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
