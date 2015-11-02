// Add active class to li in menu
var activeli = $("#menu-content").data("active");
$( "ul#menu-content li:nth-child("+activeli+")").addClass('active');

// For sending ajax request to get new price on booking results

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
        }
    }
});

// On Index page to add room

$("#addroom").on("click",function(){
	var currentrooms = $("input[name='room_count1']").val()
	currentrooms++;
	$("input[name='room_count1']").val(currentrooms)
	var html = '<div class="roominline" data-room-id="'+currentrooms+'">' +
'                            <div class="col-xs-4">'+
'                                <label>'+'Room '+currentrooms+'</label>'+
'                            </div>'+
'                            <div class="col-xs-5">'+
'                                <div class="form-group">'+
'                                    <div class="input-group">'+
'                                        <span class="input-group-addon"><i class="fa fa-users fa-fw"></i></span>'+
'                                        <input name="guestsinroom[]" type="number" min="1" max="3" class="form-control custominput" id="calendar" placeholder="Guests" data-error="Number of guests should be between 1-10. " required>'+
'                                    </div>'+
'                                </div>'+
'                            </div>'+
'                            <div class="col-xs-3 buttonspace">'+
'                                <a class="deleteroom" data-room-id="'+currentrooms+'"><i class="fa fa-times-circle"></i></a>'+
'                            </div>'+
'                        </div>';
	$(".roominlineparent").append(html);


});
$("body").on("click", ".deleteroom", function(e) {
    // console.log($(this));
	var thisroomid = $(this).data("room-id");
    // console.log(thisroomid);
	var currentrooms = $("input[name='room_count1']").val();
    $("div[data-room-id='"+thisroomid+"']").remove();
	$("div.roominline").each(function(i, obj) {
        // console.log(obj);
        if (parseInt($(this).attr('data-room-id'))>parseInt(thisroomid))
        {
            var temp = parseInt($(this).attr('data-room-id'));
            temp-=1;
            $(this).attr('data-room-id', temp);
            $(this).children('.col-xs-4').children('label').html('Room '+temp);
            $(this).children('.col-xs-3').children('a').attr('data-room-id', temp);
        }
    });

	currentrooms--;
	$("input[name='room_count1']").val(currentrooms)
});

//Reload price button on booking history page when user changes no. of rooms and no. of guests
$("body").on("click", ".reloadprice", function(e){
    var postdata = "checkin=" + $("#startdate").val() + "&checkout=" + $("#enddate").val() +
            "&singlebed=" + $("#singlebed").val() + "&doublebed=" + $("#doublebed").val() + "&triplebed=" + $("#triplebed").val();
    $.ajax({
       type: "POST",
       url: "/webpriceapi/" + $("#hotelid").val()+"/",
       data: postdata, // serializes the form's elements.
       success: function(data)
       {
           console.log(data)
            if(data.available===true){
                $(".price").html('Price : Rs '+ data.total +'/-');
                $(".guestdetails_form :input").prop("disabled", false);
            }
           else{
                $(".price").html('<button type="button" class="btn btn-danger" disabled >Unavailable</button>');

            }
       }
     });

});

// Disable hotelbooking form if any field changes, so that we can recheck availability and price
$(".bookingdetails_form :input").change(function() {
    $(".price").html("<a class='btn btn-default reloadprice'><i class='fa fa-refresh'></i> Reload price</a>")
    $(".guestdetails_form :input").prop("disabled", true);
});

//Navigate to bookhotel page when clicked on hotel image and hotel name
$("body").on("click", ".js-clickhotel", function(e){
    var hotelid = $(this).data("hotelid");
    $('*[data-formhotelid="'+hotelid+'"]').submit();
    e.preventDefault();
});

$("#sort_dist").on("click", function(){
    var divList = $("div.searchresultscard.mar10.cards");
    divList.sort(function(a, b){
        return $(a).find(".col-md-2.content").children().attr("dist") - $(b).find(".col-md-2.content").children().attr("dist")
    });
    $("#encap").html(divList);
});
