

$(document).ready(function () {

  var babyList = $(".babyRows");
  var babyContainer = $(".baby-container");

  getBabyData();
  function getBabyData() {
    //id should be for account. get all babies associated. 

    $.get("/api/getbabies", function (data) {
      console.log("TCL: getBabyData -> data", data)
      if (data) {
        console.log("found a baby");
        var rowsToAdd = [];
        for (var i = 0; i < data.length; i++) {
          rowsToAdd.push(createBabyRowSelector(data[i]));
        }
        console.log(rowsToAdd)
        renderBabiesList(rowsToAdd);
        // babyTodayPage();

      }
    });
  }

  function getBabyAge(bbData) {
    babyBirthday = bbData.baby_birthday;
    if (moment().diff(moment(babyBirthday), 'months') > 30) {
      return moment().diff(moment(babyBirthday), 'years') + ' years';
    } else {
      return moment().diff(moment(babyBirthday), 'months') + ' months';
    }

  }


  function createBabyRowSelector(bbData) {
    getBabyAge(bbData);
    console.log(bbData.baby_name)
    var newTr = $("<tr>");
    newTr.data("babe", bbData.id);
    var babyNameTD = $("<td>");
    babyNameTD.text(bbData.baby_name);
    babyNameTD.appendTo(newTr)
    var babyAgeTD = $("<td>");
    babyAgeTD.text(getBabyAge(bbData));
    babyAgeTD.appendTo(newTr)
    var babyAgeLU = $("<td>");
    babyAgeLU.text(moment(bbData.updatedAt).format("YYYY/MM/DD"));
    babyAgeLU.appendTo(newTr)
    var babySelector = $("<td>");
    babySelector.addClass("babySelector")
    babySelector.data("id", bbData.id)
    var babyText = $('<a href="/main?baby-id=' + bbData.id + '">View Baby</a>');
    babyText.addClass("babyLink");
    babyText.appendTo(babySelector);
    babySelector.appendTo(newTr);
    return newTr;
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
    alertDiv.text("You must create a BABY (again).");
    babyContainer.append(alertDiv);
  }

  // function babyTodayPage() {
  //   // $("#errorModal").empty();
  //   $("body").append($("<div>").addClass("container baby mt-4").attr({ id: "babyInfoContainer" }));
  //   $("#babyInfoContainer").append($("<div>").addClass("row justify-content-center").attr("id", "firstRow"));
  //   // $("babyInfoContainer").append($("<hr>"));
  //   $.get("/api/getbabies", function (data) {
  //     callNextAPI(data)
  //   })
  // }

  // function callNextAPI(data) {

  //   let arrayObj;
  //   console.log("TCL: babyTodayPage -> data", data)
  //   for (let i = 0; i < data.length; i++) {
  //     $.get("/api/getevents/timeSorted/:" + data.account_id, function (results) {
  //       for (let j = 0; j < results.length; j++) {
  //         arrayObj = {
  //           babyName: data[i].baby_name,
  //           babyEvent: results[j].event_type_name,
  //           babyEventTime: results[j].EventDetails[0].createdAt,
  //           babyEventDetail: results[j].EventDetails[0].string_value,
  //           babyEventDetailQty: results[j].EventDetails[0].integer_value
  //         }
  //         // newArray.push(arrayObj);
  //         createArray(arrayObj)
  //       }
  //     });
  //   }
  //   sortThisArray(newArray);
  // }
  // let newArray = [];
  // function createArray(arrayObj){
  //   newArray.push(arrayObj)
  //   console.log("TCL: createTodayPageForUser -> arrayObj", arrayObj)
    
  // }

  // function sortThisArray(newArray){
  //   newArray.sort(function(a,b){
  //     // return moment(a.babyEventTime) - moment(b.babyEventTime)
  //     console.log('a.babytimeEvent: '+ a.babyEventTime);
  //     console.log('b.babytimeEvent: '+ b.babyEventTime);
  //     return moment.utc(a.babyEventTime).diff(moment.utc(b.babyEventTime));
  //   })
  //   createTodayPage(newArray)
  // }

  // function createTodayPage(newArray) {
  //   console.log('Inside today Page:::::');
  //   console.log("TCL: createTodayPage -> newArray", newArray)
    
  // }










});
