// Generated by CoffeeScript 1.6.1
(function() {

  $(function() {
    var add, change_buttons, checked_traits, deselect_all, invert, remove, removed_traits, select_all;
    checked_traits = null;
    select_all = function() {
      console.log("selected_all");
      return $(".trait_checkbox").prop('checked', true);
    };
    deselect_all = function() {
      return $(".trait_checkbox").prop('checked', false);
    };
    invert = function() {
      return $(".trait_checkbox").trigger('click');
    };
    add = function() {
      var traits;
      traits = $("#trait_table input:checked").map(function() {
        return $(this).val();
      }).get();
      console.log("checked length is:", traits.length);
      console.log("checked is:", traits);
      return $.colorbox({
        href: "/collections/add?traits=" + traits
      });
    };
    removed_traits = function() {
      console.log('in removed_traits with checked_traits:', checked_traits);
      return checked_traits.closest("tr").fadeOut();
    };
    change_buttons = function() {
      var button, buttons, item, num_checked, text, _i, _j, _k, _l, _len, _len1, _len2, _len3, _results, _results1;
      buttons = ["#add", "#remove"];
      num_checked = $('.trait_checkbox:checked').length;
      console.log("num_checked is:", num_checked);
      if (num_checked === 0) {
        for (_i = 0, _len = buttons.length; _i < _len; _i++) {
          button = buttons[_i];
          $(button).prop("disabled", true);
        }
      } else {
        for (_j = 0, _len1 = buttons.length; _j < _len1; _j++) {
          button = buttons[_j];
          $(button).prop("disabled", false);
        }
      }
      if (num_checked > 1) {
        console.log("in loop");
        _results = [];
        for (_k = 0, _len2 = buttons.length; _k < _len2; _k++) {
          item = buttons[_k];
          console.log("  processing item:", item);
          text = $(item).html();
          if (text.indexOf("Records") === -1) {
            text = text.replace("Record", "Records");
            _results.push($(item).html(text));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      } else {
        console.log("in loop");
        _results1 = [];
        for (_l = 0, _len3 = buttons.length; _l < _len3; _l++) {
          item = buttons[_l];
          console.log("  processing item:", item);
          text = $(item).html();
          text = text.replace("Records", "Record");
          _results1.push($(item).html(text));
        }
        return _results1;
      }
    };
    remove = function() {
      var traits, uc_id;
      checked_traits = $("#trait_table input:checked");
      traits = checked_traits.map(function() {
        return $(this).val();
      }).get();
      console.log("checked length is:", traits.length);
      console.log("checked is:", traits);
      uc_id = $("#uc_id").val();
      console.log("uc.id is:", uc_id);
      return $.ajax({
        type: "POST",
        url: "/collections/remove",
        data: {
          uc_id: uc_id,
          traits: traits
        },
        success: removed_traits
      });
    };
    $("#select_all").click(select_all);
    $("#deselect_all").click(deselect_all);
    $("#invert").click(invert);
    $("#add").click(add);
    $("#remove").click(remove);
    $('.trait_checkbox').click(change_buttons);
    return $('.btn').click(change_buttons);
  });

}).call(this);
