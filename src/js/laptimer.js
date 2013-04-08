(function (laptimer, $, undefined) {
  var interval, startTime, lastLap, lapCount;

  var HOUR = 1000 * 60 * 60;
  var MIN  = 1000 * 60;
  var SEC  = 1000;

  function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
  };


  function parseTime(elapsed, now) {
    var hours = parseInt(elapsed / HOUR);
    elapsed %= HOUR;
    var mins = parseInt(elapsed / MIN);
    elapsed %= MIN;
    var secs = parseInt(elapsed / SEC);
    var ms = elapsed % SEC;
    
    return {
      time: now,
      hours: hours,
      minutes: mins,
      seconds: secs,
      millis: ms
    };
  };

  laptimer.Watch = {
    init : function () {
      $("#start-btn").click(this.startHandler);
      $("#lap-btn").click(this.lapHandler);
      $("#stop-btn").click(this.stopHandler);
    },

    initInContext : function () {
      if ($("#supporters_view").length > 0) {
        rally.SupportersView.init();
      }
    },

    startHandler : function () {
      $("#lap-btn").toggleClass("hide");
      $("#start-btn").toggleClass("hide");
      laptimer.Watch.startClock();
    },

    lapHandler : function () {
      
      var elapsed = laptimer.Watch.getElapsed();
      // var hour = zeroPad(elapsed.hours, 2);
      // var min = zeroPad(elapsed.minutes, 2);
      // var sec = zeroPad(elapsed.seconds, 2);
      // var mill = zeroPad(elapsed.millis, 3);
      // var timeStr = hour + ":" + min + ":" + sec + "." + mill;

      var durationTime = elapsed.time - lastLap;
      var duration = parseTime(durationTime);
      hour = (duration.hours === 0) ? "" : duration.hours + "h";
      min = (duration.minutes === 0) ? "" : duration.minutes + "m";
      sec = (duration.seconds === 0) ? "" : duration.seconds + "s ";
      mill = zeroPad(duration.millis, 3);
      var durStr = hour + min + sec + "." + mill;

      $("#laps").prepend(
          "<div class='record'>" +
          // "<span class='lap'>" + timeStr + "</span>" +
          "<span class='lap'>lap " + lapCount + "</span>" +
          "<span class='lap duration'>" + durStr + "</span>" +
          "</div>"
        );
      $("#laps .record:first").fadeIn("slow");
      lastLap = elapsed.time;
      lapCount += 1;
    },

    stopHandler : function () {
      if ($("#start-btn").hasClass("hide")) {
        clearInterval(interval);
        $("#lap-btn").toggleClass("hide");
        $("#start-btn").toggleClass("hide");
      }
    },

    getElapsed : function () {
      var now =  new Date().getTime();
      var elapsed = now - startTime;
      
      return parseTime(elapsed, now);
    },

    updateClock : function() {
      var elapsed = laptimer.Watch.getElapsed();
      $(".hour").text(zeroPad(elapsed.hours, 2));
      $(".minute").text(zeroPad(elapsed.minutes, 2));
      $(".second").text(zeroPad(elapsed.seconds, 2));
      $(".milli").text(zeroPad(elapsed.millis, 3));
    },

    startClock : function () {
      lapCount = 0;
      startTime = new Date().getTime();
      lastLap = startTime;
      var tickInMilli = 78;
      interval = setInterval(laptimer.Watch.updateClock, tickInMilli);
      $("#laps").empty();
    },
  };

  $(function () {
    if ($("#laptimer").size() > 0) {
      laptimer.Watch.init();
    }
  });

})(window.laptimer = window.laptimer || {}, jQuery);