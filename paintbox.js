/**
 * jquery-paintbox - jQuery Plugin to build out a grid-based coloring system
 * similar to MS Paint.
 * URL: http://pstrinkle.github.com/jquery-paintbox
 * Author: Patrick Trinkle <https://github.com/pstrinkle>
 * Version: 0.1
 * Copyright 2016 Patrick Trinkle
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function ($) {
    function PaintBox(config) {
        this.init(config);
    }

    PaintBox.prototype = {

        constructor: PaintBox,

        init: function(config) {
            $.extend(this, config);
        },

        el: null,
        elId: '',
        interactive: true,
        penColor: 'black',
        penDown: false,
        cols: 50,
        rows: 50,
        cell: 10,
        colors : ['black', 'red', 'green', 'blue', 'white', 'yellow', 'pink'],
    }

    /**
     * Set up a paintbox.
     * 
     * @param configOrCommand - Config object or command name
     *     Example: { ... };
     *     you may set any public property (see above);
     *
     * @param commandArgument - Some commands (like 'increment') may require an 
     *     argument
     */
    $.fn.paintbox = function(configOrCommand, commandArgument) {
        var dataName = 'paintbox';
        
        var paintFill = function(instance, i, j, off, color) {
            /* given some point, recursively crawl outward filling until a
             * border is hit.
             */
            var eid = instance.elId;
            var id = eid + '_' + i + ',' + j;
            var cell = document.getElementById(id);
            var current = $(cell).css('background-color');

            /* XXX: support instance.off */
            if (current != off) {
                /* I'm not sure I should break out on this condition. */
                return;
            } else {
                $(cell).css('background-color', color);
            }

            /* go up. */
            if (i > 0) {
                paintFill(instance, i-1, j, off, color);
            }

            /* go down. */
            if (i < instance.rows) {
                paintFill(instance, i+1, j, off, color);
            }

            /* go left. */
            if (j > 0) {
                paintFill(instance, i, j-1, off, color);
            }

            /* go right. */
            if (j < instance.cols) {
                paintFill(instance, i, j+1, off, color);
            }
        };

        var buildIt = function(instance) {
            var el = instance.el;
            var baseId = instance.elId;

            var clicked = function(event) {
                /* click's this is the individual element */
                $(this).css('background-color', instance.penColor);
            };
            var colorSelect = function(event) {
                instance.penColor = $(this).data('color');
            };

            el.append($('<div>', {id: baseId + 'pen_box', style: 'clear:both;'}));
            el.append($('<div>', {id: baseId + 'master_box', style: 'clear:both;'}));

            var mId = '#' + baseId + 'master_box';            
            var $dest = $(mId);
            var $pens = $('#' + baseId + 'pen_box');
            var i = 0, j = 0;
            var itm = 'box';

            /* fixup grid container. */
            var master_width = instance.cols * instance.cell;
            var master_height = instance.rows * instance.cell;
            $dest.css('width', master_width + 'px');
            $dest.css('height', master_height + 'px');

            var dim = instance.cell + 'px';

            /* build grid */
            for (i = 0; i < instance.rows; i++) {
                for (j = 0; j < instance.cols; j++) {
                    var $n = $('<div>');
                    $n.css('width', dim);
                    $n.css('height', dim);
                    $n.css('background-color', 'white');
                    $n.css('float', 'left');
                    $n.css('display', 'inline');
                    $n.attr('id', baseId + '_' + i + ',' + j);
                    if (instance.interactive) {
                        $n.on('click', clicked);	
                    }

                    $n.addClass(itm);

                    $dest.append($n);
                }
            }

            if (instance.interactive) {
                /* this won't work with multiple paintbox's on the same page. */
                $(mId + ' .box').hover(function(event) {
                    /* if pen is selected, and mousedown has been activated, 
                     * then we draw, otherwise we temporarily hover.
                     */                        
                    $(this).css('border', '1px solid ' + instance.penColor);

                    if (instance.penDown) {
                        $(this).css('background-color', instance.penColor);
                    }
                }, function(event) {
                    /* if pen is selected, and mousedown has been activated, 
                     * don't undo things.
                     */
                    $(this).css('border', 'none');
                });

                /* Create the pen boxes. */
                if (instance.colors.length == 0) {
                    throw Error("No color palette specified!");
                }

                /* Set default starting color to one of the provided (or 
                 * default)
                 */
                instance.penColor = instance.colors[0];

                /* create pen boxes. */
                $.each(instance.colors, function(index, element) {
                    var $color = $('<div>', {id: 'color_' + index, style: "float:left"});
                    $color.data('color', element);
                    $pens.append($color);
                });

                /* just do this next. */
                $.each($pens.children(), function(index, element) {
                    $(element).css('width', '10px');
                    $(element).css('height', '10px');
                    $(element).css('float', 'left');
                    $(element).css('display', 'inline');

                    /* Seems silly but originally we had spacer cells that didn't 
                     * have IDs.
                     */
                    var id = $(element).attr('id');
                    if (id) {
                        var color = $(element).data('color');
                        $(element).css('background-color', color);
                        $(element).on('click', colorSelect);

                        if (id === 'black') {
                            $(element).css('border', '1px solid white');
                        } else {
                            $(element).css('border', '1px solid black');
                        }
                    }
                });

                $dest.on('mousedown', function(event) {
                    instance.penDown = true;
                });
                $dest.on('mouseup', function(event) {
                    instance.penDown = false;
                });
                $dest.on('mouseleave', function(event) {
                    instance.penDown = false;
                });

            } /* end interactive only */
        }; /* end buildIt() */

        if (typeof configOrCommand == 'string') {
            if (configOrCommand === 'cell') {
                /* you want to update this here in case they call it a lot. */
                return this.each(function() {
                    var instance = $(this).data(dataName);
                    var eid = instance.elId;
                    var i = commandArgument.i;
                    var j = commandArgument.j;
                    
                    if (i < 0 || i >= instance.rows) {
                        throw Error("Invalid row: " + i);
                    }
                    if (j < 0 || j >= instance.cols) {
                        throw Error("Invalid column: " + j);
                    }

                    var id = eid + '_' + i + ',' + j;
                    var cell = document.getElementById(id);
                    $(cell).css('background-color', commandArgument.color);
                });
            } else if (configOrCommand === 'line') {
                /* you want to update this here in case they call it a lot. */
                return this.each(function() {
                    var instance = $(this).data(dataName);
                    var eid = instance.elId;
                    var i = commandArgument.i;
                    var j = commandArgument.j;
                    var dir = commandArgument.direction;
                    var len = commandArgument.length;

                    /* XXX: could handle line with rect. ;) */
                    if (i < 0 || i >= instance.rows) {
                        throw Error("Invalid row: " + i);
                    }
                    if (j < 0 || j >= instance.cols) {
                        throw Error("Invalid column: " + j);
                    }

                    if (dir === 'left' && j - (len-1) < 0) {
                        throw Error("Invalid length: " + len);
                    } else if (dir === 'right' && j + (len-1) >= instance.cols) {
                        throw Error("Invalid length: " + len);
                    } else if (dir === 'up' && i - (len-1) < 0) {
                        throw Error("Invalid length: " + len);
                    } else if (dir === 'down' && i + (len-1) >= instance.rows) {
                        throw Error("Invalid length: " + len);
                    }

                    if (dir === 'left' || dir === 'right') {
                        var start = 0;
                        var b = 0;
                        if (dir === 'left') {
                            start = j - len+1;
                        } else {
                            start = j;
                        }

                        j = start;

                        for (b = 0; b < len; b++) {
                            var this_j = j + b;
                            var id = eid + '_' + i + ',' + this_j;
                            var cell = document.getElementById(id);
                            $(cell).css('background-color', commandArgument.color);
                        }
                    } else if (dir === 'up' || dir === 'down') {
                        var start = 0;
                        var b = 0;
                        if (dir === 'up') {
                            start = i - len+1;
                        } else {
                            start = i;
                        }

                        i = start;

                        for (b = 0; b < len; b++) {
                            var this_i = i + b;
                            var id = eid + '_' + this_i + ',' + j;
                            var cell = document.getElementById(id);
                            $(cell).css('background-color', commandArgument.color);
                        }
                    } else {
                        throw Error("Invalid direction: " + dir);
                    }

                    var id = eid + '_' + i + ',' + j;
                    var cell = document.getElementById(id);
                    $(cell).css('background-color', commandArgument.color);
                });
            } else if (configOrCommand === 'rect') {
                /* you want to update this here in case they call it a lot. */
                return this.each(function() {
                    var instance = $(this).data(dataName);
                    var eid = instance.elId;
                    var i1 = commandArgument.i;
                    var j1 = commandArgument.j;
                    var i2 = commandArgument.i2;
                    var j2 = commandArgument.j2;

                    if (i1 < 0 || i1 >= instance.rows) {
                        throw Error("Invalid row: " + i1);
                    }
                    if (j1 < 0 || j1 >= instance.cols) {
                        throw Error("Invalid column: " + j1);
                    }
                    if (i2 < 0 || i2 >= instance.rows) {
                        throw Error("Invalid row: " + i2);
                    }
                    if (j2 < 0 || j2 >= instance.cols) {
                        throw Error("Invalid column: " + j2);
                    }                    

                    /* find upper left point. */
                    var x0 = (i1 > i2) ? i2 : i1;
                    var y0 = (j1 > j2) ? j2 : j1;
                    /* find lower right point. */
                    var x1 = (i1 > i2) ? i1 : i2;
                    var y1 = (j1 > j2) ? j1 : j2;

                    for (i = x0; i <= x1; i++) {
                        for (j = y0; j <= y1; j++) {
                            var id = eid + '_' + i + ',' + j;
                            var cell = document.getElementById(id);
                            $(cell).css('background-color', commandArgument.color);
                        }
                    }
                });
            } else if (configOrCommand === 'fill') {
                /* you want to update this here in case they call it a lot. */
                return this.each(function() {
                    var instance = $(this).data(dataName);
                    var eid = instance.elId;
                    var i = commandArgument.i;
                    var j = commandArgument.j;
                    /* Really I think it'll fill any color with another, so
                     * you could click on a blue thing and turn it and all
                     * other connected blue area.
                     */

                    if (i < 0 || i >= instance.rows) {
                        throw Error("Invalid row: " + i);
                    }
                    if (j < 0 || j >= instance.cols) {
                        throw Error("Invalid column: " + j);
                    }

                    var id = eid + '_' + i + ',' + j;
                    var cell = document.getElementById(id);
                    var current = $(cell).css('background-color');

                    paintFill(instance, i, j, current, commandArgument.color);
                });
            }
        }

        return this.each(function() {
            var el = $(this), instance = el.data(dataName),
                config = $.isPlainObject(configOrCommand) ? configOrCommand : {};

            if (instance) {
                instance.init(config); 
                buildIt(instance);
            } else {
                var initialConfig = $.extend({}, el.data());
                config = $.extend(initialConfig, config);
                config.el = el;
                config.elId = el.attr('id');
                // throw exception if no ID is set for this.

                instance = new PaintBox(config);
                el.data(dataName, instance);

                buildIt(instance);
            }
        });
    }
}(jQuery));
