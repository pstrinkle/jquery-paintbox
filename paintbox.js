/**
 * jquery-paintbox - jQuery Plugin to build out a grid-based coloring system
 * similar to MS Paint.
 * URL: http://pstrinkle.github.com/jquery-paintbox
 * Author: Patrick Trinkle <https://github.com/pstrinkle>
 * Version: 0.1
 * License: Apache 2
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
        penColor: 'black',
        penDown: false,
        cols: 50,
        rows: 50,
    }

    $.fn.paintbox = function(configOrCommand) {
        var dataName = 'paintbox';
            
        var buildIt = function(instance) {
            var el = instance.el;

            var clicked = function(event) {
                /* click's this is the individual element */
                $(this).css('background-color', instance.penColor);
            };
            var colorSelect = function(event) {
                instance.penColor = $(this).attr('id');
            };

            el.append($('<div>', {id: 'pen_box', style: 'clear:both;'}));
            el.append($('<div>', {id: 'master_box', style: 'clear:both;'}));

            var $dest = $('#master_box');
            var $pens = $('#pen_box');
            var i = 0, j = 0;
            var itm = 'box';

            /* fixup grid container. */
            var master_width = instance.cols * 10;
            var master_height = instance.rows * 10;
            $dest.css('width', master_width + 'px');
            $dest.css('height', master_height + 'px');
                    
            /* build grid */
            for (i = 0; i < instance.rows; i++) {
                for (j = 0; j < instance.cols; j++) {
                    var $n = $('<div>');
                    $n.css('width', '10px');
                    $n.css('height', '10px');
                    $n.css('background-color', 'white');
                    $n.css('float', 'left');
                    $n.css('display', 'inline');

                    $n.attr('id', i + ',' + j);
                    $n.on('click', clicked);
                    $n.addClass(itm);

                    $dest.append($n);
                }
            }

            $('.box').hover(function(event) {
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
                
            var colors = ['black', 'red', 'green', 'blue',
                          'white', 'yellow', 'pink'];
                
            /* create pen boxes. */
            $.each(colors, function(index, element) {
                var $color = $('<div>', {id: element, style: "float:left"});
                var $second = $('<div>', {style: "float:left"});
                $pens.append($color);
                $pens.append($second);
            });

            /* just do this next. */
            $.each($('#pen_box').children(), function(index, element) {
                $(element).css('width', '10px');
                $(element).css('height', '10px');
                $(element).css('float', 'left');
                $(element).css('display', 'inline');

                var id = $(element).attr('id');
                if (id) {
                    $(element).css('background-color', id);
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

        /* handle init here, I later plan to use other options, such as 
         * formatting.
         */
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

                instance = new PaintBox(config);
                el.data(dataName, instance);
                    
                buildIt(instance);
            }
        });
    }
}(jQuery));
