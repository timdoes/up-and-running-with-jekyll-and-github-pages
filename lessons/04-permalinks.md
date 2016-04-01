# Lesson 4: Permalinks

I'm not sure if you've noticed but so far our page locations look a bit ugly with the `.html` at the end.

There is a quick and easy fix for this. If we open up our `/_config.yml` file and add a third line, `permalink: pretty`, Jekyll will remove the file extensions from the pages.

Whenever we edit our `_config.yml` we will need to restart the Jekyll server. Go to *Terminal* and hit `ctrl-c` to stop the server. Then type `jekyll serve --watch --baseurl ""` to start the server again.

We will also need to update our navigation.

*/_includes/nav.html*
```html
...
<ul class="menu">
  <li class="menu-text">GitHub Manager</li>
  <li><a href="{{site.baseurl}}/">Home</a></li>
  <li><a href="{{site.baseurl}}/news/">News</a></li>
</ul>
...
```

And there we go. Now our navigation looks *pretty* in the browser address bar.

1. Save
2. Commit
3. Sync

Continue to [Lesson 5: Showing the Active Page in our Nav](05-showing-active-page-in-nav.md).
