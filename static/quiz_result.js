$(document).ready(function(){
    
    showResults()
})

function bindPrevBtn() {
    prevBtn = $("<button id='prev-btn' class='btn btn-purple float-start'>").html("Previous")
    prevBtn.click(function() {
        window.location.href = "/quiz/" + (data["prev"])
    })
    $("#quiz-nav").append(prevBtn)
}

function showResults() {
    c = $("#content")
    if (data["incomplete"] > 0) {
        err = "The quiz is incomplete. Continue where you left off and complete the quiz to see your results."
        c.append($("<p>").html(err))

        resume = $("<button id='prev-btn' class='btn btn-purple float-middle'>").html("Resume Quiz")
        resume.click(function() {
            window.location.href = "/quiz/" + (data["incomplete"])
        })
        $("#quiz-nav").append(resume)
        return
    }

    matching = "Matching Score: " + data["matching_score"] + "/" + data["matching_total"]
    ordering = "Ordering Score: " + data["ordering_score"] + "/" + data["ordering_total"]
    muscle = "Muscle Identification Score: " + data["muscle_score"] + "/" + data["muscle_total"]
    
    c.append($("<p>").html(matching))
    c.append($("<p>").html(ordering))
    c.append($("<p>").html(muscle))
    bindPrevBtn()
}