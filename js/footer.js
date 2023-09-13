window.onload = function () {
  document.querySelectorAll(".copyright")[0].innerHTML =
    '<div>©2022 <i class="fa-fw fas fa-heartbeat card-announcement-animation cc_pointer"></i> By Study </div>';
  show_date_time();
  setTimeout(() => {
    document
      .querySelectorAll(".aplayer-icon")[8]
      .addEventListener("click", function () {
        const aplayer = document.querySelectorAll(".aplayer")[0];
        const aplayerLength = aplayer.className.split("aplayer-narrow").length;
        if (aplayerLength == 1) {
          document.getElementById("fps").style.bottom = "10px";
          document.getElementById("fps").style.left = "90px";
        } else {
          document.getElementById("fps").style.bottom = "330px";
          document.getElementById("fps").style.left = "10px";
        }
      });
  }, 500);
};

//本站运行时间，更改自己建立站点的时间
function show_date_time() {
  document.querySelectorAll(".framework-info")[0].style.display = "block";
  document.querySelectorAll(".framework-info")[0].innerHTML =
    '小破站已经安全运行<span id="span_dt_dt" style="color: #fff;"></span>';
  window.setTimeout("show_date_time()", 1000);
  BirthDay = new Date("2023/7/22 0:0:0");
  today = new Date();
  timeold = today.getTime() - BirthDay.getTime();
  sectimeold = timeold / 1000;
  secondsold = Math.floor(sectimeold);
  msPerDay = 24 * 60 * 60 * 1000;
  e_daysold = timeold / msPerDay;
  daysold = Math.floor(e_daysold);
  e_hrsold = (e_daysold - daysold) * 24;
  hrsold = Math.floor(e_hrsold);
  e_minsold = (e_hrsold - hrsold) * 60;
  minsold = Math.floor((e_hrsold - hrsold) * 60);
  seconds = Math.floor((e_minsold - minsold) * 60);
  span_dt_dt.innerHTML =
    "<font style=color:#afb4db>" +
    daysold +
    "</font> 天 <font style=color:#f391a9>" +
    hrsold +
    "</font> 时 <font style=color:#fdb933>" +
    minsold +
    "</font> 分 <font style=color:#a3cf62>" +
    seconds +
    "</font> 秒";
}
