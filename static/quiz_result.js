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

    let header = $("<div class='quiz-heading learn-more'>").html("Areas to improve:")
    c.append(header)

    if(data["matching_score"]<=data["ordering_score"] && data["matching_score"]<=data["muscle_score"]){
        let area = $("<div class='learn-more padding'>").html("- Matching the names to the poses")
        c.append(area)
    }
    else if(data["ordering_score"]<=data["matching_score"] && data["ordering_score"]<=data["muscle_score"]){
        let area = $("<div class='learn-more padding'>").html("- Ordering the poses of Sun Salutation")
        c.append(area)
    }
    else if(data["muscle_score"]<=data["ordering_score"] && data["muscle_score"]<=data["matching_score"]){
        let area = $("<div class='learn-more padding'>").html("- Identifying the muscle groups for each pose")
        c.append(area)
    }
    bindPrevBtn()
}