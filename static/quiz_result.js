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

    // Quiz incomplete error checking
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

    // Display scores and buttons to return to the quiz sections you missed
    row = $("<div class='row'>")
    col_matching = $("<div class='col-md-4 text-center'>")
    col_ordering = $("<div class='col-md-4 text-center'>")
    col_muscle = $("<div class='col-md-4 text-center'>")
    
    matching = $("<p class='score-display'>").html( Math.round(data["matching_score"]/data["matching_total"] * 100) + "%" )
    ordering = $("<p class='score-display'>").html( Math.round(data["ordering_score"]/data["ordering_total"] * 100) + "%" )
    muscle = $("<p class='score-display'>").html(Math.round(data["muscle_score"]/data["muscle_total"] * 100) + "%" )
    
    matching_text = $("<p class='score-description'>").html("Matching")
    ordering_text = $("<p class='score-description'>").html("Ordering")
    muscle_text = $("<p class='score-description'>").html("Muscle Identification")
    
    matching_btn = $("<button type='button' class='btn btn-outline-purple'>").html("Review")
    matching_btn.click(function() {
        window.location.href = "/quiz/1"
    })
    ordering_btn = $("<button type='button' class='btn btn-outline-purple'>").html("Review")
    ordering_btn.click(function() {
        window.location.href = "/quiz/2"
    })
    muscle_btn = $("<button type='button' class='btn btn-outline-purple'>").html("Review")
    muscle_btn.click(function() {
        window.location.href = "/quiz/4"
    })

    col_matching.append(matching, matching_text, matching_btn)
    col_ordering.append(ordering, ordering_text, ordering_btn)
    col_muscle.append(muscle, muscle_text, muscle_btn)

    row.append(col_matching, col_ordering, col_muscle)
    c.append($("<hr>"), row, $("<br>"), $("<hr>"), $("<br>"))

    // Buttons to go back to learn or to restart
    row = $("<div class='row'>")
    col_restart = $("<div class='col-md-6 text-center'>")
    restart_btn = $("<button type='button' class='btn btn-lg btn-purple'>").html("Retake Quiz")
    restart_btn.click(function() {
        window.location.href = "/quiz/restart"
    })
    col_restart.append(restart_btn)

    col_learn = $("<div class='col-md-6 text-center'>")
    learn_btn = $("<button type='button' class='btn btn-lg btn-purple'>").html("Return to Learn")
    learn_btn.click(function() {
        window.location.href = "/learn/1"
    })
    col_learn.append(learn_btn)

    row.append(col_learn, col_restart)
    c.append(row)

    /*
    header = $("<div class='quiz-heading learn-more'>").html("Areas to improve:")
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
    */
}