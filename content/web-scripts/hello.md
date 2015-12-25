+++
Categories = ["showcase"]
Tags = ["showcase", "hello", "javascript"]
date = "2015-12-25T11:38:46+08:00"
title = "hello"

+++

> A small snippet that embeds js into a Hugo post

<!--more-->

The button below executes a function from `/js/hello.js`

{{< script "/js/hello.js" >}}
{{< verbatim >}}
<button onclick="Hello('World')">Click Me!</button>
{{< /verbatim >}}

Source:

```
{ {< script "/js/hello.js" >}}
{ {< verbatim >}}
<button onclick="Hello('World')">Click Me!</button>
{ {< /verbatim >}}
```

****

```
<!-- /layouts/shortcodes/script.html -->
<script type="text/javascript" src="{{ .Get 0 }}"></script>
```

****

```
<!-- /layouts/shortcodes/verbatim.html -->
{{ .Inner }}
```

There might be an easier way to do this but so far I haven't found anything from the docs.