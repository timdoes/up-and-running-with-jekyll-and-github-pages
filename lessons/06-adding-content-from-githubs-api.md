# Lesson 6: Adding Content From GitHub's API

In this lesson we will be making quite a few changes. However, they are not Jekyll related so we will again just be copying and pasting the new code to our files. Simple enough.

> See what it will look like by watching this [video](https://www.youtube.com/watch?v=KbrPsHHNBmI). Also, feel free to dig into the code to see what is doing what!

I promise that we will be back in the thick of Jekyll in the next lesson. We just need to get the core of our GitHub Manager app installed first.

You will notice that we also have changed the `Home` menu item to `Dashboard`. This seemed more suitable for our app. We have also changed the labels for the first two sections of the Dashboard to `Starred Repos` and `Following` for a cleaner more precise look.

Okay, here are the changes to the files:

*/_includes/nav.html*

1. Change `Home` link to `Dashboard`
2. Add username input to the `top-bar-right`

```html
<nav data-sticky-container>
  <div class="top-bar sticky" data-sticky data-options="anchor: body; marginTop: 0; stickyOn: small;">
    <div class="top-bar-left">
      <ul class="menu">
        <li class="menu-text">GitHub Manager</li>
        <li class="{% if page.url == '/' %}active{% endif %}"><a href="{{site.baseurl}}/">Dashboard</a></li>
        <li class="{% if page.url == '/news/' %}active{% endif %}"><a href="{{site.baseurl}}/news/">News</a></li>
      </ul>
    </div>
    <div class="top-bar-right">
    <ul class="menu right-menu">
      <li><input id="user" type="text" placeholder="GitHub Username" onkeydown="enter(this)"></li>
      <li><button id="go" type="button" class="button" onclick="login()">Go</button></li>
    </ul>
  </div>
  </div>
</nav>
```

*/_layouts/default.html*

1. Add FoundationJS Icons

```html
...
<head>
  <meta charset="utf-8">
  <title>GitHub Manager</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/foundation/6.2.0/foundation.min.css">
  <link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/foundation-icons.min.css">
  <link rel="stylesheet" href="{{site.baseurl}}/css/custom.css">
</head>
...
```

*/css/custom.css*
```css
header {
  margin-bottom: 20px;
}
.avatar {
  border: 0;
  border-radius: 3px;
  box-sizing: border-box;
  display: inline-block;
  height:42px;
  margin-right:20px;
  vertical-align: middle;
  width:42px;
}
.button-group {
  display: inline-flex;
  margin-bottom: 0;
}
.current-user {
  margin-right: 2px;
  height: 39px;
  width: 39px;
}
.sticky {
  width: 100%;
}

@media only screen and (max-width: 640px) {
  .top-bar-left {
    display: -webkit-flex;
    -webkit-justify-content: center;
    display: flex;
    justify-content: center;
  }
  .top-bar-right {
    margin-top: 20px;
    -webkit-align-items: baseline;
    align-items: baseline;
    display: -webkit-flex;
    -webkit-justify-content: center;
    display: flex;
    justify-content: center;
  }
}
```

*/index.html*

1. Add welcome section
2. Add GitHub API content placeholders

```html
---
layout: default
---
<div class="welcome expanded row">
  <h1 class="text-center">Welcome to GitHub Manager<br><small>Enter a username above</small></h1>
</div>
<div class="dashboard expanded row hide">
  <div class="small-12 medium-4 columns">
    <h3>Starred Repos</h3>
    <hr>
    <div class="starred"></div>
  </div>
  <div class="small-12 medium-4 columns">
    <h3>Following</h3>
    <hr>
    <div class="following"></div>
  </div>
  <div class="small-12 medium-4 columns">
    <h3>My Repos</h3>
    <hr>
    <div class="my-repos"></div>
  </div>
</div>
```

And lastly we make it all functional with some custom JavaScript. Don't get overwhelmed by this code. It is not necessary to understand any of it for this tutorial.

*/js/custom.js*

```js
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
```

And there we have it. Our Jekyll project is starting to look like a real website!

Next we will be creating our `News` blog pages where we can really dive into Jekyll's features and functionality.

1. Save
2. Commit
3. Sync

Lesson 7: Introducing `_posts` - Creating Blog Posts (coming soon...)
