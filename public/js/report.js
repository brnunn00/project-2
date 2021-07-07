$(document).ready(function () {

    var urlParm = getUrlParameter("baby-id");
    var babyList = $(".babyRows");
    var babyContainer = $(".baby-container");
    console.log(urlParm);
    getBabyObj(urlParm);




function getBabyObj(id){
    $.get("/api/getbaby/" + id, function (data) {
if (data){
    $("#babyNameDisp").text(data.baby_name)
    getEvents(id);
    } else {
    alert("couldn't find a baby");
        
    }
})
}
    function getEvents(urlParm){
    $.get("/api/getbabyevents/" + urlParm, function (data) {
        var rowsToAdd= [];
        console.log("TCL: getBabyEventData -> data", data)
        if (data) {
            for (var i = 0; i < data.length; i++) {
                rowsToAdd.push(createBabyRowSelector(data[i]));
            }
            console.log(rowsToAdd)
            renderBabiesList(rowsToAdd);
        }
    });
}

function createBabyRowSelector(bbData){
    var newTr = $("<tr>");
    newTr.data("babe", bbData.id);
    var eventAt = $("<td>");
    if (bbData.EventDetails[0] != undefined && bbData.EventDetails[0].createdAt != '' && bbData.EventDetails[0].createdAt != undefined){
  
        eventAt.text(moment(bbData.EventDetails[0].createdAt).format("YYYY/MM/DD"));
    }else{
    eventAt.text(moment(bbData.createdAt).format("YYYY/MM/DD"));
    }
    
    eventAt.appendTo(newTr);
    var eventName = $("<td>");
    eventName.text(bbData.event_type_name);
    eventName.appendTo(newTr)
    if (bbData.EventDetails[0] != undefined){
    var eventDetailString = $("<td>");
    eventDetailString.text(typeDisplay(bbData.EventDetails[0].string_value));
    eventDetailString.appendTo(newTr)
    var eventDetailQuantity = $("<td>");
    eventDetailQuantity.text(getQuanType(bbData.event_type_name, bbData.EventDetails[0].integer_value));
    eventDetailQuantity.appendTo(newTr)
    } else {
        var emptyCell = $("<td>").appendTo(newTr);
        var emptyCellTwo = $("<td>").appendTo(newTr);
    }
    
    return newTr;
}
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

function getQuanType(type, amount){
    if (type == 'Feeding'){
    return (amount+ " Ounces");
    } else{
        return '';
    }
}
function typeDisplay(sigh){
    return sigh.charAt(0).toUpperCase() + sigh.substring(1)
}
function renderBabiesList(rows) {
    // babyList.children().not(":last").remove();
    // babyContainer.children(".alert").remove();

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
    alertDiv.text("Register an event first");
    babyContainer.append(alertDiv);
  }

});