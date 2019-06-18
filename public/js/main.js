$(document).ready(function () {

    var urlParm = getUrlParameter("baby-id");
    //append reports button with baby id attached
    var eleLi = $("#reportLi");
    
    var babyRep = $('<a href="/report?baby-id=' +urlParm + '"><i class="fas fa-border-all"></i> View Reports</a>');
    babyRep.addClass("babyRep nav-link");
    babyRep.appendTo(eleLi);
    $.get("/api/getbaby/" + urlParm, function (data) {
        console.log("TCL: getBabyData -> data", data)
        if (data) {
            $("#babyNameAge").text(data.baby_name + " - " + getBabyAge(data));
            // if (data.baby_img_url != ''){
            //    var imgBaby = $("<img>")
            //    imgBaby.attr("src",data.baby_img_url);
            //    imgBaby.attr("width","150px");
            //    imgBaby.attr("height","150px");
            //    imgBaby.appendTo(".babyPic")
                
            // }
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

    $('body').on('click', '#quickSleep', function () {
        event.preventDefault();
        console.log('baby id:' + urlParm)
        postTheEvent('Sleep', '', 0);
    });

    $('body').on('click', '#sleepDetailedLogSubmit', function () {
        event.preventDefault();
        postManualSleep(($('#sleepType').val() === 'Nap' ? 2 : 8), moment($('#sleepDetailTime').val().trim()).format('YYYY-MM-DD HH:mm:ss z'));
    });

    $('body').on('click', '#feedingDetailedLogSubmit', function () {
        event.preventDefault();
        postManualFeedign($('#foodAmount').val() ,$('#foodType').val(), moment($('#foodDetailTime').val().trim()).format('YYYY-MM-DD HH:mm:ss z'));
    });
    


    $('body').on('click', '.quickChange', function () {
        event.preventDefault();
        postTheEvent("Diaper Change", $(this).text(), 0);
    });

    $('body').on('click', '#foodQuickLogBottle', function () {
        event.preventDefault();
        postTheEvent("Feeding", 'bottle', 4, false);
    });

    $('body').on('click', '#changeDetailedLogSubmit', function () {
        event.preventDefault();
        postManualChange($('#changeType').val(), moment($('#changeDetailTime').val().trim()).format('YYYY-MM-DD HH:mm:ss z'));
    });

    function postManualChange(typeOfChange, createdDateTime){
        $.post('/api/quicklog', {
            eventName: 'Feeding',
            babyId: urlParm
        }).then(function (data) {
            console.log("TCL: EVENT data: ", data)
            $.post('/api/quicklog/diaperChange', {
                eventId: data.id,
                typeOfBM: typeOfChange,
                createdDateTime: createdDateTime
            })
                .then(function (data) {
                    console.log("TCL: nowPostEventDetails -> Event Detail DAta:", data)
                    popupModal('Manual Feeding event posted successfully', "Success!")
                })
            // ?postEventDetails(data, eventName, eventDetail , howMuch, (eventName==='Sleep'));
        });
    }
    

    function postManualFeedign(howMuch, typeOfFeeding, createdDateTime){
        $.post('/api/quicklog', {
            eventName: 'Feeding',
            babyId: urlParm
        }).then(function (data) {
            console.log("TCL: EVENT data: ", data)
            $.post('/api/quicklog/feedStarted', {
                eventId: data.id,
                typeOfFeeding: typeOfFeeding,
                howManyOz: howMuch,
                sleepingOrNot: false,
                createdDateTime: createdDateTime
            })
                .then(function (data) {
                    console.log("TCL: nowPostEventDetails -> Event Detail DAta:", data)
                    popupModal('Manual Feeding event posted successfully', "Success!")
                })
            // ?postEventDetails(data, eventName, eventDetail , howMuch, (eventName==='Sleep'));
        });
    }

    function postManualSleep(howLong, createdDateTime){
        $.post('/api/quicklog', {
            eventName: 'Sleep',
            babyId: urlParm
        }).then(function (data) {
            console.log("TCL: EVENT data: ", data)
            $.post('/api/quicklog/sleepStarted', {
                eventId: data.id,
                // typeOfFeeding: 'Sleep',
                sleepDuration: howLong,
                sleepingOrNot: false,
                createdDateTime: createdDateTime
            })
                .then(function (data) {
                    console.log("TCL: nowPostEventDetails -> Event Detail DAta:", data)
                    popupModal('Manual sleep event posted successfully', "Success!")
                })
            // ?postEventDetails(data, eventName, eventDetail , howMuch, (eventName==='Sleep'));
        });
    }

    

    function postTheEvent(eventName, eventDetail, howMuch) {
        $.post('/api/quicklog', {
            eventName: eventName,
            babyId: urlParm
        }).then(function (data) {
            console.log("TCL: EVENT data: ", data)
            postEventDetails(data, eventName, eventDetail , howMuch, (eventName==='Sleep'));
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


    // Setting Up Last-Five Chart
    var urlParm = getUrlParameter("baby-id");
    var babyList = $(".babyRows");
    var babyContainer = $(".baby-container");

    getBabyData();
    function getBabyData() {
        //id should be for account. get all babies associated. 

        $.get("/api/getevents/" + urlParm, function (data) {
            console.log("TCL: getBabyData -> data", data)
            if (data) {
                console.log("found a baby");
                var rowsToAdd = [];
                for (var i = 0; i < data.length; i++) {
                    rowsToAdd.push(createBabyRowSelector(data[i]));
                }
                console.log(rowsToAdd)
                renderBabiesList(rowsToAdd);

            }
        });
    }

    function createBabyRowSelector(bbData) {
        getBabyAge(bbData);
        console.log(bbData.event_type_name)
        var newTr = $("<tr>");
        newTr.data("babe", bbData.id);
        var babyNameTD = $("<td>");
        babyNameTD.text(bbData.event_type_name);
        babyNameTD.appendTo(newTr)
        
        var babyAgeLU = $("<td>");
        babyAgeLU.text(moment(bbData.updatedAt).format("hh:mm a"));
        babyAgeLU.appendTo(newTr)
    
     
        return newTr;
    }

    function renderBabiesList(rows) {
        // babyList.children().not(":last").remove();
        babyContainer.children(".alert").remove();

        if (rows.length > 0) {
            console.log(rows + babyList);
            babyList.append(rows);

        }
        else {
            renderEmpty();
        }
    }

    function renderEmpty() {
        var alertDiv = $("<div>");
        alertDiv.addClass("alert alert-danger");
        alertDiv.text("You must add events (again).");
        babyContainer.append(alertDiv);
    }







});