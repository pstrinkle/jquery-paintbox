# jquery-paintbox
jQuery plugin that draws an interactive paint grid similar to MS Paint (also support non-interactive mode for programmatic access)

Plans
-----

See issues.

Usage
-----
```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="/libs/jquery-paintbox/paintbox.js"></script>

<div id='container'></div>

<script>
    $('#container').paintbox({});
</script>
```

Options
-------
You should specify options like in usage example above.

| Name | Type | Default | Description |
| ---- | ---- | ---- | ---- |
| rows | integer | `50` | Number of rows. |
| cols | integer | `50` | Number of columns. |
| cell | integer | `10` | Cell dimension in pixels |

License
-------
[Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0)
