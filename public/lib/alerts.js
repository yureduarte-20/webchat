const errorMessage = (msg, time = 3000) => {
    if ($('.alert').hasClass('alert-success')) {
        $('.alert').removeClass('alert-success')
    }
    if (!$('.alert').hasClass('alert-danger')) {
        $('.alert').addClass('alert-danger')
    }
    $('.alert').removeClass('d-none').text(msg)
    const t = setTimeout(() => {
        $('.alert').addClass('d-none')
        clearTimeout(t)
    }, time)

}

const successMessage = (msg, time = 3000) => {
    if ($('.alert').hasClass('alert-danger')) {
        $('.alert').removeClass('alert-danger')
    }
    if (!$('.alert').hasClass('alert-success')) {
        $('.alert').addClass('alert-success')
    }
    $('.alert').removeClass('d-none').text(msg)
    const t = setTimeout(() => {
        $('.alert').addClass('d-none')
        clearTimeout(t)
    }, time)
}