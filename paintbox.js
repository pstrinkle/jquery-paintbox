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

                    $n.attr('id', i + ',' + j);
                    $n.on('click', clicked);
                    $n.addClass(itm);

                    $dest.append($n);
                }
            }

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

            /* set default starting color to one of the provided (or default) */
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
        };

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
