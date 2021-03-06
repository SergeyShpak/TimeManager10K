'use strict';

var time_val_fixt = {
    ms_val: (12 * 3600 + 20 * 60 + 10) * 1000,
    time_str: "12:20:10",
    h: 12,
    m: 20,
    s: 10
};

var greater_time_val_fixt = {
    ms_val: (12 * 3600 + 21 * 60 + 9) * 1000,
    time_str: "12:21:09",
    h: 12,
    m: 21,
    s: 9
};

var smaller_time_val_fixt = {
    ms_val: (10 * 3600 + 7 * 60 + 12) * 1000,
    time_str: "10:07:12",
    h: 10,
    m: 7,
    s: 12
};

var big_time_val_fixt = {
    ms_val: (25 * 3600 + 59 * 60 + 59) * 1000,
    time_str: "25:59:59",
    h: 25,
    m: 59,
    s: 59
};

var valid_seconds_strings = ["20", "05", "5", "0", "00"];
var valid_minutes_strings = ["1:05", "1:5", "0:05", "13:12", "00:03"];
var valid_hours_strings = ["10:11:12", "09:11:12", "11:4:12", "11:43:5",
                            "45:05:12"];
var invalid_seconds_strings = ["61", "-10", "", ":01", "12aj", "001"];
var invalid_minutes_strings = ["12:", "65:01", "as:12", "-10:12", "001:12", 
                                ":12:"];
var invalid_hours_strings = ["12:", "as:12:13", "-10:12:05", "001:12:11"];

describe('TimeObject', function() {
    describe('Instantiate', function() {
        it('Should instantiate correctly from ms_time val', function() {
            var ms_val = time_val_fixt.ms_val;
            var time_obj = new TimeObject(ms_val);
            chai.assert.equal(time_val_fixt.h, time_obj.hours());
            chai.assert.equal(time_val_fixt.m, time_obj.minutes());
            chai.assert.equal(time_val_fixt.s, time_obj.seconds());
      });
        
        it('Should instantiate correctly from well-formed string', function() {
            var time_str = time_val_fixt.time_str;
            var time_obj = new TimeObject(time_str);
            chai.assert.equal(time_val_fixt.h, time_obj.hours());
            chai.assert.equal(time_val_fixt.m, time_obj.minutes());
            chai.assert.equal(time_val_fixt.s, time_obj.seconds());
        });
       
        it(['Should raise a TypeError when instantiated not with a number or ',
            'a string.'].join(""), function() {
            chai.expect(function() {
                var time_obj = new TimeObject({});
            }).to.throw(TypeError);
        });

        it('New object should be an instance of TimeObject.', function() {
            var time_obj = new TimeObject(time_val_fixt.ms_val);
            chai.assert.instanceOf(time_obj, TimeObject);
        });
    });
    
    describe('ParseMsTime', function() {
        it(['Should return an object with fields "h", "m", and "s" with ',
            'valid values.'].join(""), function() {
            var ms_val = time_val_fixt.ms_val;
            var parsed_time = TimeObject.parseMsTime(ms_val);
            chai.assert.isTrue(parsed_time.hasOwnProperty("h"));
            chai.assert.isTrue(parsed_time.hasOwnProperty("m"));
            chai.assert.isTrue(parsed_time.hasOwnProperty("s"));
            chai.assert.equal(time_val_fixt.h, parsed_time.h);
            chai.assert.equal(time_val_fixt.m, parsed_time.m);
            chai.assert.equal(time_val_fixt.s, parsed_time.s);
        });
    });

    describe('ParseTimeString', function() {
        it(['Should return an object with fields "h", "m", and "s" with ',
            'valid values.'].join(""), function() {
            var time_str = time_val_fixt.time_str;
            var parsed_time = TimeObject.parseTimeString(time_str);
            chai.assert.isTrue(parsed_time.hasOwnProperty("h"));
            chai.assert.isTrue(parsed_time.hasOwnProperty("m"));
            chai.assert.isTrue(parsed_time.hasOwnProperty("s"));
            chai.assert.equal(time_val_fixt.h, parsed_time.h);
            chai.assert.equal(time_val_fixt.m, parsed_time.m);
            chai.assert.equal(time_val_fixt.s, parsed_time.s);
        });
    });
    
    describe('isValidTimeString', function() {
        it('Should recognize valid strings.', function(){
            var current_string;
            var fail_message;
            var test_strings = 
                valid_seconds_strings.concat(valid_minutes_strings, 
                                            valid_hours_strings);
            for (var i = 0; i < test_strings.length; i++) {
                current_string = test_strings[i];
                fail_message = ['String "', current_string, '" does not ',
                        'appear to be valid, although it should.'].join("");
                chai.assert.isTrue(
                    TimeObject.isValidTimeString(current_string), 
                    fail_message);
            } 
        });

        it('Should recognize invalid strings.', function(){
            var current_string;
            var fail_message;
            var test_strings = 
                invalid_seconds_strings.concat(invalid_minutes_strings, 
                                                invalid_hours_strings);
            for (var i = 0; i < test_strings.length; i++) {
                current_string = test_strings[i];
                fail_message = ['String "', current_string, '" appears to be ',
                                'valid, although it should not.'].join("");
                chai.assert.isFalse(
                    TimeObject.isValidTimeString(current_string), 
                    fail_message);
            } 
        });
    });

    describe('add', function() {
        it ('Should add TimeObjects correctly.', function() {
            var time_val = new TimeObject(time_val_fixt.ms_val);
            var smaller_time_val = 
                new TimeObject(smaller_time_val_fixt.ms_val);
            time_val.add(smaller_time_val);
            chai.assert.equal(22, time_val.hours());
            chai.assert.equal(27, time_val.minutes());
            chai.assert.equal(22, time_val.seconds());
            chai.assert.equal((22 * 3600 + 27 * 60 + 22) * 1000, 
                                    time_val.total_ms()); 
        });

        it ('Should add TimeObjects correctly (with "modulo" arithmetics).',
            function() {
                var time_val = new TimeObject(time_val_fixt.ms_val);
                var big_time_val = new TimeObject(big_time_val_fixt.ms_val);
                time_val.add(big_time_val);
                chai.assert.equal(38, time_val.hours());
                chai.assert.equal(20, time_val.minutes());
                chai.assert.equal(9, time_val.seconds());
                chai.assert.equal((38 * 3600 + 20 * 60 + 9) * 1000, 
                                        time_val.total_ms());

            });

        it ('Should not change added object.',
            function() {
                var time_val = new TimeObject(time_val_fixt.ms_val);
                var big_time_val = new TimeObject(big_time_val_fixt.ms_val);
                var prev_hours = big_time_val.hours();
                var prev_minutes = big_time_val.minutes();
                var prev_seconds = big_time_val.seconds();
                var prev_total_ms = big_time_val.total_ms();
                time_val.add(big_time_val);
                chai.assert.equal(prev_hours, big_time_val.hours());
                chai.assert.equal(prev_minutes, big_time_val.minutes());
                chai.assert.equal(prev_seconds, big_time_val.seconds());
                chai.assert.equal(prev_total_ms, big_time_val.total_ms());
            });
    });

    describe('sub', function() {
        it('Should sub TimeObjects correctly.', function() {
            var time_val = new TimeObject(time_val_fixt.ms_val);
            var big_time_val = new TimeObject(big_time_val_fixt.ms_val);
            big_time_val.sub(time_val);
            chai.assert.equal(13, big_time_val.hours());
            chai.assert.equal(39, big_time_val.minutes());
            chai.assert.equal(49, big_time_val.seconds());
            chai.assert.equal((13 * 3600 + 39 * 60 + 49) * 1000,
                                        big_time_val.total_ms());
        }); 

        it('Should set time to zero, when sub results in a negative value.',
            function() {
                var time_val = new TimeObject(time_val_fixt.ms_val);
                var big_time_val = new TimeObject(big_time_val_fixt.ms_val);    
                time_val.sub(big_time_val);
                chai.assert.equal(0, time_val.hours());
                chai.assert.equal(0, time_val.minutes());
                chai.assert.equal(0, time_val.seconds());
                chai.assert.equal(0, time_val.total_ms());
            });

        it('Should sub TimeObjects correctly (with "modulo" arithmetics).',
            function() {
                var time_val = new TimeObject(time_val_fixt.ms_val);
                var greater_time_val = 
                                new TimeObject(greater_time_val_fixt.ms_val);
                greater_time_val.sub(time_val);
                chai.assert.equal(0, greater_time_val.hours());
                chai.assert.equal(0, greater_time_val.minutes());
                chai.assert.equal(59, greater_time_val.seconds());
                chai.assert.equal(59 * 1000, greater_time_val.total_ms());
            });

        it('Should not change subed object.', function() {
            var time_val = new TimeObject(time_val_fixt.ms_val);
            var big_time_val = new TimeObject(big_time_val_fixt.ms_val);
            var hours = time_val.hours();
            var minutes = time_val.minutes();
            var seconds = time_val.seconds();
            var total_ms = time_val.total_ms();
            big_time_val.sub(time_val);
            chai.assert.equal(hours, time_val.hours());
            chai.assert.equal(minutes, time_val.minutes());
            chai.assert.equal(seconds, time_val.seconds());
        });
    });

    describe('toString', function() {
        it('Should return correct string representation.', function() {
            var time_val = new TimeObject(time_val_fixt.ms_val);
            var time_str = time_val.toString();
            chai.assert.equal(time_val_fixt.time_str, time_str);
        });
    });

    describe('compareTo', function() {
        it('Should compare TimeObjects correctly.', function() {
            var time_val = new TimeObject(time_val_fixt.ms_val);
            var greater_time_val = 
                                new TimeObject(greater_time_val_fixt.ms_val);
            var smaller_time_val = 
                                new TimeObject(smaller_time_val_fixt.ms_val);
            var same_val = new TimeObject(time_val_fixt.ms_val);
            var smaller_compare_result = time_val.compareTo(smaller_time_val);
            var greater_compare_result = time_val.compareTo(greater_time_val);
            var same_compare_result = time_val.compareTo(same_val);
            chai.assert.isAbove(smaller_compare_result, 0);
            chai.assert.isBelow(greater_compare_result, 0);
            chai.assert.equal(same_compare_result, 0);
        });

        it(['Should throw a TypeError when compared object.', 
            'is not a TimeObject.'].join(""), function() {
                var some_obj = {some_field: 10};
                var time_val = new TimeObject(time_val_fixt.ms_val);
                chai.expect(function() {
                    time_val.compareTo(some_obj);
                }).to.throw(TypeError);
        });
    });

    describe('valueOf', function() {
        it('Should return time in milliseconds.', function() {
            var time_val = new TimeObject(time_val_fixt.ms_val);
            var value = time_val.valueOf();
            chai.assert.equal(value, time_val_fixt.ms_val);
        });
    });

    describe('copy', function() {
        it('Should perform a deep copy.', function() {
            var time_val = new TimeObject(time_val_fixt.ms_val);
            var copy = time_val.copy();
            chai.assert.equal(time_val.hours(), copy.hours());
            chai.assert.equal(time_val.minutes(), copy.minutes());
            chai.assert.equal(time_val.seconds(), copy.seconds());
            chai.assert.notStrictEqual(time_val, copy);
        });
    });
});
