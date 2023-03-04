$(document).ready(function () {
    loadData()
    initEvents()
})
let limit = 10; //Số nhân viên mỗi trang cơ bản 
let offset = 1; //Số trang cơ bản
let start = 0; // Điểm bắt đầu của trang 
let end = limit; // Điểm kết thúc của trang
const totalPage = Math.ceil(472 / limit) // Tổng số trang
var formMode = "add" // Chế độ xử lý tùy thuộc vào hành động
var chkbox = "<input type='checkbox'/>" //check box
// dropdown menu
var dropdown = "<div class='dropdown'> <div class='drop-interact'> <div id='dropdown' class='dropdown-text'>Sửa</div> <button class='dropbtn'> <i class='fa fa-caret-down'></i> </button> </div> <div id='dropdown-content' class='dropdown-content'> <a class='clone' href='#'>Nhân bản</a> <a class='delete' href='#'>Xóa</a> </div> </div>"


// Function Load data
function loadData() {
    $.ajax({
        type: "GET",
        async: false,
        url: `http://localhost:5236/api/Employees`,
        success: function (res) {
            //Đầu tiên ta làm rỗng phần thân của table
            $('table#database-table tbody').empty();
            //Lấy các header của table
            let ths = $('table#database-table thead th');
            // Lấy các dữ liệu được tải về từ url ở trên
            res.map((user, index) => {
                // Template cho các thành phần trong table body
                var trHTML = $(`<tr></tr>`);
                for (const th of ths) {
                    //Lấy ra các giá trị propValue ở trong các header của table
                    const propValue = $(th).attr("propValue");
                    //Lấy ra các giá trị format ở trong các header của table
                    const format = $(th).attr("format")
                    let value = null;
                    //Gán giá trị tương ứng với các propValue
                    if (propValue == "sort") {
                        value = chkbox;
                    }
                    else if (propValue == "function") {
                        value = dropdown
                    }
                    else {
                        value = user[propValue];
                    }
                    //Đổi format dựa tương ứng với các format được lấy ra ở trên 
                    switch (format) {
                        case "date":
                            value = formatDate(value);
                            value = removeNull(value)
                            break;
                        case "money":
                            value = Math.round(Math.random(1000) * 10000000)
                            value = formatMoney(value);
                            value = removeNull(value)
                            break;
                        case "format":
                            value = removeNull(value)
                            break;
                        default:
                            break;
                    }
                    //Đưa các giá trị vừa lấy ra ở trên và đưa và thành phần trong body
                    let thHTML = `<th>${value}</th>`;
                    trHTML.append(thHTML);
                }
                // Gán giá trị của các thành phần của các dữ liệu ở trên vào các biến cụ thể
                $(trHTML).data("code", user.employeeCode);
                $(trHTML).data("entity", user);
                //Đưa các thành phần ở trên vào table body
                $('table#database-table tbody').append(trHTML)
            })
        }
    })
}

// Return giá trị phân trang
function getCurrentPage(offset) {
    start = (offset - 1) * limit
    end = offset * limit;
}

//Function Phân trang
function Pagination() {
    $.ajax({
        type: "GET",
        async: false,
        url: `http://localhost:5236/api/Employees`,
        success: function (res) {
            $('table#database-table tbody').empty();
            let ths = $('table#database-table thead th');
            users = res.map((user, index) => {
                // Giới hạn sô lượng dữ liệu lấy ra từ url ở trên dựa vào điểm bắt đầu và điểm kết thúc của 1 trang
                if (index >= start && index < end) {
                    var trHTML = $(`<tr></tr>`);
                    for (const th of ths) {
                        const propValue = $(th).attr("propValue");
                        const format = $(th).attr("format")
                        let value = null;
                        if (propValue == "sort") {
                            value = chkbox;
                        }
                        else if (propValue == "function") {
                            value = dropdown
                        }
                        else {
                            value = user[propValue];
                        }
                        switch (format) {
                            case "date":
                                value = formatDate(value);
                                value = removeNull(value)
                                break;
                            case "money":
                                value = Math.round(Math.random(1000) * 10000000)
                                value = formatMoney(value);
                                value = removeNull(value)
                                break;
                            case "format":
                                value = removeNull(value)
                                break;
                            default:
                                break;
                        }
                        let thHTML = `<th>${value}</th>`;
                        trHTML.append(thHTML);
                    }
                    $(trHTML).data("code", user.employeeCode);
                    $(trHTML).data("entity", user);
                    $('table#database-table tbody').append(trHTML)
                }
            })
        }
    })
}

//Function Lưu dữ liệu vào bộ dữ liệu
function EmpsaveData() {
    //Lấy các thông tin trong những input 
    let inputs = $("#dlgEmplyeeInfo input, #dlgEmplyeeInfo select");
    //Tạo một tuple rỗng 
    var employee = {};
    //Chuẩn bị giá trị để gán
    var employeeCode = null
    for (const input of inputs) {
        const propValue = $(input).attr("propValue")
        if (propValue == "employeeCode") {
            let value = input.value;
            employeeCode = value
            employee[propValue] = value;
            table = document.getElementById("database-table")
            //Đặt các giá trị vừa lấy vào các điều kiện để chuẩn bị nhập vào bộ dữ liệu
            //Không đáp ứng được điều kiện sẽ bị nhảy ra ngoài và hiện thông báo
            if (!value) {
                $(input).addClass('input-error')
                $(input).attr('title', ' Dữ liệu bạn nhập không phù hợp')
                document.getElementById('dialog-error__content').innerHTML = `${document.getElementById('emp-input').innerHTML} không được để trống`
                $("#dlgError").show()
                break
            }
            else if (formMode == "edit") {
                let value = input.value;
                employeeCode = value
                employee[propValue] = value;
            }
            else {
                for (var i = 1, row; row = table.rows[i]; i++) {
                    tableElem = row.cells[1].innerHTML
                    if (value == tableElem) {
                        $(input).addClass('input-error')
                        $(input).attr('title', ' Dữ liệu bạn nhập không phù hợp')
                        document.getElementById('dialog-error__content').innerHTML = `${document.getElementById('emp-input').innerHTML} không được để trùng`
                        $("#dlgError").show()
                        break
                    }
                }
            }
        }
        else if (propValue == "employeeName") {
            let value = input.value;
            employee[propValue] = value;
            if (!value) {
                $(input).addClass('input-error')
                $(input).attr('title', ' Dữ liệu bạn nhập không phù hợp')
                document.getElementById('dialog-error__content').innerHTML = `${document.getElementById('name-input').innerHTML} không được để trống`
                $("#dlgError").show()
                break
            }
        }
        else if (propValue == "birthDate") {
            //Chuyển đổi giá trị date được format ở trên để phù hợp với dữ liệu đưa vào và yêu cầu của new Date
            let value = input.value;
            date = value.replace(/(..).(..).(....)/, "$2/$1/$3")
            Datedate = new Date(date)
            datejson = Datedate.toJSON()
            employee[propValue] = datejson;
            curr = new Date()
            if (!value) {
                $(input).addClass('input-error')
                $(input).attr('title', ' Dữ liệu bạn nhập không phù hợp')
                document.getElementById('dialog-error__content').innerHTML = `${document.getElementById('birth-input').innerHTML} không được để trống`
                $("#dlgError").show()
                break
            } else if (Datedate > curr) {
                $(input).addClass('input-error')
                $(input).attr('title', ' Dữ liệu bạn nhập không phù hợp')
                document.getElementById('dialog-error__content').innerHTML = `${document.getElementById('birth-input').innerHTML} không hợp lệ`
                $("#dlgError").show()
                break
            }
        }
        else if (propValue == "departmentName") {
            let value = input.value;
            employee[propValue] = value;
            if (!value) {
                $(input).addClass('input-error')
                $(input).attr('title', ' Dữ liệu bạn nhập không phù hợp')
                document.getElementById('dialog-error__content').innerHTML = `${document.getElementById('dept-input').innerHTML} không được để trống`
                $("#dlgError").show()
                break
            }
        }
        else if (propValue == "positionName") {
            let value = input.value;
            employee[propValue] = value;
            if (!value) {
                $(input).addClass('input-error')
                $(input).attr('title', ' Dữ liệu bạn nhập không phù hợp')
                document.getElementById('dialog-error__content').innerHTML = `${document.getElementById('pos-input').innerHTML} không được để trống`
                $("#dlgError").show()
                break
            }
        }
        else if (propValue == "identityNumber") {
            let value = input.value;
            employee[propValue] = value;
            if (!value) {
                $(input).addClass('input-error')
                $(input).attr('title', ' Dữ liệu bạn nhập không phù hợp')
                document.getElementById('dialog-error__content').innerHTML = `${document.getElementById('ident-input').innerHTML} không được để trống`
                $("#dlgError").show()
                break
            }
        }
        else if (propValue == "issuedDate") {
            //Chuyển đổi giá trị date được format ở trên để phù hợp với dữ liệu đưa vào và yêu cầu của new Date
            let value = input.value;
            date = value.replace(/(..).(..).(....)/, "$2/$1/$3")
            Datedate = new Date(date)
            datejson = Datedate.toJSON()
            employee[propValue] = datejson;
            curr = new Date()
            if (!value) {
                $(input).addClass('input-error')
                $(input).attr('title', ' Dữ liệu bạn nhập không phù hợp')
                document.getElementById('dialog-error__content').innerHTML = `Ngày cấp không được để trống`
                $("#dlgError").show()
                break
            }
            else if (Datedate > curr) {
                $(input).addClass('input-error')
                $(input).attr('title', ' Dữ liệu bạn nhập không phù hợp')
                document.getElementById('dialog-error__content').innerHTML = `NGÀY CẤP không hợp lệ`
                $("#dlgError").show()
                break
            }
        }
        else if (propValue == "issuedPlace") {
            let value = input.value;
            employee[propValue] = value;
            if (!value) {
                $(input).addClass('input-error')
                $(input).attr('title', ' Dữ liệu bạn nhập không phù hợp')
                document.getElementById('dialog-error__content').innerHTML = `Nơi cấp không được để trống`
                $("#dlgError").show()
                break
            }
        }
        else if (propValue == "address") {
            let value = input.value;
            employee[propValue] = value;
            if (!value) {
                $(input).addClass('input-error')
                $(input).attr('title', ' Dữ liệu bạn nhập không phù hợp')
                document.getElementById('dialog-error__content').innerHTML = `Địa chỉ không được để trống`
                $("#dlgError").show()
                break
            }
        }
        else if (propValue == "phoneNumber") {
            let value = input.value;
            employee[propValue] = value;
            if (!value) {
                $(input).addClass('input-error')
                $(input).attr('title', ' Dữ liệu bạn nhập không phù hợp')
                document.getElementById('dialog-error__content').innerHTML = `${document.getElementById('phone-input').innerHTML} không được để trống`
                $("#dlgError").show()
                break
            }
        }
        else if (propValue == "stationPhone") {
            let value = input.value;
            employee[propValue] = value;
            if (!value) {
                $(input).addClass('input-error')
                $(input).attr('title', ' Dữ liệu bạn nhập không phù hợp')
                document.getElementById('dialog-error__content').innerHTML = `DT cố định không được để trống`
                $("#dlgError").show()
                break
            }
        }
        else if (propValue == "email") {
            let value = input.value;
            employee[propValue] = value;
            if (!value) {
                $(input).addClass('input-error')
                $(input).attr('title', ' Dữ liệu bạn nhập không phù hợp')
                document.getElementById('dialog-error__content').innerHTML = `Email không được để trống`
                $("#dlgError").show()
                break
            }
            else if (!checkmailFormat(value)) {
                $(input).addClass('input-error')
                $(input).attr('title', ' Dữ liệu bạn nhập không phù hợp')
                document.getElementById('dialog-error__content').innerHTML = `Email sai cú pháp`
                $("#dlgError").show()
                break
            }
        }
        else if (propValue == "accountNumber") {
            let value = input.value;
            employee[propValue] = value;
            if (!value) {
                $(input).addClass('input-error')
                $(input).attr('title', ' Dữ liệu bạn nhập không phù hợp')
                document.getElementById('dialog-error__content').innerHTML = `${document.getElementById('accnum-input').innerHTML} không được để trống`
                $("#dlgError").show()
                break
            }
        }
        else if (propValue == "bankName") {
            let value = input.value;
            employee[propValue] = value;
            if (!value) {
                $(input).addClass('input-error')
                $(input).attr('title', ' Dữ liệu bạn nhập không phù hợp')
                document.getElementById('dialog-error__content').innerHTML = `${document.getElementById('bank-input').innerHTML} không được để trống`
                $("#dlgError").show()
                break
            }
        }
        else if (propValue == "accountFranchiseName") {
            let value = input.value;
            employee[propValue] = value;
            if (!value) {
                $(input).addClass('input-error')
                $(input).attr('title', ' Dữ liệu bạn nhập không phù hợp')
                document.getElementById('dialog-error__content').innerHTML = `${document.getElementById('franchise-input').innerHTML} không được để trống`
                $("#dlgError").show()
                break
            }
        }
        else if (propValue == "gender") {
            for (var i = 3; i--;) {
                if (document.getElementsByClassName('radio')[i].checked == true) {
                    employee[propValue] = i
                    break
                }
            }
        }
    }
    //Nếu dữ liệu đã phù hợp với điều kiện sẽ thực hiện quá trình nhập dữ liệu


    //Nhập dữ liệu nếu formMode thỏa mãn điều kiện
    if (formMode == "edit") {
        $.ajax({
            type: "PUT",
            url: "http://localhost:5236/api/Employees/" + employee.employeeCode,
            data: JSON.stringify(employee),
            dataType: "json",
            contentType: "application/json",
            success: function (response) {
                $('#dlgEmplyeeInfo').hide();
                loadData();
            }
        });
    }
    else {
        $.ajax({
            type: "POST",
            url: "http://localhost:5236/api/Employees",
            data: JSON.stringify(employee),
            dataType: "json",
            contentType: "application/json",
            success: function (response) {
                $('#dlgEmplyeeInfo').hide();
                loadData();
            }
        });
    }
}


//Function Hiển thị và format form thêm nhân viên 
function Add() {
    //Gán sự kiện mới vào formMode
    formMode = "add"
    //Hiển thị form thêm nhân viên và đặt điểm khởi đầu ở input đầu tiên
    $('#dlgEmplyeeInfo').show();
    $('#dlgEmplyeeInfo input')[2].focus();
    //Clear hết giá trị của form từ những lần thêm mới/sửa trước
    $('#dlgEmplyeeInfo input').val(null)
    $('#dlgEmplyeeInfo select').val(null)
    codes = $("table#database-table tbody tr")
    //Lấy độ dài của bộ dữ liệu
    newEmployeeCode = $("table#database-table tbody tr").length
    //Gán giá trị cho input dựa vào độ dài của bộ dữ liệu
    if (newEmployeeCode >= 100) {
        $("#dlgEmplyeeInfo input")[2].value = `NV-${newEmployeeCode}`
    }
    else {
        $("#dlgEmplyeeInfo input")[2].value = `NV-0${newEmployeeCode}`
    }
    //Lọc qua từng giá trị mã nhân viên của bộ dữ liệu để đảm bảo input có giá trị lớn nhất
    table = document.getElementById("database-table")
    for (var i = 1, row; row = table.rows[i]; i++) {
        tableElem = row.cells[1].innerHTML
        if ($("#dlgEmplyeeInfo input")[2].value == tableElem) {
            newEmployeeCode = newEmployeeCode + 1
            if (newEmployeeCode >= 100) {
                $("#dlgEmplyeeInfo input")[2].value = `NV-${newEmployeeCode}`
            }
            else {
                $("#dlgEmplyeeInfo input")[2].value = `NV-0${newEmployeeCode}`
            }
        }
    }
}

//Function Khởi đàu
function initEvents() {
    //Thực hiện việc lưu dữ liệu, load lại dữ liệu và hiển thị form thêm nhân viên
    $(document).on('click', '#save-put', function () {
        EmpsaveData()
        loadData()
        Add()
    })

    //Gán sự kiện đóng dialog khi ấn vào nút đóng
    $(document).on('click', '#dialog-database__button', function(){
        $(this).parents('.dialog').hide()
    })

    //Gán sự kiện hiển thị form thêm nhân viên vào một nút 
    $(document).on('click', '#database-button-add', function () {
        formMode = "add"
        debugger
        $('#dlgEmplyeeInfo').show();
        $('#dlgEmplyeeInfo input')[2].focus();
        $('#dlgEmplyeeInfo input').val(null)
        $('#dlgEmplyeeInfo select').val(null)
        codes = $("table#database-table tbody tr")
        newEmployeeCode = $("table#database-table tbody tr").length
        if (newEmployeeCode >= 100) {
            $("#dlgEmplyeeInfo input")[2].value = `NV-${newEmployeeCode}`
        }
        else {
            $("#dlgEmplyeeInfo input")[2].value = `NV-0${newEmployeeCode}`
        }
        table = document.getElementById("database-table")
        for (var i = 1, row; row = table.rows[i]; i++) {
            tableElem = row.cells[1].innerHTML
            if ($("#dlgEmplyeeInfo input")[2].value == tableElem) {
                newEmployeeCode = newEmployeeCode + 1
                if (newEmployeeCode >= 100) {
                    $("#dlgEmplyeeInfo input")[2].value = `NV-${newEmployeeCode}`
                }
                else {
                    $("#dlgEmplyeeInfo input")[2].value = `NV-0${newEmployeeCode}`
                }
            }
        }
    })


    //Hiển thị tổng số trang
    document.getElementById('totalpage').innerHTML = `Tổng số: <div class = 'bold'>${$("table#database-table tbody tr").length}</div> bản ghi`

    //Function Load lại trang web khi ấn nút refresh
    $(document).on('click', '#refresh', function () {
        offset = 1
        getCurrentPage(offset)
        Pagination()
    })

    //Function Chọn ra số dữ liệu trong 1 trang
    $(document).on('change', '#pagination', function () {
        value = document.getElementById('pagination').value
        limit = parseInt(value)
        getCurrentPage(offset)
        Pagination()
    })

    //Phân trang dữ liệu
    $(document).on('click', '#1-page', function () {
        offset = 1
        getCurrentPage(offset)
        Pagination()
    })
    $(document).on('click', '#2-page', function () {
        offset = 2
        getCurrentPage(offset)
        Pagination()
    })
    $(document).on('click', '#3-page', function () {
        offset = 3
        getCurrentPage(offset)
        Pagination()
    })
    $(document).on('click', '#4-page', function () {
        offset = 4
        getCurrentPage(offset)
        Pagination()
    })
    $(document).on('click', '#5-page', function () {
        offset = 5
        getCurrentPage(offset)
        Pagination()
    })

    $(document).on('click', '#skip-max', function () {
        offset = 1
        getCurrentPage(offset)
        Pagination()
    })

    $(document).on('click', '#skip-min', function () {
        offset = 5
        getCurrentPage(offset)
        Pagination()
    })
    //Di chuyển ngược/xuôi qua các trang
    $(document).on('click', '#skip-forward', function () {
        offset++;
        if (offset > totalPage) {
            offset = totalPage;
        }
        getCurrentPage(offset)
        Pagination()
    })

    $(document).on('click', '#skip-back', function () {
        offset--;
        if (offset <= 1) {
            offset = 1;
        }
        getCurrentPage(offset)
        Pagination()
    })


    //Function Tìm kiếm dữ liệu dựa vào Mã Nhân Viên/Tên/Số điện thoại của nhân viên
    searchInput = document.querySelector("[data-search]")

    searchInput.addEventListener("input", function (e) {
        //Lấy ra giá trị input vào thanh tìm kiếm
        const value = e.target.value.toLowerCase()
        console.log(value)
        //Lọc qua các giá trị cần khớp qua các dòng dữ liệu
        table = document.getElementById("database-table")
        for (var i = 1, row; row = table.rows[i]; i++) {
            tableCode = row.cells[1].innerHTML
            tableName = row.cells[2].innerHTML
            tablePhone = row.cells[6].innerHTML
            //Giấu đị những dòng dữ liệu không có dữ liệu trùng khớp với input
            if (!tableCode.toLowerCase().includes(value)) {
                row.hidden = false
                if (!tableName.toLowerCase().includes(value)) {
                    row.hidden = false
                    if (!tablePhone.toLowerCase().includes(value)) {
                        row.hidden = true
                    }
                    else {
                        row.hidden = false
                    }
                }
            }
            else {
                row.hidden = false
            }
        }
    })

    //Function Mở ra dropdown menu
    $(document).on('click', '.dropdown-text', function () {
        $(this).parents(".dropdown").children(".dropdown-content").toggle()
    })


    //Function Xóa dữ liệu
    $(document).on('click', '.delete', function () {
        var selector = $(this).parents('table#database-table tbody tr')
        var empCode = selector.data('code')
        $("#dlgDel").show();
        document.getElementById('empCode').innerHTML = `Bạn có muốn xóa nhân viên ${empCode} không ?`
        document.getElementById("del-agree").addEventListener("click", function () {
            $.ajax({
                url: 'http://localhost:5236/api/Employees/Delete?employeeCode=' + empCode,
                type: 'DELETE',
                success: function (response) {
                    console.log("Đã xóa thành công nhân viên");
                    $("#dlgDel").hide();
                    selector.remove()
                },
            });
        })
    })


    //Function Nhân bản dữ liệu và chỉnh sửa mã nhân viên
    $(document).on('click', '.clone', function () {
        $("#dlgEmplyeeInfo").show();
        $("#dlgEmplyeeInfo input")[2].focus();
        let data = $(this).parents('table#database-table tbody tr').data('entity');
        let inputs = $("#dlgEmplyeeInfo input, #dlgEmplyeeInfo select");
        let value = null
        for (input of inputs) {
            const propValue = $(input).attr('propValue')
            if (propValue == "employeeCode") {
                value = data[propValue]
                table = document.getElementById("database-table")
                for (var i = 1, row; row = table.rows[i]; i++) {
                    tableElem = row.cells[1].innerHTML
                    if (value < tableElem) {
                        input.value = tableElem
                        break
                    }
                }
            }
            else {
                value = data[propValue]
                input.value = value
            }
        }
    })

    //Gán sự kiện cho nút lưu dữ liệu
    $(document).on('click', '#dialog-save', function () {
        EmpsaveData()
    });


    $('.checkbox').attr('checked', false)

    //Gán sư kiện tắt các windows cho nút hủy
    $(".cancel").click(function () {
        $(this).parents(".dialog").hide();
    })

    //Gắn sự kiện khi di chuyển ra ngoài các ô input
    $('input[input]').blur(function () {
        var value = this.value;
        if (!value) {
            $(this).addClass('input-error')
            $(this).attr('title', ' Dữ liệu bạn nhập không phù hợp')
        }
        else {
            $(this).removeClass('input-error')
            $(this).removeAttr('title')
        }
    })

    //Function Mở ra form và format các dữ liệu 
    $(document).on('dblclick', 'table#database-table tbody tr', function () {
        formMode = "edit"
        $("#dlgEmplyeeInfo").show();
        $("#dlgEmplyeeInfo input")[2].focus();
        //Lấy ra dữ liệu từ hàng khi thực hiện sự kiện
        let data = $(this).data('entity');
        employeeCode = $(this).data('code')
        let inputs = $("#dlgEmplyeeInfo input, #dlgEmplyeeInfo select");
        table = document.getElementById("database-table")
        for (input of inputs) {
            const propValue = $(input).attr('propValue')
            const format = $(input).attr('format')
            let value = data[propValue]
            if (propValue == "birthDate") {
                switch (format) {
                    case "date":
                        value = formatDate(value)
                }
            }
            else if (propValue == "issuedDate") {
                switch (format) {
                    case "date":
                        value = formatDate(value)
                }
            }
            else if (propValue == "gender") {
                document.getElementsByClassName('radio')[value].checked = true
                if (document.getElementsByClassName('radio')[value].checked = true) {
                    input.value = document.getElementsByClassName('radio')[value].value
                }
            }
            input.value = value
        };
    })

    //Function Kiểm tra dữ liệu khi di chuyển ra ngoài ô input email
    $('input[type=email]').blur(function () {
        var email = this.value;
        var isEmail = checkmailFormat(email)
        if (!isEmail) {
            $(this).addClass('input-error')
            $(this).attr('title', 'Email bạn vừa nhập không phù hợp')
        }
        else {
            $(this).removeClass('input-error')
            $(this).removeAttr('title')
        }
    })
    //Di chuyển qua content dựa vào mục menu
    $("#database-button").click(function () {
        $('#clients').hide();
        $('#database').show();
        $('#report').hide();
    })
    $("#clients-button").click(function () {
        $('#clients').show();
        $('#database').hide();
        $('#report').hide();
    })
    $("#report-button").click(function () {
        $('#clients').hide();
        $('#database').hide();
        $('#report').show();
    })
    //Đặt các điều kiện cho các input
    $("input[input]").attr("maxlength", 24)
    $("input[place]").attr("maxlength", 24)
    $("input[input]").attr("minlength", 6)

}

//Format các giá trị ngày tháng
function formatDate(date) {
    try {
        if (date) {
            //Chuyển đổi các giá trị ngày tháng thành dạng new Date
            date = new Date(date);
            //Lấy ra ngày, tháng và năm
            let day = date.getDate();
            day = day < 10 ? `0${day}` : day
            let month = date.getMonth() + 1;
            month = month < 10 ? `0${month}` : month
            let year = date.getFullYear()
            //Format giá trị ngày tháng 
            return `${day}/${month}/${year}`
        }
        else {
            return "";
        }
    }
    catch (error) {
        console.log(error)
    }
}
//Format giá trị tiền tệ
function formatMoney(money) {
    try {
        money = new Intl.NumberFormat('vn-VI', { style: 'currency', currency: 'VND' }).format(money);
        return money;
    }
    catch (error) {
        console.log(error)
    }
}
//Kiểm tra giá trị email
function checkmailFormat(email) {
    const re = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    return email.match(re)
}
//Function Xóa đi các giá trị null, rỗng, undefined
function removeNull(col) {
    if (!col) {
        return ""
    }
    else {
        return col
    }
}