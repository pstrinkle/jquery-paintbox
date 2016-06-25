# jquery-paintbox
jQuery plugin that draws an interactive paint grid similar to MS Paint (also support non-interactive mode for programmatic access)

[![Latest release](https://img.shields.io/github/release/pstrinkle/jquery-paintbox.svg)](https://github.com/pstrinkle/jquery-paintbox/releases/latest)

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
| colors | array | ... | Override colors for pallete via array of CSS colors. |
| interactive | boolean | `true` | Whether the paintbox should expect mouse input and draw a palette. |
| offColor | css string | `white` | Set the paintbox background color. |

Methods
-------
There are a few methods to programmatically change the painting.

| Method | Param | Type | Description |
| ---- | ---- | ---- | ---- |
| `cell` | `{i : row, j : col, color: css}` | object | You specify the grid coordinate and color |
| `line` | `{i : row, j : col, color: css, direction: left, length: blocks}` | object | You specify the starting point, direction and length.  If any of it is invalid, it raises an exception |
| `rect` | `{i: row, j: col, i2: row, j2: col, color: css}` | object | You specify two points and it builds in a filled-in rectangle there.|
| `fill` | `{i: row: j: col, color: css}` | object | Given this point, fill that area with the specified color. |

License
-------
[Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0)
