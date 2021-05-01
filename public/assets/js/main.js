import { checkValidity } from "./inputValidation.js";



// ------------------------------ ADD CATEGORY ----------------------------------------------

$(document).ready(function () {

    // ---------------------------- Load More Comment -------------------------------------------

    $(function () {

        $(".comment-box").slice(2).hide()

        $("#btn-load-more").on('click', function (e) {
            e.preventDefault();
            $(".comment-box:hidden").slice(0, 2).slideDown();
            if ($(".comment-box:hidden").length == 0) {
                $("#btn-load-more").fadeOut('slow');
            }
            $('html,body').animate({
                scrollTop: $(this).offset().top
            }, 1500);
        });

    });

    $('#top').click(function () {
        $('body,html').animate({
            scrollTop: 0
        }, 600);
        return false;
    });

    $(window).scroll(function () {
        if ($(".comment-box:hidden").length == 0) {
            $("#btn-load-more").fadeOut('fast');
            $('.totop a').fadeIn('slow');
        } else {
            $('.totop a').fadeOut('slow');
        }
    });


    $("#btn-add-category").click(function (e) {

        let name = $('#name').val();

        let values = {
            name: {}
        }

        values['name'].val = name;
        values['name'].valueName = 'Category Name';
        values['name'].max = 30;
        values['name'].min = 3;
        values['name'].pattern = { customPattern: '^[a-zA-Z0-9 ]+$', customMessage: '' };

        let validation = checkValidity(values)

        let haveError = Object.values(validation).some(error => error.name !== '');

        if (!haveError) {
            let formData = { name };
            $.ajax({
                url: 'http://localhost:8000/api/v1/categories',
                method: 'POST',
                data: formData,
                success: function (data) {
                    $('form :input').val('');
                    $('.error-input').text('');
                    validation = '';
                    Swal.fire({
                        icon: 'success',
                        title: 'Successfully Added A New Category',
                        showConfirmButton: false,
                        timer: 2500
                    });
                },
                error: function (xhr, status, error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: xhr.responseJSON.message,
                    });
                }
            });
        } else {
            $('.error-input').text(validation.errors['name']);
        }

        setTimeout(function () {
            $('.error-input').text('');
        }, 10000)

    });


    // ------------------------------------- ADD MOVIE -------------------------------------------

    $("#btn-add-movie").click(function (e) {
        let title = $('#title').val();
        let releaseYear = $('#releaseYear').val();
        let cast = $('#cast').val();
        let storyLine = $('#storyLine').val();
        let category = $('#category').val();
        let picture = $('#picture').prop('files')[0];

        let values = {
            'title': {
                val: title,
                valueName: 'Title',
                max: 30,
                min: 3,
                pattern: { customPattern: '^[a-zA-Z0-9\\s.,\'-]*$', customMessage: '' }
            },
            'releaseYear': {
                val: releaseYear === '' || typeof (releaseYear) === 'undefined' ? '' : parseInt(releaseYear, 10),
                valueName: 'Release Year',
                max: 2030,
                min: 1910,
                pattern: { customPattern: '^[0-9]+$', customMessage: '' }
            },
            'cast': {
                val: cast,
                valueName: 'Major Cast',
                max: 500,
                min: 5,
                pattern: { customPattern: '^[a-zA-Z0-9\\s.,\'-]*$', customMessage: '' }
            },
            'storyLine': {
                val: storyLine,
                valueName: 'Story Line',
                max: 1000,
                min: 3,
                pattern: { customPattern: '^[a-zA-Z0-9\\s.,!:?\'-]*$', customMessage: '' }
            },
            'category': {
                val: category,
                valueName: 'Category',
                max: 30,
                min: 3,
                pattern: { customPattern: '^[a-zA-Z0-9\\s.,\'-]*$', customMessage: '' }
            },
            'picture': {
                val: picture,
                valueName: 'Picture',
            },
        }


        let validation = checkValidity(values)


        let haveError = Object.keys(validation.errors).some(key => validation.errors[key] !== '');

        if (!haveError) {
            let formData = new FormData();
            formData.append('title', title);
            formData.append('releaseYear', parseInt(releaseYear, 10));
            formData.append('cast', cast);
            formData.append('storyLine', storyLine);
            formData.append('picture', picture);
            formData.append('category', category);

            $.ajax({
                url: 'http://localhost:8000/api/v1/movies',
                enctype: 'multipart/form-data',
                method: 'POST',
                data: formData,
                contentType: false,
                cache: false,
                processData: false,
                beforeSend: function () {
                    $('form').loading({
                        message: 'Saving data. Please wait...'
                    });
                    $('#btn-add-movie').attr("disabled", true);

                },
                success: function (data) {
                    $('form :input').val('');

                    $('form').loading('stop');
                    $('#btn-add-movie').attr("disabled", false);

                    Object.keys(validation.errors).forEach(key => {
                        let errorInput = $(`.${key}.error-input`);
                        errorInput.text('');
                    });
                    Swal.fire({
                        icon: 'success',
                        title: 'Successfully Added A New Movie',
                        showConfirmButton: false,
                        timer: 2000
                    })
                },
                error: function (xhr, status, error) {
                    $('form').loading('stop');
                    $('#btn-add-movie').attr("disabled", false);

                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: xhr.responseJSON.message,
                    });
                }
            });
        } else {

            Object.keys(validation.errors).forEach(key => {
                let errorInput = $(`.${key}.error-input`);
                console.log(key);
                console.log(validation.errors[key])
                errorInput.text(validation.errors[key]);
            })
        }

        setTimeout(function () {
            Object.keys(validation.errors).forEach(key => {
                let errorInput = $(`.${key}.error-input`);
                errorInput.text('');
            });
        }, 10000)
    });


    // ------------------------------------- SIGN UP -------------------------------------------

    $('#btn-signup').click(e => {
        e.preventDefault();

        let btnSignUp = $(this);

        let firstName = $('#firstName').val();
        let lastName = $('#lastName').val();
        let dob = $('#dob').val();
        let password = $('#password').val();
        let confirmPassword = $('#confirmPassword').val();
        let email = $('#email').val();

        let values = {
            firstName: {
                val: firstName,
                valueName: 'First Name',
                max: 30,
                min: 3,
                pattern: { customPattern: '^[a-zA-Z ]*$', customMessage: '' }
            },
            lastName: {
                val: lastName,
                valueName: 'Last Name',
                max: 30,
                min: 3,
                pattern: { customPattern: '^[a-zA-Z ]*$', customMessage: '' }
            },
            password: {
                val: password,
                valueName: 'Password',
                max: 50,
                min: 8,
                pattern: {
                    customPattern: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{8,}$'
                    , customMessage: 'Password must have at least one number. Uppercase and special characters are optional'
                }
            },
            confirmPassword: {
                val: confirmPassword,
                valueName: 'Confirm Password',
                max: 50,
                min: 8,
                pattern: {
                    customPattern: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{8,}$'
                    , customMessage: 'Confirm Password must have at least one number. Uppercase and special characters are optional'
                }
            },
            email: {
                val: email,
                valueName: 'Email',
                max: 50,
                min: 4,
                pattern: {
                    customPattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    customMessage: ''
                }
            },

        }

        let validation = checkValidity(values)
        let haveError = Object.keys(validation.errors).some(key => validation.errors[key] !== '');

        if (!haveError) {

            $.ajax({
                url: 'http://localhost:8000/api/v1/users/signup',
                method: 'POST',
                data: { firstName, lastName, dob, password, confirmPassword, email },
                beforeSend: function () {
                    $('form').loading({
                        message: 'Saving data. Please wait...'
                    });
                    $('#btn-signup').attr("disabled", true);

                },
                success: function (data) {
                    $('form :input').val('');
                    $('.error-input').text('');
                    $('form').loading('stop');
                    $('#btn-signup').attr("disabled", false);

                    Object.keys(validation.errors).forEach(key => {
                        let errorInput = $(`.${key}.error-input`);
                        errorInput.text('');
                    });

                    Swal.fire({
                        icon: 'success',
                        title: 'Successfully Signed Up',
                        showConfirmButton: false,
                        timer: 2500
                    })
                },
                error: function (xhr, status, error) {
                    $('form').loading('stop');
                    $('#btn-signup').attr("disabled", false);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: xhr.responseJSON.message,
                    });

                }
            });

        } else {
            Object.keys(validation.errors).forEach(key => {
                let errorInput = $(`.${key}.error-input`);
                errorInput.text(validation.errors[key]);
            });

            setTimeout(function () {
                Object.keys(validation.errors).forEach(key => {
                    let errorInput = $(`.${key}.error-input`);
                    errorInput.text('');
                });
            }, 7000)
        }

    });


    // ------------------------------------- LOGIN  -------------------------------------------

    $('#btn-login').click(e => {
        e.preventDefault();

        let email = $('#email').val();
        let password = $('#password').val();

        let values = {
            password: {
                val: password,
                valueName: 'Password',
                max: 50,
                min: 8,
                pattern: {
                    customPattern: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{8,}$'
                    , customMessage: 'Password must have at least one number. Uppercase and special characters are optional'
                }
            },
            email: {
                val: email,
                valueName: 'Email',
                max: 50,
                min: 4,
                pattern: {
                    customPattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    customMessage: ''
                }
            },
        }


        let validation = checkValidity(values)

        let haveError = Object.keys(validation.errors).some(key => validation.errors[key] !== '');

        if (!haveError) {

            $.ajax({
                url: 'http://localhost:8000/api/v1/users/login',
                method: 'POST',
                data: { password, email },
                success: function (data) {

                    $('form :input').val('');
                    Object.keys(validation.errors).forEach(key => {
                        let errorInput = $(`.${key}.error-input`);
                        errorInput.text('');
                    });
                    Swal.fire({
                        icon: 'success',
                        title: 'Successfully Logged In',
                        showConfirmButton: false,
                        timer: 2500
                    })
                },
                error: function (xhr, status, error) {

                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: xhr.responseJSON.message,
                    });
                }
            });

        } else {
            Object.keys(validation.errors).forEach(key => {
                let errorInput = $(`.${key}.error-input`);
                errorInput.text(validation.errors[key]);
            });

            setTimeout(function () {
                Object.keys(validation.errors).forEach(key => {
                    let errorInput = $(`.${key}.error-input`);
                    errorInput.text('');
                });
            }, 7000)
        }




    });


    // ----------------------- VERIFY ACCOUNT --------------------------------------------------------------------

    $('#btn-verify-account').click(e => {
        e.preventDefault();


        let email = $('#email').val();

        let values = {
            email: {
                val: email,
                valueName: 'Email',
                max: 50,
                min: 4,
                pattern: {
                    customPattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    customMessage: ''
                }
            },
        }


        let validation = checkValidity(values)
        let haveError = Object.keys(validation.errors).some(key => validation.errors[key] !== '');

        if (!haveError) {
            $.ajax({
                url: 'http://localhost:8000/api/v1/users/sendVerificationEmail',
                method: 'POST',
                data: { email },
                beforeSend: function () {
                    $('form').loading({
                        message: 'Sending verification link to your email. Please wait...'
                    });
                    $('#btn-verify-account').attr("disabled", true);

                },
                success: function (data) {

                    $('form').loading('stop');
                    $('#btn-verify-account').attr("disabled", false);
                    $('form :input').val('');

                    Object.keys(validation.errors).forEach(key => {
                        let errorInput = $(`.${key}.error-input`);
                        errorInput.text('');
                    });
                    Swal.fire({
                        icon: 'success',
                        title: 'Successfully sent the verification link to your email',
                        showConfirmButton: false,
                        timer: 2500
                    })
                },
                error: function (xhr, status, error) {
                    $('form').loading('stop');
                    $('#btn-verify-account').attr("disabled", false);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: xhr.responseJSON.message,
                    });
                }
            });

        } else {
            Object.keys(validation.errors).forEach(key => {
                let errorInput = $(`.${key}.error-input`);
                errorInput.text(validation.errors[key]);
            });

            setTimeout(function () {
                Object.keys(validation.errors).forEach(key => {
                    let errorInput = $(`.${key}.error-input`);
                    errorInput.text('');
                });
            }, 7000)
        }
    });

    // ----------------------- FORGOT PASSWORD --------------------------------------------------------------------

    $('#btn-forgot-password').click(e => {
        e.preventDefault();

        let email = $('#email').val();

        let values = {
            email: {
                val: email,
                valueName: 'Email',
                max: 50,
                min: 4,
                pattern: {
                    customPattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    customMessage: ''
                }
            },
        }


        let validation = checkValidity(values)
        let haveError = Object.keys(validation.errors).some(key => validation.errors[key] !== '');

        if (!haveError) {

            $.ajax({
                url: 'http://localhost:8000/api/v1/users/forgotPassword',
                method: 'POST',
                data: { email },
                beforeSend: function () {
                    $('form').loading({
                        message: 'Sending password reset link to your email. Please wait...'
                    });
                    $('#btn-forgot-password').attr("disabled", true);
                },
                success: function (data) {

                    $('form :input').val('');
                    $('form').loading('stop');
                    $('#btn-forgot-password').attr("disabled", false);

                    Object.keys(validation.errors).forEach(key => {
                        let errorInput = $(`.${key}.error-input`);
                        errorInput.text('');
                    });
                    Swal.fire({
                        icon: 'success',
                        title: 'Successfully sent the reset password link to your email.',
                        showConfirmButton: false,
                        timer: 2500
                    })
                },
                error: function (xhr, status, error) {
                    $('form').loading('stop');
                    $('#btn-forgot-password').attr("disabled", false);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: xhr.responseJSON.message,
                    });
                }
            });

        } else {
            Object.keys(validation.errors).forEach(key => {
                let errorInput = $(`.${key}.error-input`);
                errorInput.text(validation.errors[key]);
            });

            setTimeout(function () {
                Object.keys(validation.errors).forEach(key => {
                    let errorInput = $(`.${key}.error-input`);
                    errorInput.text('');
                });
            }, 7000)
        }
    });


    // ----------------------RESET PASSWORD ------------------------------------------

    $('#btn-reset-password').click(e => {
        e.preventDefault();

        let password = $('#password').val();
        let confirmPassword = $('#confirmPassword').val();

        let values = {
            password: {
                val: password,
                valueName: 'Password',
                max: 50,
                min: 8,
                pattern: {
                    customPattern: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{8,}$'
                    , customMessage: 'Password must have at least one number. Uppercase and special characters are optional'
                }
            },
            confirmPassword: {
                val: confirmPassword,
                valueName: 'Confirm Password',
                max: 50,
                min: 8,
                pattern: {
                    customPattern: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{8,}$'
                    , customMessage: 'Confirm Password must have at least one number. Uppercase and special characters are optional'
                }
            },
        }

        let validation = checkValidity(values)
        let haveError = Object.keys(validation.errors).some(key => validation.errors[key] !== '');


        if (!haveError) {
            const passwordToken = location.pathname.split('/')[3];
            $.ajax({
                url: `http://localhost:8000/api/v1/users/resetPassword/${passwordToken}`,
                method: 'PATCH',
                data: { password, confirmPassword },
                beforeSend: function () {
                    $('form').loading({
                        message: 'Updating your password. Please wait...'
                    });
                    $('#btn-reset-password').attr("disabled", true);
                },
                success: function (data) {

                    $('form').loading('stop');
                    $('#btn-reset-password').attr("disabled", false);

                    $('form :input').val('');
                    Object.keys(validation.errors).forEach(key => {
                        let errorInput = $(`.${key}.error-input`);
                        errorInput.text('');
                    });
                    Swal.fire({
                        icon: 'success',
                        title: 'You successfully updated your password',
                        showConfirmButton: false,
                        timer: 2500
                    });
                },
                error: function (xhr, status, error) {
                    $('form').loading('stop');
                    $('#btn-reset-password').attr("disabled", false);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: xhr.responseJSON.message,
                    });
                }
            });

        } else {
            Object.keys(validation.errors).forEach(key => {
                let errorInput = $(`.${key}.error-input`);
                errorInput.text(validation.errors[key]);
            });

            setTimeout(function () {
                Object.keys(validation.errors).forEach(key => {
                    let errorInput = $(`.${key}.error-input`);
                    errorInput.text('');
                });
            }, 7000)
        }
    });

    // ------------------------------ Add Comment----------------------------------------------

    $('#btn-add-comment').click(e => {
        e.preventDefault();

        let commentBody = $('#commentBody').val();
        let movieId = $('#movieId').val();


        let values = {
            commentBody: {
                val: commentBody,
                valueName: 'Comment Body',
                max: 1000,
                min: 5,
                pattern: { customPattern: '^[a-zA-Z0-9\\s.,!:?\'-]*$', customMessage: '' }
            },
        }

        let validation = checkValidity(values)
        let haveError = Object.keys(validation.errors).some(key => validation.errors[key] !== '');

        if (!haveError) {

            $.ajax({
                url: `http://localhost:8000/api/v1/movies/${movieId}/comments`,
                method: 'POST',
                data: { commentBody },
                beforeSend: function () {
                    $('form').loading({
                        message: 'Saving your comment. Please wait...'
                    });
                    $('#btn-add-comment').attr("disabled", true);
                },
                success: function (response) {

                    $('form :input').val('');
                    $('form').loading('stop');
                    $('#btn-add-comment').attr("disabled", false);

                    let data = response.data;
                    const commentsElementCount = $('.comments').length;

                    const months = {1: 'January', 2: 'February', 3:'March', 4: 'April', 5: 'May', 6: 'June', 
                    7: 'July', 8: 'August', 9: 'September', 10: 'October', 11: 'November', 12: 'December'};

                    const createdDate = new Date(data.createdDate);

                    const month = months[createdDate.getMonth() + 1];
                    const date = createdDate.getDate();
                    const year = createdDate.getFullYear();
                    // const minutes = data.createdDate.getMinutes()
                    // const hour = ((data.createdDate.getHours()) + 24 % 12) || 12; 
                    const time = createdDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

                    const dateAndTime = `${month} ${date}, ${year} ${time}`;


                    let card = `<div class="col-md-12">
                    <div class="card">
                        <div class="card-body">    
                            <div class="card-title-wrapper">
                                <h6 class="card-title">
                                    <span class="comment-name">${data.userFirstName} </span>
                                    <span>says: </span>
                                </h6>
                                <div class="comment-rating">
                                    <i class="fas fa-star rated"></i> 
                                    <span data-commentid = ${data._id}>${data.rating} </span><span class="text-muted"> / 5</span>
                                </div>
                            </div>                                                                            
                            <h6 class="card-subtitle mb-2 text-muted">${dateAndTime}</h6>
                            <p class="card-text">${data.commentBody}</p>                                       
                        </div>
                    </div>
                </div> `

                let insertHtml;


                if(commentsElementCount > 0){
                    $('#main-content .comments .row').prepend(card);
                }else{
                    let commentsHtml = ` 
                                    <div class="col-md-12 ">
                                        <h4 class="float-right mb-4 comments-title">Comments</h2>
                                        <div class="comments">
                                            <div class="row">                                                                              
                                                ${card}                                                                                                                                                                                           
                                            </div>
                                        </div>                       
                                        <div class="d-flex justify-content-center">
                                            <button class="btn btn-info " id="btn-load-more">Load More Comments</button>
                                            <p class="totop">
                                                <a href="#top" class="btn btn-link">Back to top</a>
                                            </p>
                                        </div>                       
                                    </div>
                               `

                    $('#main-content .comments-wrapper').prepend(commentsHtml);    
                }                    

                    Object.keys(validation.errors).forEach(key => {
                        let errorInput = $(`.${key}.error-input`);
                        errorInput.text('');
                    });
                    Swal.fire({
                        icon: 'success',
                        title: 'Successfully added your comment',
                        showConfirmButton: false,
                        timer: 2500
                    })
                },
                error: function (xhr, status, error) {
                    $('form').loading('stop');
                    $('#btn-add-comment').attr("disabled", false);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: xhr.responseJSON.message,
                    });
                }
            });

        } else {
            Object.keys(validation.errors).forEach(key => {
                let errorInput = $(`.${key}.error-input`);
                errorInput.text(validation.errors[key]);
            });

            setTimeout(function () {
                Object.keys(validation.errors).forEach(key => {
                    let errorInput = $(`.${key}.error-input`);
                    errorInput.text('');
                });
            }, 7000)
        }
    });

    // ------------------------ User Rating ------------------------------------------

    // $('.movie-ratings-wrapper i').filter(function (e){
    //     let idx = $(this).index();
    //     return idx>=0 && idx<ratingNumber;
    //   }).addClass('active');

    //  document.querySelector('.movie-ratings-wrapper').addEventListener('click', function (e) {
    //     let action = 'add';
    //     for (const span of this.children) {
    //         span.classList[action]('active');
    //         if (span === e.target) action = 'remove';
    //     }
    // });


    $('.movie-ratings-wrapper .rate').click(function (e) {
        const rating = $('.movie-ratings-wrapper .rate').index(e.target) + 1;
        let movieId = $('#movieId').val();

        let action = 'add';
        let x = 0;
        for (const i of $('.movie-ratings-wrapper').children()) {
            i.classList[action]('active');
            if (i === e.target) action = 'remove';
        }

        $.ajax({
            url: `http://localhost:8000/api/v1/movies/${movieId}/comments/rating`,
            method: 'PATCH',
            data: { rating },
            error: function (xhr, status, error) {
                $('form').loading('stop');
                $('#btn-add-comment').attr("disabled", false);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: xhr.responseJSON.message,
                });
            },
            success: function (response) {
                $.ajax({
                    url: `http://localhost:8000/api/v1/movies/${movieId}`,
                    method: 'GET',
                    success: function (resp) {
                        let totalRating = resp.data.totalRating;
                        $('.totalRating').text(totalRating);
                        console.log(rating)
                        $(`[data-commentid="${response.data._id}"]`).text(rating);
                    }
                });
            }
        });

    });


});




