function login() {
  var user = $('#user').val();
  if (user.length) {
    localStorage.setItem('user', user);
    updateDashboard();
  }
}

function logout() {
  localStorage.removeItem('user');
  updateDashboard();
}

function enter(el) {
  if(event.keyCode == 13) {
    if (el.value.length) {
      localStorage.setItem('user', el.value);
      updateDashboard();
    }
  }
}

var timeSince = function(date) {
  var time;
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var currDate = new Date();
  var pushDate = new Date(date);
  var mins = Math.ceil((currDate.getTime() - pushDate.getTime()) / (1000*60));
  switch (true) {
    case (mins < 60):
      return (mins > 1) ? mins + ' mins ago' : mins + ' min ago';
      break;
    case (mins < 60 * 24):
      time = Math.ceil(mins / 60);
      return (time > 1) ? time + ' hrs ago' : time + ' hr ago';
      break;
    case (mins < 60 * 24 * 30):
      time = Math.ceil(mins / 60 / 24);
      return (time > 1) ? time + ' days ago' : time + ' day ago';
      break;
    default:
      return months[pushDate.getMonth()] + ' ' + pushDate.getDate() + ', ' + pushDate.getFullYear();
  }
}

var updateDashboard = function() {
  var user = localStorage.getItem('user');
  if (user) {
    $('#go').addClass('hide');
    $('#user').addClass('hide');

    if (!$('#logged-in').length) {
      $.getJSON('https://api.github.com/users/' + user, function(data) {
        $('.right-menu').prepend($('<li>', {
          id: 'logged-in'
        }).append($('<img>', {
          class: 'avatar current-user',
          src: data.avatar_url,
          alt: user
        })).append('<div class="button-group"><a class="button">'+user+'</a><a class="button success" onclick="updateDashboard()"><i class="fi-refresh"></i></a><a class="button alert" onclick="logout()"><i class="fi-x"></i></a></div>'));
      });
    }
    if ($('.starred').length) {
      $('.starred').html('');
      $.getJSON('https://api.github.com/users/' + user + '/starred', { sort: 'updated'}, function(data) {
        $.each(data, function(index, repo) {
          if (repo.owner.login !== user) {
            $('.starred').append($('<div>', {
              class: 'callout clearfix'
            }).append($('<a>', {
              text: repo.full_name,
              href: repo.html_url,
              target: '_blank'
            })).append($('<span>', {
              class: 'float-right secondary',
              text: timeSince(repo.pushed_at)
            })));
          }
        });
      });
    }
    if ($('.following').length) {
      $('.following').html('');
      $.getJSON('https://api.github.com/users/' + user + '/following', function(data) {
        $.each(data, function(index, user) {
          $('.following').append($('<div>', {
            class: 'callout'
          }).append($('<img>', {
            class: 'avatar',
            src: user.avatar_url,
            alt: user.login
          })).append($('<a>', {
            class: 'lead',
            text: user.login,
            href: user.html_url,
            target: '_blank'
          })));
        });
      });
    }
    if ($('.my-repos').length) {
      $('.my-repos').html('');
      $.getJSON('https://api.github.com/users/' + user + '/repos', { sort: 'updated' }, function(data) {
        $.each(data, function(index, repo) {
          $('.my-repos').append($('<div>', {
            class: 'callout clearfix'
          }).append($('<a>', {
            text: repo.full_name,
            href: repo.html_url,
            target: '_blank'
          })).append($('<span>', {
            class: 'float-right secondary',
            text: timeSince(repo.pushed_at)
          })));
        });
      });
    }

    $('.welcome').addClass('hide');
    $('.dashboard').removeClass('hide');
  } else {
    $('#logged-in').remove();
    $('#user').removeClass('hide').val('');
    $('#go').removeClass('hide');
    $('.welcome').removeClass('hide');
    $('.dashboard').addClass('hide');
  }
}

$(document).ready(function() {
  if(localStorage.getItem('user')) {
    $('.welcome').addClass('hide');
    $('.dashboard').removeClass('hide');
    updateDashboard();
  }
}).foundation();
