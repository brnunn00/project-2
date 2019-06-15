$(document).ready(function () {

    var urlParm = getUrlParameter("baby-id");
    $.get("/api/getbaby/" + urlParm, function (data) {
        console.log("TCL: getBabyData -> data", data)
        if (data) {
            $("#babyNameAge").text(data.baby_name + " - " + getBabyAge(data));
        }
    });

    function getBabyAge(data) {
        babyBirthday = data.baby_birthday;
        if (moment().diff(moment(babyBirthday), 'months') > 30) {
            return moment().diff(moment(babyBirthday), 'years') + ' years';
        } else {
            return moment().diff(moment(babyBirthday), 'months') + ' months';
        }
    }


    // old sleep quick log
    // $('body').on('click', '#sleepQuickLog', function () {
    //     console.log("sleep quick log clicked");
    //     var sleepTime = new Date().toLocaleString(undefined, {
    //         day: 'numeric',
    //         month: 'numeric',
    //         year: 'numeric',
    //         hour: '2-digit',
    //         minute: '2-digit',
    //     });
    //     console.log(sleepTime);
    // });

    $('body').on('click', '#sleepQuickLog', function () {
        event.preventDefault();
        console.log('baby id:' + urlParm)
        postTheEvent('Sleep', '');
    // $('body').on('click', '#quickSleep', function () {
    //     var sleepButton = document.getElementById("quickSleep");
    //     if (sleepButton.value == "Start Sleep") sleepButton.value = "Stop Sleep";
    //     else sleepButton.value = "Start Sleep";
    //     console.log("clicked");
    });

    $('body').on('click', '.quickChange', function () {
        event.preventDefault();
        postTheEvent("Diaper Change", $(this).text());
    });

    $('body').on('click', '#foodQuickLogBottle', function () {
        event.preventDefault();
        postTheEvent("Feeding", 'bottle');
    });

    function postTheEvent(eventName, eventDetail) {
        $.post('/api/quicklog', {
            eventName: eventName,
            babyId: urlParm
        }).then(function (data) {
            if(eventName==='Sleep'){}
            console.log("TCL: EVENT data: ", data)
            postEventDetails(data, eventName, eventDetail , 4, (eventName==='Sleep'));
        });
    }

    function postEventDetails(data, eventName, eventDetail, howMuch, timeBool) {
        //Second: lets add the event details
        $.post('/api/quicklog/feedStarted', {
            eventId: data.id,
            typeOfFeeding: eventDetail,
            howManyOz: howMuch,
            timeStarted: timeBool
        })
            .then(function (data) {
                console.log("TCL: nowPostEventDetails -> Event Detail DAta:", data)
                popupModal(eventName + " event posted successfully", "Success!")
            })
    }

    // app.get('/api/quicklog/sleepingbaby', function(request, response){
    //     db.post
    // })

//       // Get route for retrieving a single post
//   app.get("/api/posts/:id", function(req, res) {
//     // Here we add an "include" property to our options in our findOne query
//     // We set the value to an array of the models we want to include in a left outer join
//     // In this case, just db.Author
//     db.Post.findOne({
//       where: {
//         id: req.params.id
//       },
//       include: [db.Author]
//     }).then(function(dbPost) {
//       res.json(dbPost);
//     });
//   });

    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    function popupModal(message, typeOfModal) {
        $("#errorModal").empty();
        $("body").append($("<div>").addClass("modal fade").attr({ id: "errorModal", role: "dialog", }));
        $("#errorModal").append($("<div>").addClass("modal-dialog").attr({ id: "errDialog", role: "document" }));
        $("#errDialog").append($("<div>").addClass("modal-content").attr("id", "errModalContent"));
        $("#errModalContent").append($("<div>").addClass("modal-header alert-primary").attr("id", "errModalheader"));
        $("#errModalheader").append($("<h5>").addClass("modal-title").attr("id", "errModalTitle").html(typeOfModal));
        $("#errModalContent").append($("<div>").addClass("modal-body").attr("id", "errModalBody").html(message))
        $("#errModalContent").append($("<div>").addClass("modal-footer").attr("id", "errModalFooter"));
        $("#errModalFooter").append($("<button>").addClass("btn btn-secondary").attr({ id: "closeButton", type: "button" }).attr("data-dismiss", "modal").html("close"))
        $("#errorModal").modal("show");
    }

});