cf = 0;

let temp = document.getElementById("temp");
let formCheck = [document.getElementById("formCheck-1"),
    document.getElementById("formCheck-2"),
    document.getElementById("formCheck-3")];
let lbl = document.querySelector("#lbl");
let mask = document.querySelector("#mask");

function update_lamp_range(num, send) {
    const $valueSpan = $('.valueSpan');
    const $value = $('#customRange');
    if (send) {
        $.ajax({
            type: "POST",
            url: "/api/changeState/led",
            data: {"newState": $value.val()},
            success: function (msg) {
                $valueSpan.html($value.val() + '%');
            },
            error: function (mes) {
                console.log(mes);
                $valueSpan.html(num + '%');
                $value.val(num)
            }
        });
    } else {
        $valueSpan.html(num + '%');
        $value.val(num)
    }
}

function update_temp(num) {
    temp.textContent = num
}

function update_lamp_on_off(on, send) {
    let $lamp = $('#lamp_svg > #light')
    if (send) {
        $.ajax({
            type: "POST",
            url: "/api/changeState/lamp",
            data: {"newState": +on},
            success: function (msg) {
                if (on)
                    $lamp.css('visibility', 'visible');
                else
                    $lamp.css('visibility', 'hidden');
            }
        });
    } else {
        if (on)
            $lamp.css('visibility', 'visible');
        else
            $lamp.css('visibility', 'hidden');
    }
}

function update_value(num) {
    const semi_cf = cf / 2;
    const meter_value = semi_cf - ((num * semi_cf) / 100);

    mask.setAttribute("stroke-dasharray", meter_value + "," + cf);
    lbl.textContent = num + "%";
}

function update_lamp_list(num, lamp_id, send) {
    if (send) {
        $.ajax({
            type: "POST",
            url: "/api/changeState/list_lamp/" + lamp_id,
            data: {"newState": +num},
            success: function (msg) {
                formCheck[lamp_id - 1].checked = num
            }
        });
    } else {
        formCheck[lamp_id - 1].checked = num
    }
}

function update_all_elements(parameters) {
    $.ajax({
        type: "GET",
        url: "/api/getAllData",
        dataType: "json",
        success: function (data) {
            // console.log(data);
            update_lamp_range(data["LED"])
            update_lamp_on_off(data["LAMP"], false)
            update_temp(data["TEMP"])
            update_value(data["VALUE"])
            update_lamp_list(data["LIST_LAMP_1"], 1, false)
            update_lamp_list(data["LIST_LAMP_2"], 2, false)
            update_lamp_list(data["LIST_LAMP_3"], 3, false)
        }
    });
}

$(document).ready(function () {
    const $valueSpan = $('.valueSpan');
    const $value = $('#customRange');
    $valueSpan.html($value.val() + '%');
    $value.on('input change', () => {
        update_lamp_range($value.val(), true)
    });

    let $lamp = $('#lamp_svg > #light')
    $('#lamp_svg').click(function () {
        update_lamp_on_off($lamp.css('visibility') === 'hidden', true);
    });

    $(':checkbox').click(function () {
        update_lamp_list($(this).is(':checked'), $(this)[0].id.split('-')[1], true);
    });
});


$(document).ready(function () {
    const width = document.getElementById('svg-card-body').offsetWidth;
    const height = document.getElementById('svg-card-body').offsetHeight;

    let meter = document.getElementById('meter');
    meter.setAttribute('viewBox', '0 60 ' + (height * 0.618) + ' ' + (width * 0.327));
    // meter.setAttribute('viewBox', '0 50 230 80')

    /* Set radius for all circles */
    const r = width * 0.25;
    const circles = document.querySelectorAll('.circle');
    const total_circles = circles.length;
    for (let i = 0; i < total_circles; i++) {
        circles[i].setAttribute('r', r);
    }

    /* Set meter's wrapper dimension */
    const meter_dimension = (r * 2) + 100;
    const wrapper = document.querySelector("#wrapper-svg");
    wrapper.style.width = meter_dimension + "px";
    wrapper.style.height = meter_dimension / 2 + "px";

    /* Add strokes to circles  */
    cf = 2 * Math.PI * r;
    const semi_cf = cf / 2;
    const semi_cf_1by3 = semi_cf / 3;
    const semi_cf_2by3 = semi_cf_1by3 * 2;
    document.querySelector("#outline_curves")
        .setAttribute("stroke-dasharray", semi_cf + "," + cf);
    document.querySelector("#low")
        .setAttribute("stroke-dasharray", semi_cf + "," + cf);
    document.querySelector("#avg")
        .setAttribute("stroke-dasharray", semi_cf_2by3 + "," + cf);
    document.querySelector("#high")
        .setAttribute("stroke-dasharray", semi_cf_1by3 + "," + cf);
    document.querySelector("#mask")
        .setAttribute("stroke-dasharray", semi_cf + "," + cf);
});

update_all_elements()
setInterval(update_all_elements, 1000);
